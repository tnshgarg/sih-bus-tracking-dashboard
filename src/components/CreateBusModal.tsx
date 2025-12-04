import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_CONFIG, ENDPOINTS, createHeaders } from "@/api/config";
import { AlertCircle, Loader2 } from "lucide-react";

interface CreateBusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateBusModal = ({ isOpen, onClose }: CreateBusModalProps) => {
  const [formData, setFormData] = useState({
    busId: "",
    registrationNo: "",
    type: "Standard Non-AC",
    capacity: 50,
  });
  const [error, setError] = useState("");

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${ENDPOINTS.ADMIN.FLEET_BUSES}`,
        {
          method: "POST",
          headers: createHeaders(true),
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create bus");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fleetBuses"] });
      onClose();
      setFormData({ busId: "", registrationNo: "", type: "Standard Non-AC", capacity: 50 });
      setError("");
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.busId || !formData.registrationNo) {
      setError("Bus ID and Registration Number are required");
      return;
    }
    mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Bus</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="busId">Bus ID</Label>
            <Input
              id="busId"
              value={formData.busId}
              onChange={(e) => setFormData({ ...formData, busId: e.target.value })}
              placeholder="e.g., PB-01-1234"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="registrationNo">Registration Number</Label>
            <Input
              id="registrationNo"
              value={formData.registrationNo}
              onChange={(e) => setFormData({ ...formData, registrationNo: e.target.value })}
              placeholder="e.g., PB01AB1234"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type">Bus Type</Label>
            <select
              id="type"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="Standard Non-AC">Standard Non-AC</option>
              <option value="Standard AC">Standard AC</option>
              <option value="AC Sleeper">AC Sleeper</option>
              <option value="Volvo MultiAxle">Volvo MultiAxle</option>
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Bus
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBusModal;
