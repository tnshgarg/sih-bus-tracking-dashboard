import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Maximize, Network, ZoomIn, ZoomOut, ArrowLeft, Map as MapIcon, Minimize, Expand } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllRoutes } from "@/api/admin";
import { getAllLiveBuses } from "@/api/app";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface Stop {
  name: string;
  lat: number;
  lng: number;
}

interface Route {
  route_id: string;
  name: string;
  stops: Stop[];
}

interface Bus {
  bus_id: string;
  route_id: string;
  route_name: string;
  lat: number;
  lng: number;
  passenger_load_pct: number;
  next_stop: string;
}

const NetworkGraphView = () => {
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState<'macro' | 'micro'>('macro');
  const [selectedMacroEdge, setSelectedMacroEdge] = useState<any | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const { data: routesData, isLoading: routesLoading } = useQuery({
    queryKey: ["allRoutes"],
    queryFn: getAllRoutes,
  });

  const { data: busesData, isLoading: busesLoading } = useQuery({
    queryKey: ["liveBuses"],
    queryFn: getAllLiveBuses,
    refetchInterval: 5000,
  });

  const routes: Route[] = routesData?.routes || [];
  const buses: Bus[] = busesData?.buses || [];

  // 1. Identify Hubs
  const hubs = useMemo(() => {
    const hubSet = new Set<string>();
    routes.forEach(route => {
      if (route.stops.length > 0) {
        hubSet.add(route.stops[0].name.toLowerCase().trim());
        hubSet.add(route.stops[route.stops.length - 1].name.toLowerCase().trim());
      }
    });
    return hubSet;
  }, [routes]);

  // 2. Build Graph Data (Linear Layout)
  const graphData = useMemo(() => {
    if (!routes.length) return { macro: { nodes: {}, edges: [], width: 1000 }, micro: null };

    // --- MACRO VIEW BUILDER ---
    const macroNodes: Record<string, any> = {};
    const macroEdges: Record<string, any> = {};

    // Helper to get/create macro node
    const getMacroNode = (stop: Stop) => {
      const id = stop.name.toLowerCase().trim();
      if (!macroNodes[id]) {
        macroNodes[id] = { ...stop, id, type: 'hub' };
      }
      return macroNodes[id];
    };

    routes.forEach(route => {
      const routeHubs = route.stops.filter(stop => hubs.has(stop.name.toLowerCase().trim()));
      if (routeHubs.length < 2) return;

      for (let i = 0; i < routeHubs.length - 1; i++) {
        const fromHub = routeHubs[i];
        const toHub = routeHubs[i+1];
        const fromId = fromHub.name.toLowerCase().trim();
        const toId = toHub.name.toLowerCase().trim();

        getMacroNode(fromHub);
        getMacroNode(toHub);

        const edgeKey = `${fromId}-${toId}`;
        if (!macroEdges[edgeKey]) {
          macroEdges[edgeKey] = {
            from: fromId,
            to: toId,
            routes: [],
            stops: [] // Store all stops in this segment for bus mapping
          };
        }
        macroEdges[edgeKey].routes.push(route);
        
        // Find stops between these hubs for this route
        const startIndex = route.stops.findIndex(s => s.name.toLowerCase().trim() === fromId);
        const endIndex = route.stops.findIndex(s => s.name.toLowerCase().trim() === toId);
        if (startIndex !== -1 && endIndex !== -1) {
           const segmentStops = startIndex < endIndex 
            ? route.stops.slice(startIndex, endIndex + 1)
            : route.stops.slice(endIndex, startIndex + 1).reverse();
           // Add to edge metadata (simplified, just keeping track that this edge covers these stops)
        }
      }
    });

    // --- LINEAR LAYOUT LOGIC ---
    // Sort nodes by Longitude (West -> East)
    const sortedNodeIds = Object.keys(macroNodes).sort((a, b) => {
      return macroNodes[a].lng - macroNodes[b].lng;
    });

    // Dynamic Width Calculation
    const MIN_WIDTH = 1000;
    const NODE_SPACING = 150;
    const TOTAL_WIDTH = Math.max(MIN_WIDTH, sortedNodeIds.length * NODE_SPACING + 200);
    const PADDING_X = 100;
    const BASE_Y = 500;

    // Normalize Latitudes for Y offset
    let minLat = Infinity, maxLat = -Infinity;
    Object.values(macroNodes).forEach((node: any) => {
      minLat = Math.min(minLat, node.lat);
      maxLat = Math.max(maxLat, node.lat);
    });
    const latSpan = maxLat - minLat || 0.01;

    sortedNodeIds.forEach((id, index) => {
      const node = macroNodes[id];
      
      // X: Equidistant steps
      const xStep = (TOTAL_WIDTH - 2 * PADDING_X) / Math.max(1, sortedNodeIds.length - 1);
      node.x = PADDING_X + index * xStep;

      // Y: Deviation from center based on Lat
      const normalizedLat = (node.lat - minLat) / latSpan; // 0..1
      const yDeviation = (normalizedLat - 0.5) * -300; // Increased vertical spread
      node.y = BASE_Y + yDeviation;
    });

    return {
      macro: { nodes: macroNodes, edges: Object.values(macroEdges), width: TOTAL_WIDTH },
    };
  }, [routes, hubs]);

  // 3. Derived Micro Graph
  const microGraph = useMemo(() => {
    if (!selectedMacroEdge) return null;

    const relevantRoutes = selectedMacroEdge.routes;
    const fromHubId = selectedMacroEdge.from;
    const toHubId = selectedMacroEdge.to;

    const microNodes: Record<string, any> = {};
    const microEdges: any[] = [];

    // Collect all unique stops in this segment
    const uniqueStopsMap = new Map<string, Stop>();
    
    relevantRoutes.forEach((route: Route) => {
      const startIndex = route.stops.findIndex((s) => s.name.toLowerCase().trim() === fromHubId);
      const endIndex = route.stops.findIndex((s) => s.name.toLowerCase().trim() === toHubId);
      if (startIndex === -1 || endIndex === -1) return;

      const segmentStops = startIndex < endIndex 
        ? route.stops.slice(startIndex, endIndex + 1)
        : route.stops.slice(endIndex, startIndex + 1).reverse();

      segmentStops.forEach((stop) => {
        uniqueStopsMap.set(stop.name.toLowerCase().trim(), stop);
      });
    });

    // Sort stops by Longitude
    const sortedStops = Array.from(uniqueStopsMap.values()).sort((a, b) => a.lng - b.lng);
    
    // Dynamic Width for Micro View
    const MIN_WIDTH = 1000;
    const STOP_SPACING = 100;
    const TOTAL_WIDTH = Math.max(MIN_WIDTH, sortedStops.length * STOP_SPACING + 200);
    const PADDING = 100;
    const BASE_Y = 500;
    
    sortedStops.forEach((stop, index) => {
      const id = stop.name.toLowerCase().trim();
      microNodes[id] = {
        ...stop,
        id,
        x: PADDING + (index / Math.max(1, sortedStops.length - 1)) * (TOTAL_WIDTH - 2 * PADDING),
        y: BASE_Y
      };
    });

    // Build Edges
    relevantRoutes.forEach((route: Route) => {
      const startIndex = route.stops.findIndex((s) => s.name.toLowerCase().trim() === fromHubId);
      const endIndex = route.stops.findIndex((s) => s.name.toLowerCase().trim() === toHubId);
      if (startIndex === -1 || endIndex === -1) return;

      const segmentStops = startIndex < endIndex 
        ? route.stops.slice(startIndex, endIndex + 1)
        : route.stops.slice(endIndex, startIndex + 1).reverse();

      let pathD = "";
      const color = `hsl(${(route.route_id.length * 137.5) % 360}, 70%, 50%)`;
      
      const routeIndex = relevantRoutes.indexOf(route);
      const yOffset = (routeIndex - relevantRoutes.length / 2) * 30; // Increased spacing

      segmentStops.forEach((stop, idx) => {
        const node = microNodes[stop.name.toLowerCase().trim()];
        if (!node) return;
        
        const x = node.x;
        const y = node.y + yOffset;

        if (idx === 0) pathD += `M ${x} ${y}`;
        else pathD += ` L ${x} ${y}`;
      });

      microEdges.push({ path: pathD, color, routeName: route.name, yOffset, routeId: route.route_id });
    });

    return { nodes: microNodes, edges: microEdges, sortedStops, width: TOTAL_WIDTH };
  }, [selectedMacroEdge]);

  // 4. Advanced Bus Positioning
  const getBusPosition = (bus: Bus) => {
    // Helper to find position between two nodes
    const interpolate = (nodeA: any, nodeB: any, ratio: number = 0.5) => {
      return {
        x: nodeA.x + (nodeB.x - nodeA.x) * ratio,
        y: nodeA.y + (nodeB.y - nodeA.y) * ratio
      };
    };

    // Find the route this bus is on
    const route = routes.find(r => r.route_id === bus.route_id);
    if (!route) return { x: 0, y: 0, visible: false };

    // Find the next stop index
    const nextStopIndex = route.stops.findIndex(s => s.name === bus.next_stop);
    if (nextStopIndex === -1) return { x: 0, y: 0, visible: false };

    // Identify the segment (prevStop -> nextStop)
    // If it's the first stop, just use the first stop position
    const prevStop = nextStopIndex > 0 ? route.stops[nextStopIndex - 1] : route.stops[0];
    const nextStop = route.stops[nextStopIndex];

    const prevId = prevStop.name.toLowerCase().trim();
    const nextId = nextStop.name.toLowerCase().trim();

    if (viewMode === 'macro') {
      // In Macro view, we need to map these stops to the Macro Nodes (Hubs)
      // We need to find which "Hub Segment" this bus is currently in.
      
      // Find the nearest preceding Hub
      let prevHub = route.stops[0];
      for (let i = nextStopIndex - 1; i >= 0; i--) {
        if (hubs.has(route.stops[i].name.toLowerCase().trim())) {
          prevHub = route.stops[i];
          break;
        }
      }

      // Find the nearest succeeding Hub
      let nextHub = route.stops[route.stops.length - 1];
      for (let i = nextStopIndex; i < route.stops.length; i++) {
        if (hubs.has(route.stops[i].name.toLowerCase().trim())) {
          nextHub = route.stops[i];
          break;
        }
      }

      const prevHubNode = graphData.macro.nodes[prevHub.name.toLowerCase().trim()];
      const nextHubNode = graphData.macro.nodes[nextHub.name.toLowerCase().trim()];

      if (!prevHubNode || !nextHubNode) return { x: 0, y: 0, visible: false };

      // If bus is exactly at a hub
      if (prevHubNode.id === nextHubNode.id) {
         return { x: prevHubNode.x, y: prevHubNode.y, visible: true };
      }

      // Interpolate between Hubs based on progress
      // Simple approximation: 50% progress between hubs
      // Better: Calculate distance ratio if we had distances.
      // For now, place it somewhat randomly or fixed 50% to show it's "in transit"
      // Or use lat/lng interpolation relative to the two hubs
      
      // Project bus lat/lng onto the line segment between prevHub and nextHub
      const dx = nextHubNode.x - prevHubNode.x;
      const dy = nextHubNode.y - prevHubNode.y;
      
      // Simple linear interpolation based on stop index could be better?
      // Let's use a simple 0.5 for "in transit" between hubs, or randomize slightly to avoid stacking
      const randomOffset = (parseInt(bus.bus_id.replace(/\D/g, '')) % 10) / 20; // 0.0 to 0.5
      const ratio = 0.3 + randomOffset; // 0.3 to 0.8

      return {
        x: prevHubNode.x + dx * ratio,
        y: prevHubNode.y + dy * ratio,
        visible: true
      };

    } else {
      // Micro View
      if (!selectedMacroEdge || !microGraph) return { x: 0, y: 0, visible: false };

      // Check if this bus is relevant to the selected macro edge
      // The bus must be between the FromHub and ToHub of the selected edge
      const fromHubId = selectedMacroEdge.from;
      const toHubId = selectedMacroEdge.to;
      
      // Check if the bus's current segment is within this macro edge
      // We can check if the route matches AND if the next_stop is within the micro nodes
      const microNodeNext = microGraph.nodes[nextId];
      const microNodePrev = microGraph.nodes[prevId];

      if (!microNodeNext) return { x: 0, y: 0, visible: false }; // Bus is not in this segment

      // Calculate Y offset for the specific route
      const routeIndex = selectedMacroEdge.routes.findIndex((r: Route) => r.route_id === bus.route_id);
      if (routeIndex === -1) return { x: 0, y: 0, visible: false };
      
      const yOffset = (routeIndex - selectedMacroEdge.routes.length / 2) * 30;
      
      // Position
      let x, y;
      if (!microNodePrev) {
        // At start of segment
        x = microNodeNext.x;
        y = microNodeNext.y + yOffset;
      } else {
        // Interpolate
        const ratio = 0.5; // Place in middle of stop segment
        x = microNodePrev.x + (microNodeNext.x - microNodePrev.x) * ratio;
        y = (microNodePrev.y + yOffset) + ((microNodeNext.y + yOffset) - (microNodePrev.y + yOffset)) * ratio;
      }

      return { x, y, visible: true };
    }
  };

  const handleEdgeClick = (edge: any) => {
    setSelectedMacroEdge(edge);
    setViewMode('micro');
    setZoom(1);
  };

  const handleBack = () => {
    setViewMode('macro');
    setSelectedMacroEdge(null);
    setZoom(1);
  };

  if (routesLoading || busesLoading) {
    return (
      <Card className="lg:col-span-2 h-full">
        <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <Skeleton className="h-full w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  const currentNodes = viewMode === 'macro' ? graphData.macro.nodes : microGraph?.nodes || {};
  const currentEdges = viewMode === 'macro' ? graphData.macro.edges : microGraph?.edges || [];
  const currentWidth = viewMode === 'macro' ? graphData.macro.width : microGraph?.width || 1000;

  return (
    <Card className={cn(
      "lg:col-span-2 flex flex-col overflow-hidden transition-all duration-300",
      isFullScreen ? "fixed inset-0 z-50 rounded-none h-screen w-screen" : "h-full"
    )}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-card z-10 border-b">
        <div className="flex items-center space-x-2">
          {viewMode === 'micro' && (
            <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <CardTitle className="flex items-center space-x-2">
            {viewMode === 'macro' ? <MapIcon className="h-5 w-5 text-primary" /> : <Network className="h-5 w-5 text-primary" />}
            <span>{viewMode === 'macro' ? 'Inter-City Network' : `Route Details: ${selectedMacroEdge?.from} ↔ ${selectedMacroEdge?.to}`}</span>
            <Badge variant="outline" className="ml-2">{buses.length} Active</Badge>
          </CardTitle>
        </div>
        <div className="flex gap-2">
          <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setZoom(z => Math.min(2, z + 0.1))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" className="h-8" onClick={() => setZoom(1)}>
            <Maximize className="h-3 w-3 mr-1" />
            Fit
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 ml-2" onClick={() => setIsFullScreen(!isFullScreen)}>
            {isFullScreen ? <Minimize className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-[500px] p-0 relative bg-slate-50 dark:bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 overflow-auto flex items-center justify-center">
          <svg 
            className="h-full"
            style={{ 
              width: currentWidth, 
              minWidth: '100%',
              transform: `scale(${zoom})`, 
              transformOrigin: 'center center', 
              transition: 'transform 0.2s' 
            }}
            viewBox={`0 0 ${currentWidth} 1000`}
          >
            {/* Grid Pattern */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1"/>
              </pattern>
              {/* Glow Filter for High Load */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Edges */}
            {viewMode === 'macro' ? (
              // MACRO EDGES
              currentEdges.map((edge: any) => {
                const startNode = currentNodes[edge.from];
                const endNode = currentNodes[edge.to];
                if (!startNode || !endNode) return null;
                
                return (
                  <g 
                    key={`${edge.from}-${edge.to}`} 
                    onClick={() => handleEdgeClick(edge)}
                    className="cursor-pointer hover:opacity-80 transition-opacity group"
                  >
                    <line
                      x1={startNode.x}
                      y1={startNode.y}
                      x2={endNode.x}
                      y2={endNode.y}
                      stroke="#6366f1"
                      strokeWidth="6"
                      strokeLinecap="round"
                      className="group-hover:stroke-indigo-400 transition-colors"
                    />
                    <line
                      x1={startNode.x}
                      y1={startNode.y}
                      x2={endNode.x}
                      y2={endNode.y}
                      stroke="transparent"
                      strokeWidth="30"
                    />
                    <circle 
                      cx={(startNode.x + endNode.x) / 2} 
                      cy={(startNode.y + endNode.y) / 2} 
                      r="14" 
                      fill="white" 
                      stroke="#6366f1"
                      strokeWidth="2"
                    />
                    <text
                      x={(startNode.x + endNode.x) / 2}
                      y={(startNode.y + endNode.y) / 2}
                      dy="5"
                      textAnchor="middle"
                      className="text-[10px] font-bold fill-indigo-600 pointer-events-none"
                    >
                      {edge.routes.length}
                    </text>
                  </g>
                );
              })
            ) : (
              // MICRO EDGES
              currentEdges.map((edge: any, i: number) => (
                <g key={i}>
                  <path
                    d={edge.path}
                    fill="none"
                    stroke={edge.color}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.8"
                  />
                  <text 
                    x={50} 
                    y={500 + edge.yOffset - 5} 
                    className="text-[10px] font-bold fill-muted-foreground"
                  >
                    {edge.routeName}
                  </text>
                </g>
              ))
            )}

            {/* Nodes */}
            {Object.values(currentNodes).map((node: any) => (
              <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                <circle
                  r={viewMode === 'macro' ? 12 : 6}
                  fill={viewMode === 'macro' ? "#1e293b" : "white"}
                  stroke={viewMode === 'macro' ? "white" : "#64748b"}
                  strokeWidth="2"
                  className="z-10 shadow-sm"
                />
                <text
                  y={viewMode === 'macro' ? 28 : 18}
                  textAnchor="middle"
                  className={`font-medium pointer-events-none ${viewMode === 'macro' ? 'text-sm fill-foreground font-bold' : 'text-[10px] fill-slate-600'}`}
                  style={{ textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}
                >
                  {node.name}
                </text>
              </g>
            ))}

            {/* Buses */}
            {buses.map((bus) => {
              const { x, y, visible } = getBusPosition(bus);
              if (!visible) return null;

              const isCrowded = bus.passenger_load_pct > 90;
              const isModerate = bus.passenger_load_pct > 70;
              
              const color = isCrowded ? "#ef4444" : isModerate ? "#f59e0b" : "#22c55e";
              
              return (
                <TooltipProvider key={bus.bus_id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <g 
                        className="cursor-pointer transition-all duration-1000 ease-linear"
                        style={{ transform: `translate(${x}px, ${y}px)` }}
                      >
                        {/* Pulse effect for crowded buses */}
                        {isCrowded && (
                          <circle r="12" fill={color} opacity="0.3">
                            <animate attributeName="r" from="8" to="16" dur="1.5s" repeatCount="indefinite" />
                            <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
                          </circle>
                        )}
                        <circle 
                          r={viewMode === 'macro' ? 6 : 8} 
                          fill={color} 
                          stroke="white" 
                          strokeWidth="2" 
                          filter={isCrowded ? "url(#glow)" : ""}
                        />
                      </g>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="font-bold">{bus.bus_id}</div>
                      <div className="text-xs">{bus.route_name}</div>
                      <div className="text-xs">Next: {bus.next_stop}</div>
                      <div className="text-xs">Load: {Math.round(bus.passenger_load_pct)}%</div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </svg>
        </div>

        {/* Legend Overlay */}
        <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur p-3 rounded-lg border shadow-sm text-xs z-20">
          <div className="font-semibold mb-2">{viewMode === 'macro' ? 'Major Connections' : 'Route Details'}</div>
          {viewMode === 'macro' ? (
            <div className="text-muted-foreground">
              Click on a connection line to see detailed routes.
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 border border-white"></div>
                <span>Normal Load (&lt;70%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500 border border-white"></div>
                <span>Moderate Load (70-90%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 border border-white animate-pulse"></div>
                <span>High Load (&gt;90%)</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkGraphView;
