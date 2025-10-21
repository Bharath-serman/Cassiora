import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import FloatingBox from "./FloatingBox";

export default function StackVisualizer() {
  const [stack, setStack] = useState<number[]>([]);
  const [input, setInput] = useState("");
  const [explanation, setExplanation] = useState(
    "Enter an integer and click Push to add it to the top of the stack."
  );
  const [animating, setAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState<null | number>(null); // Holds index of animating item or null
  const [pushAnimating, setPushAnimating] = useState(false);
  const [popAnimating, setPopAnimating] = useState(false);

  function handlePush() {
    if (!input.match(/^-?\d+$/)) {
      toast({ title: "Enter a valid integer!" });
      setExplanation("Please enter a valid integer value.");
      return;
    }
    setAnimating(true);
    setPushAnimating(true);
    setExplanation("New element is floating in and added to the top!");
    setTimeout(() => {
      setStack((prev) => {
        const nextStack = [...prev, Number(input)];
        setAnimationStep(nextStack.length - 1);
        return nextStack;
      });
      setInput("");
      setTimeout(() => {
        setAnimationStep(null);
        setPushAnimating(false);
        setAnimating(false);
        setExplanation("Stack updated. Push completed with visual animation!");
      }, 1100);
    }, 800);
  }
  function handlePop() {
    if (stack.length === 0) {
      toast({ title: "Stack is already empty!" });
      setExplanation("Stack is empty! Cannot Pop.");
      return;
    }
    setAnimating(true);
    setPopAnimating(true);
    setExplanation("Element from top is floating away during pop!");
    const poppedIdx = stack.length - 1;
    setAnimationStep(poppedIdx);
    setTimeout(() => {
      setStack((prev) => prev.slice(0, -1));
      setAnimationStep(null);
      setTimeout(() => {
        setPopAnimating(false);
        setAnimating(false);
        setExplanation("Pop completed with visual walkthrough animation.");
      }, 900);
    }, 1000);
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
          onKeyDown={(e) => e.key === "Enter" && !animating && handlePush()}
        />
        <Button
          onClick={handlePush}
          disabled={!input.trim() || animating}
          variant="default"
        >
          Push
        </Button>
        <Button
          onClick={handlePop}
          disabled={stack.length === 0 || animating}
          variant="outline"
        >
          Pop
        </Button>
      </div>
      <div className="flex items-end gap-2 min-h-[80px]" style={{ minHeight: "80px" }}>
        {stack.length === 0 ? (
          <span className="text-muted-foreground">Stack Empty</span>
        ) : (
          stack
            .map((val, idx) => {
              const isAnim =
                (pushAnimating && animationStep === idx) ||
                (popAnimating && animationStep === idx);
              return (
                <FloatingBox
                  key={val + "-" + idx}
                  from={pushAnimating ? "up" : popAnimating && animationStep === idx ? "up" : "up"}
                  floating={animationStep === idx ? true : !pushAnimating && !popAnimating}
                  duration={isAnim ? 1100 : 700}
                  style={{
                    zIndex: 10 + idx,
                    boxShadow:
                      animationStep === idx && (pushAnimating || popAnimating)
                        ? "0 0 0 4px rgba(34,197,94,0.18)"
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
            .reverse()
        )}
      </div>
      <span className="text-xs text-muted-foreground">Top &uarr;</span>
      <div className="mt-4 text-sm bg-muted/70 rounded p-2 text-center w-full max-w-xl animate-fade-in">
        {explanation}
      </div>
    </div>
  );
}
