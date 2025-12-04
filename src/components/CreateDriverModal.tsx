import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_CONFIG, ENDPOINTS, createHeaders } from "@/api/config";
import { AlertCircle, Loader2 } from "lucide-react";

interface CreateDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateDriverModal = ({ isOpen, onClose }: CreateDriverModalProps) => {
  const [formData, setFormData] = useState({
    driverId: "",
    name: "",
    password: "",
    licenseNo: "",
    phone: "",
  });
  const [error, setError] = useState("");

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${ENDPOINTS.ADMIN.FLEET_DRIVERS}`,
        {
          method: "POST",
          headers: createHeaders(true),
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create driver");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fleetDrivers"] });
      onClose();
      setFormData({ driverId: "", name: "", password: "", licenseNo: "", phone: "" });
      setError("");
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.driverId || !formData.name || !formData.password || !formData.licenseNo || !formData.phone) {
      setError("All fields are required");
      return;
    }
    mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Driver</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="driverId">Driver ID</Label>
            <Input
              id="driverId"
              value={formData.driverId}
              onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
              placeholder="e.g., D-1001"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="licenseNo">License Number</Label>
            <Input
              id="licenseNo"
              value={formData.licenseNo}
              onChange={(e) => setFormData({ ...formData, licenseNo: e.target.value })}
              placeholder="DL-123456789"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 9876543210"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Driver
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDriverModal;
