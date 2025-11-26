import { Button } from "@/components/ui/button";
import { 
  Megaphone, 
  PlusCircle, 
  Download, 
  PlayCircle,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const QuickActionsToolbar = () => {
  const handleAction = (action: string) => {
    toast.success(`Action Triggered: ${action}`, {
      description: "This request has been queued for processing.",
    });
  };

  return (
    <div className="flex items-center gap-2 bg-card border rounded-lg p-1 shadow-sm">
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 text-xs"
        onClick={() => handleAction("Broadcast Alert")}
      >
        <Megaphone className="h-3.5 w-3.5 mr-2 text-primary" />
        Broadcast Alert
      </Button>
      
      <div className="w-px h-4 bg-border mx-1" />
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 text-xs"
        onClick={() => handleAction("Add Spare Bus")}
      >
        <PlusCircle className="h-3.5 w-3.5 mr-2 text-success" />
        Add Spare Bus
      </Button>

      <div className="w-px h-4 bg-border mx-1" />

      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 text-xs"
        onClick={() => handleAction("Export CSV")}
      >
        <Download className="h-3.5 w-3.5 mr-2" />
        Export CSV
      </Button>

      <div className="w-px h-4 bg-border mx-1" />

      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 text-xs text-muted-foreground hover:text-foreground"
        onClick={() => handleAction("Simulate Realism")}
      >
        <PlayCircle className="h-3.5 w-3.5 mr-2" />
        Simulate (Dev)
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto">
            <MoreVertical className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleAction("System Diagnostics")}>
            System Diagnostics
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction("Manage Shifts")}>
            Manage Shifts
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default QuickActionsToolbar;
