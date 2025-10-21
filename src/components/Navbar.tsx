import { useUser } from "@/components/UserContext";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Settings } from "lucide-react";
import SettingsModal from "./SettingsModal";

export default function Navbar() {
  const { profile, loading } = useUser();
  const [showSettings, setShowSettings] = useState(false);
  const location = useLocation();

  return (
    <>
      <nav className="flex items-center justify-between w-full py-4 px-6 border-b bg-background shadow-sm">
        <Link to="/" className="font-bold text-xl tracking-tight text-primary">
          Cassiora
        </Link>
        <div className="ml-auto flex items-center gap-2">
          {/* Communication Test link */}
          <Link to="/communication-test">
            <Button
              variant={location.pathname === "/communication-test" ? "default" : "outline"}
              size="sm"
            >
              Communication Test
            </Button>
          </Link>
          {/* DSA Visualizer link */}
          <Link to="/dsa-visualizer">
            <Button
              variant={location.pathname === "/dsa-visualizer" ? "default" : "outline"}
              size="sm"
            >
              DSA Visualizer
            </Button>
          </Link>

          {/* Notepad link for signed-in users */}
          {!loading && profile && (
            <Link to="/notepad">
              <Button
                variant={location.pathname === "/notepad" ? "default" : "outline"}
                size="sm"
              >
                Notepad
              </Button>
            </Link>
          )}

          {/* Activity link for signed-in users */}
          {!loading && profile && (
            <Link to="/activity">
              <Button
                variant={location.pathname === "/activity" ? "default" : "outline"}
                size="sm"
              >
                Activity
              </Button>
            </Link>
          )}

          {/* Profile avatar for signed-in users */}
          {!loading && profile && (
            <button
              className="ml-2 rounded-full border-2 border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary"
              style={{ width: 38, height: 38, padding: 0, background: 'none' }}
              aria-label="Open profile settings"
              onClick={() => setShowSettings(true)}
            >
              <img
                src={profile.photoUrl || "/placeholder.svg"}
                alt="Profile"
                className="rounded-full object-cover w-9 h-9 bg-muted"
                onError={e => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
              />
            </button>
          )}

          {loading ? null : profile ? (
            <span className="font-medium text-base text-muted-foreground">
              {profile.username || profile.email}
            </span>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm">Sign in</Button>
            </Link>
          )}
        </div>
      </nav>
      <SettingsModal open={showSettings} onOpenChange={setShowSettings} />
    </>
  );
}

