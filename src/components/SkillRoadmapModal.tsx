import React, { useState } from "react";
import SkillRoadmapFlow from "@/components/SkillRoadmapFlow";

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
        <div className="flex justify-end items-center gap-20 absolute top-4 right-4 z-10">
          <button
            className="text-blue-600 hover:text-blue-800 text-base font-bold px-2 py-1 bg-blue-100 rounded shadow"
            onClick={() => setFullscreen(false)}
            aria-label="Exit Fullscreen"
          >
            ⛶ Exit Fullscreen
          </button>
          <button
            className="text-zinc-600 dark:text-zinc-300 hover:text-red-500 text-2xl font-bold"
            onClick={onClose}
            aria-label="Close"
          >
            ×
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
        <div className="flex justify-end items-center gap-20 absolute top-3 right-3 z-10">
          <button
            className="text-blue-600 hover:text-blue-800 text-base font-bold px-2 py-1 bg-blue-100 rounded shadow"
            onClick={() => setFullscreen(true)}
            aria-label="Fullscreen"
          >
            ⛶ Fullscreen
          </button>
          <button
            className="text-zinc-600 dark:text-zinc-300 hover:text-red-500 text-xl font-bold"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-primary">Roadmap: {skill}</h2>
        <SkillRoadmapFlow skill={skill} />
      </div>
    </div>
  );
}
