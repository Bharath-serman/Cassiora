import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export default function FeedbackForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Feedback sent!",
          description: "Thank you for your feedback.",
        });
        setEmail("");
        setMessage("");
      } else {
        toast({
          title: "Error sending feedback",
          description: data?.error || "An error occurred. Please try again.",
        });
      }
    } catch (err: any) {
      toast({
        title: "Unexpected error",
        description: err?.message || "An error occurred. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto p-4 border rounded-xl bg-background shadow flex flex-col gap-3 mb-0"
    >
      <h3 className="text-lg font-semibold mb-1">Send Feedback</h3>
      <Input
        type="email"
        required
        placeholder="Your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        disabled={sending}
      />
      <Textarea
        required
        minLength={10}
        maxLength={2000}
        placeholder="Your feedback (at least 10 characters)"
        value={message}
        onChange={e => setMessage(e.target.value)}
        rows={4}
        disabled={sending}
      />
      <Button type="submit" disabled={sending} className="w-full">
        {sending ? "Sending..." : "Send Feedback"}
      </Button>
    </form>
  );
}
