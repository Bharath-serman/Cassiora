import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface ConversationLine {
  speaker: "A" | "B";
  text: string;
}

interface ConversationChatPlayerProps {
  lines: ConversationLine[];
  playing: boolean;
  onEnd: () => void;
  onPlay: () => void;
  onPause: () => void;
  currentLine: number;
  setCurrentLine: (idx: number) => void;
  audioOnly?: boolean; // If true, hide transcript
}

export const ConversationChatPlayer: React.FC<ConversationChatPlayerProps> = ({
  lines,
  playing,
  onEnd,
  onPlay,
  onPause,
  currentLine,
  setCurrentLine,
  audioOnly = false,
}) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fade-in animation state
  const [fadeIdx, setFadeIdx] = useState(-1);

  // TTS and message progression
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  useEffect(() => {
    let cancelled = false;
    if (playing && currentLine < lines.length) {
      // Cancel any previous utterance before starting a new one
      window.speechSynthesis.cancel();
      const speakAndNext = (idx: number) => {
        if (cancelled) return;
        setFadeIdx(idx);
        const utter = new window.SpeechSynthesisUtterance(lines[idx].text);
        utterRef.current = utter;
        utter.onend = () => {
          if (cancelled) return;
          if (idx < lines.length - 1) {
            setCurrentLine(idx + 1);
          } else {
            onEnd();
          }
        };
        window.speechSynthesis.speak(utter);
      };
      speakAndNext(currentLine);
    } else {
      window.speechSynthesis.cancel();
    }
    return () => {
      cancelled = true;
      window.speechSynthesis.cancel();
      if (utterRef.current) {
        utterRef.current.onend = null;
      }
    };
  }, [playing, currentLine, lines, onEnd]);

  // Auto-scroll to latest
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentLine, fadeIdx]);

  const handlePlayPause = () => {
    if (playing) {
      onPause();
    } else {
      if (currentLine === lines.length - 1) {
        setCurrentLine(0);
      }
      onPlay();
    }
  };

  const handleSeek = (delta: number) => {
    setCurrentLine(currentLine + delta < 0 ? 0 : currentLine + delta >= lines.length ? lines.length - 1 : currentLine + delta);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Only show transcript if not audioOnly */}
      {!audioOnly && (
        <div className="bg-muted rounded-lg p-4 w-full max-w-lg h-72 overflow-y-auto flex flex-col gap-2 mb-4">
          {lines.slice(0, currentLine + 1).map((line, idx) => (
            <div
              key={idx}
              className={`flex ${line.speaker === "A" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`px-3 py-2 rounded-lg max-w-[75%] text-base shadow-sm ${
                  fadeIdx === idx ? 'animate-fadein' : ''
                } ${
                  line.speaker === "A"
                    ? "bg-blue-100 text-blue-900"
                    : "bg-green-100 text-green-900"
                }`}
              >
                <span className="font-semibold mr-2">{line.speaker}:</span>
                {line.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      )}
      <div className="flex gap-2 items-center mb-4">
        <Button size="icon" onClick={handlePlayPause}>
          {playing ? "Pause" : "Play"}
        </Button>
      </div>
    </div>
  );
};
