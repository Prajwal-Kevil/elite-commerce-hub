import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const addMessage = useStore((state) => state.addMessage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in all fields");
      return;
    }

    addMessage({
      customerName: name,
      customerEmail: email,
      message,
    });

    toast.success("Message sent! We'll get back to you soon.");
    setName("");
    setEmail("");
    setMessage("");
    setIsOpen(false);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-primary flex items-center justify-center glow hover:glow-strong transition-all duration-300 hover:scale-110"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-primary-foreground" />
        ) : (
          <MessageCircle className="h-6 w-6 text-primary-foreground" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 glass rounded-2xl overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="gradient-primary p-4">
            <h3 className="font-display font-semibold text-primary-foreground">
              Need Help?
            </h3>
            <p className="text-primary-foreground/80 text-sm">
              Send us a message and we'll respond shortly
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <Input
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-muted border-border"
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-muted border-border"
              />
            </div>
            <div>
              <Textarea
                placeholder="How can we help?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="bg-muted border-border resize-none"
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </form>
        </div>
      )}
    </>
  );
};
