import { useState, useRef, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

type ChatMessage = {
  type: "user" | "bot";
  message: string;
};

function formatBotMessage(content: string) {
  // Code blocks (triple backticks)
  let html = content.replace(/```([\s\S]*?)```/g, '<pre class="bg-zinc-900 text-white rounded p-3 overflow-x-auto mb-2"><code>$1</code></pre>');

  // Headings: #, ##, ###
  html = html.replace(/^### (.*)$/gm, '<h3 class="font-semibold text-base mt-4 mb-2">$1</h3>');
  html = html.replace(/^## (.*)$/gm, '<h2 class="font-bold text-lg mt-5 mb-2">$1</h2>');
  html = html.replace(/^# (.*)$/gm, '<h1 class="font-extrabold text-xl mt-6 mb-3">$1</h1>');

  // Bold subheadings: lines like 'Definition:' or 'Key points:'
  html = html.replace(/^(\s*)([A-Z][\w\s]+:)/gm, '$1<strong class="font-semibold">$2</strong>');

  // Bold (**text**)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italic (*text* or _text_)
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');
  // Inline code (`code`)
  html = html.replace(/`([^`]+)`/g, '<code class="bg-zinc-200 dark:bg-zinc-800 rounded px-1 py-0.5 text-sm">$1</code>');
  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline dark:text-blue-400">$1</a>');

  // Paragraphs and line breaks
  html = html.replace(/\n\s*\n/g, '</p><p>'); // Paragraphs
  html = html.replace(/\n/g, '<br/>'); // Line breaks

  // Format lists (lines starting with - or *)
  html = html.replace(/(<p>)?((?:[-*] .+<br\/>)+)/g, (match, p1, p2) => {
    const items = p2.split(/<br\/>/g).filter(Boolean).map(i => i.replace(/^[-*] /, ''));
    return '<ul class="list-disc pl-6 my-2">' + items.map(i => `<li>${i}</li>`).join('') + '</ul>';
  });
  // Numbered lists
  html = html.replace(/(<p>)?((?:\d+\. .+<br\/>)+)/g, (match, p1, p2) => {
    const items = p2.split(/<br\/>/g).filter(Boolean).map(i => i.replace(/^\d+\. /, ''));
    return '<ol class="list-decimal pl-6 my-2">' + items.map(i => `<li>${i}</li>`).join('') + '</ol>';
  });

  // Wrap in paragraph if not already
  if (!/^<pre/.test(html) && !/^<h[1-3]/.test(html)) html = `<p>${html}</p>`;
  return html;
}


function BotMessageFormatted({ content }: { content: string }) {
  return <span dangerouslySetInnerHTML={{ __html: formatBotMessage(content) }} />;
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Prevent background scroll in fullscreen
  useEffect(() => {
    if (fullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [fullscreen]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [open]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { type: "user", message: input }]);
    setBusy(true);
    setInput("");
    try {
      // Call backend /api/chat endpoint instead of OpenRouter directly
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct:free",
          messages: [
            { role: "system", content: "You are Violet, an expert AI assistant specializing in technical interviews, data structures and algorithms (DSA), artificial intelligence, machine learning, verbal reasoning, and communication skills. Give clear, deep, and practical answers to help users master these topics. For other topics, answer helpfully as a general AI assistant." },
            ...messages.map((msg) => ({
              role: msg.type === "user" ? "user" : "assistant",
              content: msg.message,
            })),
            { role: "user", content: input }
          ],
        }),
      });
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      console.log("API raw response:", data);
      console.log("choices:", data.choices);
      console.log("first choice:", data.choices?.[0]);
      console.log("first choice message:", data.choices?.[0]?.message);
      console.log("first choice message content:", data.choices?.[0]?.message?.content);
      const botMsg =
        data.choices?.[0]?.message?.content?.trim() ||
        data.choices?.[0]?.message?.reasoning?.trim() ||
        "Sorry, I couldn't answer that.";
      setMessages((prev) => [...prev, { type: "bot", message: botMsg }]);
    } catch (err) {
      console.error("Chatbot API error:", err);
      setMessages((prev) => [...prev, { type: "bot", message: "Sorry, there was a problem connecting to the AI. Please try again later." }]);
    }
    setBusy(false);
  };

  return (
    <>
      <button
        className="fixed bottom-6 right-6 z-40 rounded-full bg-primary text-white dark:bg-zinc-800 dark:text-primary p-0.5 shadow-lg hover:scale-105 transition-transform border-2 border-primary/70 dark:border-primary"
        aria-label="Open Cassiora Chatbot"
        onClick={() => setOpen((o) => !o)}
      >
        {/* Theme-adaptive logo: Bot icon with color changing on theme */}
        <span className="block">
          <svg
            width="38" height="38" viewBox="0 0 38 38" fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-9 h-9 p-1"
          >
            <circle cx="19" cy="19" r="18" fill="currentColor" className="text-primary dark:text-zinc-900 transition-colors" />
            <path d="M12 23c0-3 2.5-5 7-5s7 2 7 5v2.5a2.5 2.5 0 01-2.5 2.5h-9A2.5 2.5 0 0112 25.5V23z" fill="#fff" fillOpacity=".95" />
            <circle cx="15.5" cy="21" r="1.2" fill="#4f46e5" className="dark:fill-primary" />
            <circle cx="22.5" cy="21" r="1.2" fill="#4f46e5" className="dark:fill-primary" />
            <rect x="17" y="25" width="4" height="1.2" rx="0.6" fill="#4f46e5" className="dark:fill-primary" />
          </svg>
        </span>
      </button>
      <div
        className={cn(
          fullscreen
            ? "fixed inset-0 z-50 w-full h-full bg-background dark:bg-zinc-900 flex flex-col transition-all duration-200"
            : "fixed bottom-20 right-6 z-50 w-80 bg-card border rounded-xl shadow-lg p-3 flex flex-col transition-all duration-200",
          open
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 pointer-events-none translate-y-6"
        )}
        style={fullscreen ? { minHeight: '100vh', maxHeight: '100vh', padding: 0 } : { minHeight: 320, maxHeight: 440 }}
      >
        <div className={fullscreen ? "flex items-center justify-between w-full px-6 py-4 border-b border-zinc-200 dark:border-zinc-700 bg-background dark:bg-zinc-900 sticky top-0 z-10" : "font-bold text-base mb-2 text-primary flex items-center gap-1 justify-between w-full"}>
          <span className="flex items-center gap-2 text-lg font-bold text-primary dark:text-white">
            <svg width="30" height="30" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block mr-1 align-middle"><circle cx="19" cy="19" r="18" fill="currentColor" className="text-primary dark:text-zinc-900 transition-colors" /><path d="M12 23c0-3 2.5-5 7-5s7 2 7 5v2.5a2.5 2.5 0 01-2.5 2.5h-9A2.5 2.5 0 0112 25.5V23z" fill="#fff" fillOpacity=".95" /><circle cx="15.5" cy="21" r="1.2" fill="#4f46e5" className="dark:fill-primary" /><circle cx="22.5" cy="21" r="1.2" fill="#4f46e5" className="dark:fill-primary" /><rect x="17" y="25" width="4" height="1.2" rx="0.6" fill="#4f46e5" className="dark:fill-primary" /></svg>
            Violet
            <span className="ml-1 text-yellow-500 font-extrabold animate-pulse">●</span>
          </span>
          <button
            onClick={() => setFullscreen(f => !f)}
            className={fullscreen ? "ml-auto px-3 py-1 text-sm rounded bg-zinc-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors duration-200 border border-zinc-300 dark:border-zinc-700" : "ml-auto px-2 py-1 text-xs rounded bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors duration-200"}
            aria-label={fullscreen ? "Minimize chat" : "Fullscreen chat"}
          >
            {fullscreen ? <>&times; Close</> : "Fullscreen"}
          </button>
        </div>
        <div
          className={fullscreen ? "flex-1 overflow-y-auto px-0 py-0 bg-background dark:bg-zinc-900" : "flex-1 overflow-y-auto border rounded-lg mb-2 px-2 py-2 bg-muted/70"}
          style={fullscreen ? { minHeight: 0, maxHeight: 'none' } : { minHeight: 180, maxHeight: 220 }}
        >
          {messages.length === 0 && (
            <div className="text-center text-xs text-muted-foreground mt-6">
              Ask me anything about interview prep, DSA, ML, or general concepts!
            </div>
          )}
          <div className={fullscreen ? "flex flex-col gap-3 px-0 py-6 md:px-20 lg:px-40 xl:px-64" : undefined}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  fullscreen
                    ? msg.type === "user"
                      ? "self-end bg-primary text-white dark:bg-blue-700 dark:text-white rounded-2xl px-5 py-3 max-w-[75%] text-base shadow-md"
                      : "self-start bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-2xl px-5 py-3 max-w-[75%] text-base shadow"
                    : msg.type === "user"
                      ? "bg-primary/80 text-white ml-auto dark:bg-blue-700 dark:text-white my-1 px-2 py-1 rounded max-w-[86%] whitespace-pre-line"
                      : "bg-secondary text-accent-foreground mr-auto dark:bg-zinc-800 dark:text-primary my-1 px-2 py-1 rounded max-w-[86%] whitespace-pre-line"
                )}
                style={fullscreen ? { marginBottom: 0 } : {}}
              >
                {msg.type === "bot"
                  ? <BotMessageFormatted content={msg.message} />
                  : msg.message
                }
              </div>
            ))}
            {busy && (
              <div className={fullscreen ? "self-start flex items-center gap-2 mt-2 mb-4" : "flex items-center gap-2 mt-2 text-sm text-primary font-medium"}>
                <div className="typing-bubble">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
                <span className="text-primary text-base font-medium"></span>
              </div>
            )}
          </div>
          <div ref={chatEndRef} />
        </div>
        <div className={fullscreen ? "w-full flex items-center gap-2 px-6 py-4 bg-background dark:bg-zinc-900 sticky bottom-0 z-10 border-t border-zinc-200 dark:border-zinc-700" : "flex"}>
          <input
            type="text"
            ref={inputRef}
            value={input}
            disabled={busy}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            className={
              cn(
                fullscreen
                  ? "flex-1 rounded-xl border border-zinc-300 dark:border-zinc-700 p-3 text-base bg-background text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  : "flex-1 rounded-l-lg border border-border p-2 transition bg-background text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary"
              )
            }
            placeholder="Type your question..."
            autoFocus={open}
          />
          <button
            onClick={handleSend}
            disabled={busy || !input.trim()}
            className={
              cn(
                fullscreen
                  ? "rounded-xl px-5 py-3 font-bold text-base ml-2 bg-primary text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500 disabled:bg-zinc-600 disabled:text-zinc-300 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-400"
                  : "rounded-r-lg px-4 py-2 font-bold transition border-l border-primary bg-primary text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500 disabled:bg-zinc-400 disabled:text-zinc-300 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-400"
              )
            }
          >
            Send
          </button>
        </div>
        <style>{`
          .typing-bubble {
            display: inline-flex;
            align-items: center;
            padding: 8px 16px;
            background: #e5e7eb;
            border-radius: 9999px;
            min-width: 48px;
            min-height: 28px;
            box-shadow: 0 1px 6px 0 rgba(0,0,0,0.04);
            margin-right: 8px;
            position: relative;
            animation: typing-bubble-pulse 1.5s infinite;
          }
          .dark .typing-bubble {
            background: #27272a;
          }
          .typing-bubble .dot {
            width: 8px;
            height: 8px;
            margin: 0 2px;
            border-radius: 50%;
            background: #6366f1;
            opacity: 0.5;
            animation: typing-dot-blink 1.4s infinite both;
          }
          .typing-bubble .dot:nth-child(2) {
            animation-delay: 0.2s;
          }
          .typing-bubble .dot:nth-child(3) {
            animation-delay: 0.4s;
          }
          @keyframes typing-dot-blink {
            0%, 80%, 100% { opacity: 0.5; }
            40% { opacity: 1; }
          }
          @keyframes typing-bubble-pulse {
            0%, 100% { box-shadow: 0 1px 6px 0 rgba(0,0,0,0.04); }
            50% { box-shadow: 0 2px 12px 0 rgba(99,102,241,0.08); }
          }
        `}</style>
      </div>
    </>
  );
}
