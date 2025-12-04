import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, MoveUp, MoveDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Stop {
  id: string;
  name: string;
  sequence: number;
}

interface StopsBuilderProps {
  stops: Stop[];
  onChange: (stops: Stop[]) => void;
}

export const StopsBuilder = ({ stops, onChange }: StopsBuilderProps) => {
  const [newStopName, setNewStopName] = useState("");

  const addStop = () => {
    if (!newStopName.trim()) return;
    
    const newStop: Stop = {
      id: `stop-${Date.now()}`,
      name: newStopName.trim(),
      sequence: stops.length + 1,
    };
    
    onChange([...stops, newStop]);
    setNewStopName("");
  };

  const removeStop = (id: string) => {
    const filtered = stops.filter(s => s.id !== id);
    // Resequence
    const resequenced = filtered.map((stop, index) => ({
      ...stop,
      sequence: index + 1,
    }));
    onChange(resequenced);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newStops = [...stops];
    [newStops[index - 1], newStops[index]] = [newStops[index], newStops[index - 1]];
    // Resequence
    const resequenced = newStops.map((stop, idx) => ({
      ...stop,
      sequence: idx + 1,
    }));
    onChange(resequenced);
  };

  const moveDown = (index: number) => {
    if (index === stops.length - 1) return;
    const newStops = [...stops];
    [newStops[index], newStops[index + 1]] = [newStops[index + 1], newStops[index]];
    // Resequence
    const resequenced = newStops.map((stop, idx) => ({
      ...stop,
      sequence: idx + 1,
    }));
    onChange(resequenced);
  };

  return (
    <div className="space-y-4">
      {/* Add new stop input */}
      <div className="flex gap-2">
        <Input
          placeholder="Enter stop name (e.g., Kartarpur, Beas)"
          value={newStopName}
          onChange={(e) => setNewStopName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addStop();
            }
          }}
        />
        <Button onClick={addStop} type="button" variant="secondary">
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      {/* Stops list */}
      {stops.length > 0 ? (
        <div className="space-y-2">
          <label className="text-sm font-medium">Route Stops ({stops.length})</label>
          <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-2">
            {stops.map((stop, index) => (
              <Card key={stop.id} className="bg-accent/30">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    {/* Sequence number */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">{stop.sequence}</span>
                    </div>

                    {/* Stop name */}
                    <div className="flex-1 font-medium">{stop.name}</div>

                    {/* Control buttons */}
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                        className="h-8 w-8 p-0"
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveDown(index)}
                        disabled={index === stops.length - 1}
                        className="h-8 w-8 p-0"
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStop(stop.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Use the arrow buttons to reorder stops. The order determines the route sequence.
          </p>
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed rounded-md">
          <p className="text-sm text-muted-foreground">No stops added yet</p>
          <p className="text-xs text-muted-foreground mt-1">Add stops above to build your route</p>
        </div>
      )}
    </div>
  );
};
