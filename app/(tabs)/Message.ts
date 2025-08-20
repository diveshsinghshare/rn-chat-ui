export type Message = {
  id: string;                 // unique identifier
  text?: string;              // message content
  image?: string;             // optional image URL
  sender: "me" | "john";      // could be expanded later to string (userId)
  timestamp: string;          // ISO string or formatted date
  reactions?: string[];       // emojis or reaction codes

  replyTo?: {
    id: string;
    text?: string;
    sender: "me" | "john";    //  reference to original sender
  };
};
