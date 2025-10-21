import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import FloatingBox from "./FloatingBox";

export default function QueueVisualizer() {
  const [queue, setQueue] = useState<number[]>([]);
  const [input, setInput] = useState("");
  const [explanation, setExplanation] = useState(
    "Enter an integer and click Enqueue to add it to the rear/end of the queue (FIFO)."
  );
  const [animating, setAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState<null | number>(null);
  const [enqueueAnimating, setEnqueueAnimating] = useState(false);
  const [dequeueAnimating, setDequeueAnimating] = useState(false);

  function handleEnqueue() {
    if (!input.match(/^-?\d+$/)) {
      toast({ title: "Enter a valid integer!" });
      setExplanation("Please enter a valid integer value.");
      return;
    }
    setAnimating(true);
    setEnqueueAnimating(true);
    setExplanation("Element floating in from rear (right) to join the queue!");
    setTimeout(() => {
      setQueue((prev) => {
        const nextQueue = [...prev, Number(input)];
        setAnimationStep(nextQueue.length - 1); // animate newest item
        return nextQueue;
      });
      setInput("");
      setTimeout(() => {
        setAnimationStep(null);
        setEnqueueAnimating(false);
        setAnimating(false);
        setExplanation(
          "Queue updated with visual walkthrough. New value entered at rear!"
        );
      }, 1200);
    }, 800);
  }
  function handleDequeue() {
    if (queue.length === 0) {
      toast({ title: "Queue is already empty!" });
      setExplanation("Queue is empty! Cannot Dequeue.");
      return;
    }
    setAnimating(true);
    setDequeueAnimating(true);
    setExplanation("Front element floating out (to the left) to show Dequeue.");
    setAnimationStep(0);
    setTimeout(() => {
      setQueue((prev) => prev.slice(1));
      setAnimationStep(null);
      setTimeout(() => {
        setDequeueAnimating(false);
        setAnimating(false);
        setExplanation(
          "Dequeued front item in slow, floating animation. Queue updated!"
        );
      }, 950);
    }, 1200);
  }

  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <div className="flex gap-2 items-center w-full max-w-[320px]">
        <Input
          value={input}
          type="number"
          disabled={animating}
          placeholder="Enter value"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !animating && handleEnqueue()}
        />
        <Button
          onClick={handleEnqueue}
          disabled={!input.trim() || animating}
          variant="default"
        >
          Enqueue
        </Button>
        <Button
          onClick={handleDequeue}
          disabled={queue.length === 0 || animating}
          variant="outline"
        >
          Dequeue
        </Button>
      </div>
      <div className="flex items-center gap-2 min-h-[80px]">
        <span className="text-xs text-muted-foreground -mr-2">
          Front &larr;
        </span>
        {queue.length === 0 ? (
          <span className="text-muted-foreground">Queue Empty</span>
        ) : (
          queue.map((val, idx) => {
            const isAnim =
              (enqueueAnimating && animationStep === idx) ||
              (dequeueAnimating && animationStep === idx);
            let fromDirection: "left" | "right" | "up" | "down" =
              enqueueAnimating && animationStep === idx
                ? "right"
                : dequeueAnimating && animationStep === idx
                ? "left"
                : "up";
            return (
              <FloatingBox
                key={val + "-" + idx}
                from={fromDirection}
                floating={animationStep === idx ? true : !enqueueAnimating && !dequeueAnimating}
                duration={isAnim ? 1200 : 700}
                style={{
                  zIndex: 10 + idx,
                  boxShadow:
                    animationStep === idx &&
                    (enqueueAnimating || dequeueAnimating)
                      ? "0 0 0 4px rgba(34,197,94,0.16)"
                      : undefined,
                }}
                className={`w-16 h-14 flex items-center justify-center border-2 border-primary bg-primary/10 rounded-lg shadow font-semibold text-lg ${
                  animationStep === idx
                    ? "bg-green-100 border-green-500 scale-105"
                    : ""
                }`}
              >
                {val}
              </FloatingBox>
            );
          })
        )}
        <span className="text-xs text-muted-foreground -ml-2">
          Rear &rarr;
        </span>
      </div>
      <div className="mt-4 text-sm bg-muted/70 rounded p-2 text-center w-full max-w-xl animate-fade-in">
        {explanation}
      </div>
    </div>
  );
}
