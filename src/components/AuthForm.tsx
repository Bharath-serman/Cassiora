import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import { useUser } from "./UserContext";

enum Mode {
  LOGIN,
  SIGNUP,
}

export default function AuthForm() {
  const { login, signUp } = useUser();
  const [mode, setMode] = useState<Mode>(Mode.LOGIN);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const switchMode = () => {
    setMode(mode === Mode.LOGIN ? Mode.SIGNUP : Mode.LOGIN);
    setUsername("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === Mode.SIGNUP) {
        await signUp(email, password, username);
        toast({
          title: "Welcome to Cassiora!",
          description: "You have successfully signed up and logged in.",
        });
        setMode(Mode.LOGIN);
      } else {
        await login(email, password);
        toast({
          title: "Welcome back!",
          description: `Logged in as ${email}.`,
        });
      }
    } catch (err: any) {
      toast({
        title: "Authentication failed",
        description: err.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-8 max-w-md w-full rounded-lg mx-auto mt-12 shadow border flex flex-col gap-6">
      <h2 className="text-2xl font-bold mb-2">{mode === Mode.LOGIN ? "Sign in" : "Sign up"}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {mode === Mode.SIGNUP && (
          <Input
            type="text"
            placeholder="Username"
            value={username}
            maxLength={24}
            required
            autoFocus
            onChange={(e) => setUsername(e.target.value)}
          />
        )}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          required
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            minLength={6}
            required
            autoComplete={mode === Mode.LOGIN ? "current-password" : "new-password"}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary focus:outline-none"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? (
              // Eye-off SVG
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17.94 17.94A10.05 10.05 0 0 1 12 19c-5 0-9.27-3.11-10-7 .22-1.19.77-2.32 1.6-3.32m2.18-2.18A9.96 9.96 0 0 1 12 5c5 0 9.27 3.11 10 7-.31 1.7-1.29 3.25-2.68 4.47M9.9 9.9a3 3 0 1 0 4.24 4.24M3 3l18 18"/></svg>
            ) : (
              // Eye SVG
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>
            )}
          </button>
        </div>
        <Button type="submit" disabled={loading} className="w-full mt-1">
          {loading ? "Please wait..." : mode === Mode.LOGIN ? "Login" : "Sign Up"}
        </Button>
      </form>
      <div className="flex items-center justify-between pt-2">
        <span>
          {mode === Mode.LOGIN ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="text-primary underline font-semibold"
            onClick={switchMode}
          >
            {mode === Mode.LOGIN ? "Sign Up" : "Login"}
          </button>
        </span>
      </div>
    </div>
  );
}
