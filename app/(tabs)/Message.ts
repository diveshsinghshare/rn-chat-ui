export type Message = {
  id: string;
  text?: string;
  image?: string;
  sender: "me" | "john";  // or "other"
  timestamp: string;
  reactions?: string[];
  
  replyTo?: {
    id: string;
    text?: string;
    sender: "me" | "john"; // 👈 important
  };
};
