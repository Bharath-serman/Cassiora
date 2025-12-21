import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TestTopicGrid from "@/components/TestTopicGrid";
import StreakHeatmap from "@/components/StreakHeatmap";
import StreakCounter from "@/components/StreakCounter";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/components/UserContext";
import { useLoading } from '@/contexts/LoadingContext';
import { useIsMobile } from "@/hooks/use-mobile";
import FeedbackForm from "@/components/FeedbackForm";
import SettingsModal from "@/components/SettingsModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, BookOpen, ArrowRight, X, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import Chatbot from "@/components/Chatbot";

interface StreakData {
  streak: number;
  data: { [date: string]: number };
}

export default function Index() {
  const navigate = useNavigate();
  const { profile, loading } = useUser();
  const { showLoading } = useLoading();
  const isMobile = useIsMobile();
  const [showFeedback, setShowFeedback] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [streakData, setStreakData] = useState<StreakData>({ streak: 0, data: {} });

  useEffect(() => {
    // Fetch streak data if user is logged in
    const fetchUserStreak = async () => {
      if (!profile) return;
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');

        const res = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch profile data');

        const data = await res.json();
        setStreakData(prev => ({ ...prev, streak: data.streak }));
      } catch (err: any) {
        console.error('Error fetching user streak:', err);
        toast({ title: "Error", description: "Failed to load streak data." });
      }
    };

    if (profile) {
      fetchUserStreak();
    }
  }, [profile]);

  const handleTopicSelect = (topic: string) => {
    navigate("/test", { state: { topic } });
  };

  return (
    <div className="w-full min-h-screen max-w-7xl mx-auto px-4 sm:px-4 md:px-8 py-6 md:py-10 flex flex-col gap-8 md:gap-10 animate-fade-in">
      {/* Headline */}
      <div className="w-full flex flex-col items-center gap-6 mb-4 md:mb-7">
        <div className="flex flex-col gap-1 items-center text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary tracking-tight mb-1">
            CASSIORA
          </h1>
          <span className="text-lg md:text-xl font-medium text-muted-foreground">
            Master interviews with daily practice tests
          </span>

          {/* Streak Counter (only for signed-in users) */}
          {!loading && profile && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-lg font-semibold text-primary">
                {streakData.streak} Day Streak 🔥
              </span>
            </div>
          )}
        </div>
      </div>

      {/* About Section */}
      <section className="relative w-full flex justify-center mb-10">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none">
          <div className="w-[90vw] max-w-4xl h-56 md:h-64 rounded-3xl bg-gradient-to-tr from-primary/30 via-blue-400/10 to-pink-400/10 blur-2xl opacity-80 animate-pulse-slow" />
        </div>
        {/* Glassmorphism Card */}
        <div className="relative z-10 w-full max-w-3xl">
          <div className="rounded-3xl shadow-xl border-0 bg-white/70 dark:bg-zinc-900/80 backdrop-blur-md px-8 py-10 md:py-12 flex flex-col md:flex-row items-center gap-8 overflow-hidden">
            {/* Decorative Layered Shape */}
            <div className="absolute -top-8 -left-8 w-36 h-36 bg-gradient-to-br from-primary/40 to-pink-400/30 rounded-full blur-2xl opacity-60 animate-float" />
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-tr from-blue-400/30 to-primary/30 rounded-full blur-2xl opacity-50 animate-float2" />
            {/* Icon */}
            <div className="flex-shrink-0 flex items-center justify-center rounded-full bg-primary/10 p-6 shadow-md">
              <BookOpen className="w-16 h-16 text-primary drop-shadow-lg" />
            </div>
            {/* Content */}
            <div className="flex-1 flex flex-col gap-3">
              <h2 className="text-3xl font-extrabold text-primary mb-1 drop-shadow-sm">About Cassiora</h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-2">
                Cassiora is a next-gen platform for mastering interviews and communication skills through realistic chat simulations, voice-enabled practice, and daily MCQ tests—all in a beautiful, motivating environment.
              </p>
              <ul className="list-disc pl-6 space-y-1 text-sm md:text-base text-muted-foreground/90">
                <li>Interactive, voice-powered chat scenarios</li>
                <li>Instant feedback and MCQ quizzes</li>
                <li>Daily streaks & progress tracking</li>
                <li>Integrated notepad for your ideas</li>
                <li>Modern, accessible, and responsive UI</li>
              </ul>
              <Button
                className="mt-4 w-max px-6 py-2 rounded-full font-semibold text-base shadow-md bg-gradient-to-r from-primary to-blue-500 hover:from-blue-500 hover:to-primary transition"
                onClick={() => {
                  if (!profile) {
                    navigate('/auth');
                  } else {
                    navigate('/test');
                  }
                }}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Grid */}
      {/* Removed as per user request */}

      {/* Streak section (only for signed-in users) */}
      {/* Moved to a dedicated Activity page */}

      {/* Main grid: topics */}
      <div className="w-full mb-6">
        <h2 className="font-bold text-lg sm:text-xl mb-3">Select a Topic</h2>
        <TestTopicGrid onTopicSelect={handleTopicSelect} showLoading={showLoading} />
      </div>

      {/* Roles for Freshers 2025 */}
      <div className="w-full flex justify-center mb-8">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-5 rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 text-center cursor-pointer max-w-xl"
          onClick={() => {
            showLoading();
            navigate('/roles');
          }}
          role="button"
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { showLoading(); navigate('/roles'); } }}
          aria-label="View Top Growing Roles for Freshers (2025)"
        >
          <h2 className="text-2xl font-bold mb-2"> Top Growing Roles for Freshers (2025)</h2>
          <p className="text-base opacity-90">Explore the most in-demand career roles, required skills, and how to prepare for your future!</p>
          <span className="inline-block mt-3 px-5 py-2 bg-white/20 rounded-full font-semibold text-white border border-white/30">View Roles</span>
        </div>
      </div>

      {/* Feedback section */}
      <div className="w-full flex flex-col gap-4 mt-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="font-bold text-lg sm:text-xl">Feedback</h2>
          <Button
            variant="outline"
            onClick={() => setShowFeedback(true)}
            className="w-full sm:w-auto"
          >
            Submit Feedback
          </Button>
        </div>
        {showFeedback && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowFeedback(false)} />
            <div className="relative bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => setShowFeedback(false)}
              >
                <X className="h-5 w-5" />
              </Button>
              <FeedbackForm />
            </div>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      <SettingsModal open={showSettings} onOpenChange={setShowSettings} />

      {/* Footer */}
      <footer className="w-full mt-12 border-t bg-background/80 dark:bg-zinc-900/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-muted-foreground">
          {/* Tools & Features */}
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-base text-primary mb-2">Tools & Features</span>
            <Link to="/dsa-visualizer" className="w-max"><Button variant="outline" size="sm">DSA Visualizer</Button></Link>
            <Link to="/communication-test" className="w-max"><Button variant="outline" size="sm">Communication Test</Button></Link>
            {!loading && profile && (
              <Link to="/notepad" className="w-max"><Button variant="outline" size="sm">Notepad</Button></Link>
            )}
            {!loading && profile && (
              <Link to="/activity" className="w-max"><Button variant="outline" size="sm">Activity</Button></Link>
            )}
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-base text-primary mb-2">Quick Links</span>
            <Link to="/terms" className="hover:text-primary transition">Terms & Conditions</Link>
            <Link to="/privacy" className="hover:text-primary transition">Privacy Policy</Link>
            <Link to="/faq" className="hover:text-primary transition">FAQ</Link>
            <span
              className="hover:text-primary transition cursor-pointer"
              onClick={() => {
                showLoading();
                navigate('/roles');
              }}
            >
              Top Roles 2025
            </span>
          </div>

          {/* About & Slogan */}
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-base text-primary mb-2">About</span>
            <span>&copy; {new Date().getFullYear()} Cassiora</span>
            <span>Built<span className="text-pink-500"> Cassiora</span> for learners</span>
            <span className="italic">Empower your conversations, every day!</span>
          </div>

          {/* Social / Contact */}
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-base text-primary mb-2">Connect</span>
            {/* Social icons: Instagram, GitHub, Twitter */}
            <div className="flex gap-4 mt-2">
              <a href="#" aria-label="Instagram" className="hover:text-primary transition">
                {/* Instagram SVG */}
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="2" y="2" width="20" height="20" rx="6" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
                  <circle cx="17" cy="7" r="1.5" fill="currentColor" />
                </svg>
              </a>
              <a href="https://github.com/Bharath-serman" aria-label="GitHub" className="hover:text-primary transition">
                {/* GitHub SVG */}
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path fill="currentColor" d="M12 2C6.48 2 2 6.58 2 12.26c0 4.48 2.87 8.28 6.84 9.63.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05 .89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85.004 1.7.12 2.5.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.89 0 1.36-.01 2.45-.01 2.78 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
                </svg>
              </a>
              <a href="https://www.duolingo.com/profile/TA_SPIDEY" aria-label="Duolingo" className="hover:text-primary transition">
                {/* Duolingo SVG */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M12.04 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm3.8 15.6c-.6.8-1.7 1.4-2.9 1.4-1.2 0-2.3-.6-2.9-1.4-.2-.3-.1-.7.2-1 .3-.2.8-.2 1.1.1.3.4.9.7 1.6.7.7 0 1.3-.3 1.6-.7.3-.3.7-.4 1.1-.1.3.3.4.7.2 1zm1.2-4.6c0 1.1-.9 2-2 2s-2-.9-2-2c0-.7.4-1.4 1-1.7-.6-.3-1-1-1-1.7 0-1.1.9-2 2-2s2 .9 2 2c0 .7-.4 1.4-1 1.7.6.3 1 1 1 1.7zm-6 0c0 1.1-.9 2-2 2s-2-.9-2-2c0-.7.4-1.4 1-1.7-.6-.3-1-1-1-1.7 0-1.1.9-2 2-2s2 .9 2 2c0 .7-.4 1.4-1 1.7.6.3 1 1 1 1.7z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
      {/* Floating Chatbot Button and Widget */}
      <Chatbot />
    </div>
  );
}
