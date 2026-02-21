import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";

export default function MessagesPage() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    api.messages.contacts().then(setContacts).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedContact) return;

    const loadMessages = async () => {
      try {
        const data = await api.messages.list(selectedContact);
        setMessages(data);
        setTimeout(
          () =>
            scrollRef.current?.scrollTo({
              top: scrollRef.current.scrollHeight,
            }),
          100,
        );
      } catch (err) {
        console.error(err);
      }
    };

    loadMessages();

    // Poll for new messages every 5 seconds
    pollRef.current = setInterval(loadMessages, 5000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [selectedContact]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return;
    try {
      const msg = await api.messages.send({
        receiverId: selectedContact,
        content: newMessage.trim(),
      });
      setMessages((prev) => [...prev, msg]);
      setNewMessage("");
      setTimeout(
        () =>
          scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }),
        100,
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Messages</h2>
      <div className="grid gap-4 md:grid-cols-[300px_1fr]">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Contacts</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <ScrollArea className="h-[500px]">
              {contacts.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedContact(c.id)}
                  className={cn(
                    "w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent",
                    selectedContact === c.id && "bg-accent font-medium",
                  )}
                >
                  {c.name}
                  <span className="block text-xs text-muted-foreground">
                    {c.email}
                  </span>
                </button>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex h-[560px] flex-col p-4">
            {selectedContact ? (
              <>
                <div className="mb-2 border-b pb-2 text-sm font-medium">
                  {contacts.find((c) => c.id === selectedContact)?.name}
                </div>
                <ScrollArea className="flex-1" ref={scrollRef}>
                  <div className="space-y-2 pr-4">
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={cn(
                          "flex",
                          m.senderId === user!.id
                            ? "justify-end"
                            : "justify-start",
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[70%] rounded-lg px-3 py-2 text-sm",
                            m.senderId === user!.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted",
                          )}
                        >
                          {m.content}
                          <div className="mt-1 text-[10px] opacity-70">
                            {new Date(m.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="mt-2 flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type a message..."
                  />
                  <Button onClick={sendMessage} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-muted-foreground">
                Select a contact to start messaging
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
