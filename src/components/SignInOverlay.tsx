
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SignInOverlay() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      // On close, redirect to home page
      navigate("/");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm text-center">
        <DialogHeader>
          <DialogTitle>Please Sign In</DialogTitle>
          <DialogDescription>
            Kindly sign in to continue to the test. Sign in is required for saving your progress, streaks, and achievements.
          </DialogDescription>
        </DialogHeader>
        <Button
          className="mt-3 w-full font-semibold"
          onClick={() => navigate("/auth")}
        >
          Sign In / Sign Up
        </Button>
      </DialogContent>
    </Dialog>
  );
}
