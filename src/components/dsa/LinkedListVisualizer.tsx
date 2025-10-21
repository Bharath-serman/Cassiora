import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import FloatingBox from "./FloatingBox";

type NodeType = { value: number; id: number };

export default function LinkedListVisualizer() {
  const [list, setList] = useState<NodeType[]>([]);
  const [input, setInput] = useState("");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [nextId, setNextId] = useState(1);
  const [explanation, setExplanation] = useState("Enter a value and choose where to insert in the list.");
  const [animating, setAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState<{ type: "add" | "del" | null, idx: number | null }>({ type: null, idx: null });
  const [floatInfo, setFloatInfo] = useState<{
    idx: number | null;
    type: "addHead" | "addTail" | "addMid" | "del" | null;
  }>({ idx: null, type: null });

  function handleInsertHead() {
    if (!input.match(/^-?\d+$/)) {
      toast({ title: "Enter a valid integer!" });
      setExplanation("Please enter a valid integer value.");
      return;
    }
    setAnimating(true);
    setExplanation("Node floats down to the head and links in!");
    setTimeout(() => {
      setList(prev => {
        const newList = [{ value: Number(input), id: nextId }, ...prev];
        setAnimationStep({ type: "add", idx: 0 });
        setFloatInfo({ idx: 0, type: "addHead" });
        return newList;
      });
      setSelectedIdx(null);
      setNextId(id => id + 1);
      setInput("");
      setExplanation(
        `Inserted ${input} at the head—node floats into position at start!`
      );
      setTimeout(() => {
        setAnimationStep({ type: null, idx: null });
        setFloatInfo({ idx: null, type: null });
        setAnimating(false);
      }, 1500);
    }, 700);
  }

  function handleInsertTail() {
    if (!input.match(/^-?\d+$/)) {
      toast({ title: "Enter a valid integer!" });
      setExplanation("Please enter a valid integer value.");
      return;
    }
    setAnimating(true);
    setExplanation("Node floats in from the right and attaches as tail!");
    setTimeout(() => {
      setList(prev => {
        const newList = [...prev, { value: Number(input), id: nextId }];
        setAnimationStep({ type: "add", idx: newList.length - 1 });
        setFloatInfo({ idx: newList.length - 1, type: "addTail" });
        return newList;
      });
      setSelectedIdx(null);
      setNextId(id => id + 1);
      setInput("");
      setExplanation(
        `Inserted ${input} at the tail—float connects new tail node!`
      );
      setTimeout(() => {
        setAnimationStep({ type: null, idx: null });
        setFloatInfo({ idx: null, type: null });
        setAnimating(false);
      }, 1500);
    }, 700);
  }

  function handleInsertAfter() {
    if (selectedIdx === null || !input.match(/^-?\d+$/)) {
      toast({ title: "Select a node and enter a valid value!" });
      setExplanation("Please select a node and enter a valid integer.");
      return;
    }
    setAnimating(true);
    setExplanation("Node floats in and links after selected node!");
    setTimeout(() => {
      const insertIdx = selectedIdx;
      setList(prev => {
        const newNode = { value: Number(input), id: nextId };
        const newList = [
          ...prev.slice(0, insertIdx + 1),
          newNode,
          ...prev.slice(insertIdx + 1),
        ];
        setAnimationStep({ type: "add", idx: insertIdx + 1 });
        setFloatInfo({ idx: insertIdx + 1, type: "addMid" });
        return newList;
      });
      setNextId(id => id + 1);
      setExplanation(
        `Inserted ${input} after node #${selectedIdx + 1} via float-in animation!`
      );
      setSelectedIdx(null);
      setInput("");
      setTimeout(() => {
        setAnimationStep({ type: null, idx: null });
        setFloatInfo({ idx: null, type: null });
        setAnimating(false);
      }, 1600);
    }, 700);
  }

  function handleDelete(idx: number) {
    setAnimating(true);
    setExplanation("Node at position floats upward (deletion)!");
    setAnimationStep({ type: "del", idx });
    setFloatInfo({ idx, type: "del" });
    setTimeout(() => {
      const deleted = list[idx]?.value;
      setList(list => list.filter((_, i) => i !== idx));
      if (selectedIdx === idx) setSelectedIdx(null);
      else if (selectedIdx !== null && idx < selectedIdx) setSelectedIdx(selectedIdx - 1);
      setExplanation(
        `Deleted ${deleted} with floating-away animation!`
      );
      setTimeout(() => {
        setAnimationStep({ type: null, idx: null });
        setFloatInfo({ idx: null, type: null });
        setAnimating(false);
      }, 1050);
    }, 1200);
  }

  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <div className="flex gap-2 items-center w-full max-w-[340px]">
        <Input
          value={input}
          type="number"
          disabled={animating}
          placeholder="Enter value"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !animating && handleInsertTail()}
        />
        <Button
          onClick={handleInsertHead}
          disabled={!input.trim() || animating}
          variant="default"
        >
          Insert Head
        </Button>
        <Button
          onClick={handleInsertTail}
          disabled={!input.trim() || animating}
          variant="outline"
        >
          Insert Tail
        </Button>
      </div>
      <div className="flex gap-2 items-center min-h-[80px] w-full overflow-x-auto">
        {list.length === 0 ? (
          <span className="text-muted-foreground">List Empty</span>
        ) : (
          list.map((node, idx) => {
            const isNew =
              animationStep.type === "add" && animationStep.idx === idx;
            const isDel =
              animationStep.type === "del" && animationStep.idx === idx;
            let from: "left" | "right" | "up" | "down" = "up";
            if (isNew) {
              if (floatInfo.type === "addHead" && floatInfo.idx === idx) from = "down";
              if (floatInfo.type === "addTail" && floatInfo.idx === idx) from = "right";
              if (floatInfo.type === "addMid" && floatInfo.idx === idx) from = "left";
            }
            if (isDel && floatInfo.type === "del" && floatInfo.idx === idx) from = "up";
            return (
              <FloatingBox
                key={node.id}
                from={from}
                floating={isNew || isDel ? true : !(floatInfo.idx === idx && floatInfo.type)}
                duration={isNew || isDel ? 1200 : 700}
                className={
                  "flex flex-col items-center select-none transition-all duration-700 " +
                  (isNew
                    ? "bg-green-50 border-green-500 scale-105 shadow-xl"
                    : isDel
                    ? "bg-red-50 border-red-300 opacity-70 scale-95"
                    : "")
                }
                style={{
                  border: isNew
                    ? "2px solid #22c55e"
                    : isDel
                    ? "2px solid #f87171"
                    : selectedIdx === idx
                    ? "2px solid #6366f1"
                    : "2px solid var(--tw-border-opacity,1) var(--tw-prose-invert-borders)",
                  boxShadow: isNew
                    ? "0 0 0 4px rgba(34,197,94,0.16)"
                    : isDel
                    ? "0 0 0 4px rgba(239,68,68,0.15)"
                    : undefined,
                }}
              >
                <div
                  className={
                    "w-16 h-14 flex items-center justify-center border-2 " +
                    (selectedIdx === idx
                      ? "border-indigo-600 bg-indigo-100 font-bold"
                      : isNew
                      ? "border-green-500 bg-green-50 font-bold"
                      : isDel
                      ? "border-red-300 bg-red-50"
                      : "border-primary bg-primary/10") +
                    " rounded-lg shadow cursor-pointer select-none text-lg transition-all duration-700"
                  }
                  onClick={() => !animating && setSelectedIdx(idx)}
                  title="Click to select"
                >
                  {node.value}
                </div>
                <div className="h-4 flex items-center justify-center">
                  {idx < list.length - 1 && (
                    <svg width={24} height={8}>
                      <line
                        x1={0}
                        y1={4}
                        x2={24}
                        y2={4}
                        stroke="#6366f1"
                        strokeWidth={2}
                        markerEnd="url(#arrowhead)"
                      />
                      <defs>
                        <marker
                          id="arrowhead"
                          markerWidth="8"
                          markerHeight="8"
                          refX="5"
                          refY="4"
                          orient="auto"
                        >
                          <polygon points="0 0, 8 4, 0 8" fill="#6366f1" />
                        </marker>
                      </defs>
                    </svg>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-destructive"
                  disabled={animating}
                  onClick={() => !animating && handleDelete(idx)}
                >
                  Delete
                </Button>
              </FloatingBox>
            );
          })
        )}
      </div>
      <div className="flex gap-2 items-center w-full max-w-[340px]">
        <Button
          variant="secondary"
          onClick={() => setSelectedIdx(null)}
          disabled={selectedIdx === null || animating}
        >
          Deselect
        </Button>
        <Button
          onClick={handleInsertAfter}
          disabled={selectedIdx === null || !input.trim() || animating}
          variant="default"
        >
          Insert After Selected
        </Button>
      </div>
      <span className="text-xs text-muted-foreground text-center mt-1">
        Click a node to select for insertion after or deletion.
      </span>
      <div className="mt-4 text-sm bg-muted/70 rounded p-2 text-center w-full max-w-xl animate-fade-in">
        {explanation}
      </div>
    </div>
  );
}
