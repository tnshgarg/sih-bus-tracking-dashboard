import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createConductor } from "@/api/admin";
import { AlertCircle, Loader2 } from "lucide-react";

interface CreateConductorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateConductorModal = ({ isOpen, onClose }: CreateConductorModalProps) => {
  const [formData, setFormData] = useState({
    conductorId: "",
    name: "",
    password: "",
    licenseNo: "",
    phone: "",
  });
  const [error, setError] = useState("");

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createConductor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fleetConductors"] });
      onClose();
      setFormData({
        conductorId: "",
        name: "",
        password: "",
        licenseNo: "",
        phone: "",
      });
      setError("");
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.conductorId || !formData.name || !formData.password || !formData.licenseNo || !formData.phone) {
      setError("All fields are required");
      return;
    }
    mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Conductor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="conductorId">Conductor ID</Label>
            <Input
              id="conductorId"
              value={formData.conductorId}
              onChange={(e) => setFormData({ ...formData, conductorId: e.target.value })}
              placeholder="e.g. C-1001"
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
              Create Conductor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateConductorModal;
