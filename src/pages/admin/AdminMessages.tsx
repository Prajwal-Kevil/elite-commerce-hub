import { useState } from "react";
import { Mail, Trash2, Reply, CheckCircle, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStore, Message } from "@/lib/store";
import { toast } from "sonner";

const AdminMessages = () => {
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const messages = useStore((state) => state.messages);
  const replyToMessage = useStore((state) => state.replyToMessage);
  const markMessageAsRead = useStore((state) => state.markMessageAsRead);
  const deleteMessage = useStore((state) => state.deleteMessage);

  const filteredMessages = messages.filter(
    (message) =>
      message.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase())
  ).reverse();

  const openReplyDialog = (message: Message) => {
    setSelectedMessage(message);
    setReplyText(message.reply || "");
    setIsReplyDialogOpen(true);
    if (!message.isRead) {
      markMessageAsRead(message.id);
    }
  };

  const handleReply = () => {
    if (!replyText.trim()) {
      toast.error("Please enter a reply");
      return;
    }

    if (selectedMessage) {
      replyToMessage(selectedMessage.id, replyText);
      toast.success("Reply sent successfully");
      setIsReplyDialogOpen(false);
    }
  };

  const handleDelete = (message: Message) => {
    if (confirm("Are you sure you want to delete this message?")) {
      deleteMessage(message.id);
      toast.success("Message deleted");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground mt-1">
          View and respond to customer inquiries
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-4">
        <div className="bg-card rounded-xl border border-border p-4 flex-1">
          <p className="text-muted-foreground text-sm">Total Messages</p>
          <p className="font-display text-2xl font-bold text-foreground">{messages.length}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 flex-1">
          <p className="text-muted-foreground text-sm">Unread</p>
          <p className="font-display text-2xl font-bold text-primary">
            {messages.filter((m) => !m.isRead).length}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 flex-1">
          <p className="text-muted-foreground text-sm">Replied</p>
          <p className="font-display text-2xl font-bold text-foreground">
            {messages.filter((m) => m.reply).length}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-card border-border"
        />
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <div
            key={message.id}
            className={`bg-card rounded-xl border p-6 transition-all ${
              !message.isRead ? "border-primary/50" : "border-border"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold">
                      {message.customerName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{message.customerName}</h3>
                      {!message.isRead && (
                        <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{message.customerEmail}</p>
                  </div>
                </div>

                <p className="text-foreground mb-2">{message.message}</p>
                <p className="text-xs text-muted-foreground">{formatDate(message.createdAt)}</p>

                {message.reply && (
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg border-l-2 border-primary">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">Your Reply</span>
                    </div>
                    <p className="text-muted-foreground text-sm">{message.reply}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openReplyDialog(message)}
                >
                  <Reply className="h-4 w-4 mr-1" />
                  {message.reply ? "Edit Reply" : "Reply"}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(message)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No messages found</p>
        </div>
      )}

      {/* Reply Dialog */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">
              Reply to {selectedMessage?.customerName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Original Message:</p>
              <p className="text-foreground">{selectedMessage?.message}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Your Reply</label>
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="mt-1"
                placeholder="Type your response..."
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleReply}>
                <Reply className="h-4 w-4 mr-2" />
                Send Reply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMessages;
