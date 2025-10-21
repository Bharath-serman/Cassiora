import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Pause, Play, ChevronLeft, ChevronRight, BadgeCheck } from "lucide-react";

interface ConversationLine {
  speaker: "A" | "B";
  text: string;
  audioUrl?: string; // Optional: for real audio files
}

interface ConversationPlayerProps {
  lines: ConversationLine[];
  subtitles: boolean;
  onUserTurn: (lineIdx: number) => void;
  currentLine: number;
  setCurrentLine: (idx: number) => void;
  onSubtitlesToggle: () => void;
}

export const ConversationPlayer: React.FC<ConversationPlayerProps> = ({
  lines,
  subtitles,
  onUserTurn,
  currentLine,
  setCurrentLine,
  onSubtitlesToggle,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);

  const play = () => {
    setPlaying(true);
    audioRef.current?.play();
  };
  const pause = () => {
    setPlaying(false);
    audioRef.current?.pause();
  };
  const seek = (delta: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += delta;
    }
  };
  const handleVolume = (v: number) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const handleEnded = () => {
    setPlaying(false);
    // Move to next line or call user turn
    if (currentLine < lines.length - 1) {
      setCurrentLine(currentLine + 1);
    }
    // If it's user's turn, call callback
    if (lines[currentLine].speaker === "B") {
      onUserTurn(currentLine);
    }
  };

  // For demo: use SpeechSynthesis for audio
  const playTTS = (text: string) => {
    const synth = window.speechSynthesis;
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.volume = volume;
    utter.onend = handleEnded;
    synth.speak(utter);
    setPlaying(true);
  };

  // Play current line when Play is pressed
  const handlePlay = () => {
    playTTS(lines[currentLine].text);
  };

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div className="flex gap-2 items-center">
        <Button size="icon" onClick={() => setCurrentLine(Math.max(0, currentLine - 1))}>
          <ChevronLeft />
        </Button>
        <Button size="icon" onClick={playing ? pause : handlePlay}>
          {playing ? <Pause /> : <Play />}
        </Button>
        <Button size="icon" onClick={() => setCurrentLine(Math.min(lines.length - 1, currentLine + 1))}>
          <ChevronRight />
        </Button>
        <Button size="icon" onClick={() => seek(-5)}>
          -5s
        </Button>
        <Button size="icon" onClick={() => seek(5)}>
          +5s
        </Button>
        <Button size="icon" onClick={onSubtitlesToggle}>
          <BadgeCheck className={subtitles ? "text-primary" : "text-muted-foreground"} />
        </Button>
        <div className="flex items-center gap-1 ml-2">
          <Button size="icon" onClick={() => handleVolume(volume === 0 ? 1 : 0)}>
            {volume === 0 ? <VolumeX /> : <Volume2 />}
          </Button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={e => handleVolume(Number(e.target.value))}
            className="w-20"
          />
        </div>
      </div>
      <div className="mt-4 w-full">
        {subtitles && (
          <div className="bg-muted rounded p-3 text-center min-h-[48px]">
            <span className="font-bold">{lines[currentLine].speaker}:</span> {lines[currentLine].text}
          </div>
        )}
      </div>
    </div>
  );
};
