import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Sun, Moon, User, Image, LogOut, Palette } from "lucide-react";
import { useUser } from "@/components/UserContext";
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { updateProfile } from "@/integrations/api/client";
import { Separator } from "@/components/ui/separator";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
}

import { useEffect } from "react";

export default function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { profile, refresh, logout } = useUser();
  const { theme, setTheme } = useTheme();
  const [username, setUsername] = useState(profile?.username || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [loading, setLoading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(profile?.photoUrl || null);

  // Sync local state with profile changes
  useEffect(() => {
    setUsername(profile?.username || "");
    setEmail(profile?.email || "");
    setPhotoUrl(profile?.photoUrl || null);
  }, [profile]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      await updateProfile(token, username);
      toast({ title: "Profile updated", description: "Your profile was updated successfully." });
      refresh();
    } catch (err: any) {
      toast({
        title: "Failed to update",
        description: err.message || "An error occurred while updating your profile"
      });
    }
    setLoading(false);
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      const formData = new FormData();
      formData.append('photo', file);
      const res = await fetch('/api/profile/photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (!res.ok) throw new Error('Failed to upload photo');
      const data = await res.json();
      setPhotoUrl(data.photoUrl);
      toast({ title: "Profile photo updated!" });
      refresh(); // Refetch user profile to update everywhere
    } catch (err: any) {
      toast({ title: "Failed to upload photo", description: err.message });
    }
    setLoading(false);
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" aria-describedby="settings-modal-desc">
        <span id="settings-modal-desc" className="sr-only">User settings and profile management dialog</span>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="w-4 h-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="photo">
              <Image className="w-4 h-4 mr-2" />
              Photo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Username
                </label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Email
                </label>
                <input
                  className="border rounded px-3 py-2 w-full bg-black-100"
                  value={email}
                  disabled
                />
                <span className="text-xs text-muted-foreground ml-1">Cannot be changed</span>
              </div>
              <Button type="submit" variant="default" disabled={loading} className="w-full">
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="appearance">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Theme</h3>
                <div className="grid gap-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    onClick={() => setTheme('light')}
                    className="w-full justify-start"
                  >
                    <Sun className="w-4 h-4 mr-2" />
                    Light
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    onClick={() => setTheme('dark')}
                    className="w-full justify-start"
                  >
                    <Moon className="w-4 h-4 mr-2" />
                    Dark
                  </Button>
                  <Button
                    variant={theme === 'system' ? 'default' : 'outline'}
                    onClick={() => setTheme('system')}
                    className="w-full justify-start"
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    System
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="photo">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={photoUrl || profile?.photoUrl || "/placeholder.svg"} alt="Profile" />
                <AvatarFallback>
                  {profile?.username?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <input
                type="file"
                accept="image/*"
                className="block text-sm file:mr-3 file:py-2 file:px-5 file:border-0 file:bg-primary file:text-primary-foreground file:rounded-lg file:cursor-pointer"
                onChange={handlePhotoChange}
              />
              <span className="text-xs text-muted-foreground">Your profile photo is now persistent and will show everywhere!</span>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-4" />

        <Button
          variant="destructive"
          className="w-full"
          onClick={() => {
            logout();
            onOpenChange(false);
          }}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </DialogContent>
    </Dialog>
  );
}
