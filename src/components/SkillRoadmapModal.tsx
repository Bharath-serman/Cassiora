import React, { useState } from "react";
import SkillRoadmapFlow from "@/components/SkillRoadmapFlow";
import { Maximize, Minimize, X as CloseIcon } from "lucide-react";

interface SkillRoadmapModalProps {
  skill: string;
  open: boolean;
  onClose: () => void;
}

export default function SkillRoadmapModal({ skill, open, onClose }: SkillRoadmapModalProps) {
  const [fullscreen, setFullscreen] = useState(false);
  if (!open) return null;

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-white dark:bg-zinc-900 animate-fade-in" style={{ width: '100vw', height: '100vh' }}>
        <div className="flex justify-end items-center gap-3 absolute top-4 right-4 z-10">
          <button
            className="flex items-center justify-center w-9 h-9 text-zinc-600 bg-zinc-100 hover:text-zinc-900 hover:bg-zinc-200 rounded-md shadow-sm transition-colors dark:text-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
            onClick={() => setFullscreen(false)}
            aria-label="Exit Fullscreen"
            title="Exit Fullscreen"
          >
            <Minimize size={18} strokeWidth={2.5} />
          </button>
          <button
            className="flex items-center justify-center w-9 h-9 text-zinc-600 bg-zinc-100 hover:text-red-600 hover:bg-red-100 rounded-md shadow-sm transition-colors dark:text-zinc-300 dark:bg-zinc-800 dark:hover:bg-red-900/40 dark:hover:text-red-400"
            onClick={onClose}
            aria-label="Close"
            title="Close"
          >
            <CloseIcon size={18} strokeWidth={2.5} />
          </button>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-primary text-center pt-8">Roadmap: {skill}</h2>
        <div className="w-full h-[80vh] flex items-center justify-center">
          <SkillRoadmapFlow skill={skill} />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl max-w-3xl w-full p-6 relative animate-fade-in">
        <div className="flex justify-end items-center gap-3 absolute top-4 right-4 z-10">
          <button
            className="flex items-center justify-center w-9 h-9 text-zinc-600 bg-zinc-100 hover:text-zinc-900 hover:bg-zinc-200 rounded-md shadow-sm transition-colors dark:text-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
            onClick={() => setFullscreen(true)}
            aria-label="Fullscreen"
            title="Fullscreen"
          >
            <Maximize size={18} strokeWidth={2.5} />
          </button>
          <button
            className="flex items-center justify-center w-9 h-9 text-zinc-600 bg-zinc-100 hover:text-red-600 hover:bg-red-100 rounded-md shadow-sm transition-colors dark:text-zinc-300 dark:bg-zinc-800 dark:hover:bg-red-900/40 dark:hover:text-red-400"
            onClick={onClose}
            aria-label="Close"
            title="Close"
          >
            <CloseIcon size={18} strokeWidth={2.5} />
          </button>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-primary">Roadmap: {skill}</h2>
        <SkillRoadmapFlow skill={skill} />
      </div>
    </div>
  );
}
