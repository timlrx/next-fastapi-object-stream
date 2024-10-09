"use client";

import { useChat } from "ai/react";
import { useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import { VercelIcon } from "@/components/icons";

const api =
  process.env.NODE_ENV === "production"
    ? "https://stream-demo.zapdos.io/api/text_stream"
    : "/api/text_stream";

const MessageView = ({
  message,
}: {
  message: { role: string; content: string };
}) => {
  return (
    <motion.div
      className={`flex flex-row gap-2 px-4 w-full md:w-[500px] md:px-0`}
      initial={{ opacity: 0.4 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex flex-row gap-4 w-full">
        <div className="text-zinc-400 dark:text-zinc-400 w-16 capitalize">
          {message.role}:
        </div>
        <div className="text-zinc-800 dark:text-zinc-300 flex-1">
          {message.content}
        </div>
      </div>
    </motion.div>
  );
};

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: api,
      onError: (e) => {
        toast.error(`Failed to send message: ${e.message}`);
      },
      streamProtocol: "text",
    });

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <form className="gap-2 items-center" onSubmit={handleSubmit}>
        <input
          name="message"
          className="bg-zinc-100 rounded-md px-2 py-1.5 w-full md:w-[500px] outline-none dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300 disabled:text-zinc-400 disabled:cursor-not-allowed placeholder:text-zinc-400"
          placeholder="Type a message..."
          value={input}
          onChange={handleInputChange}
          disabled={isLoading}
          ref={inputRef}
        />
      </form>
      {messages.length > 0 ? (
        <div className="flex flex-col gap-2 h-full items-center">
          {messages.map((message) => (
            <MessageView key={message.id} message={message} />
          ))}
        </div>
      ) : (
        <motion.div className="h-[350px] px-4 w-full md:w-[500px] md:px-0 pt-20">
          <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
            <p className="flex flex-row justify-center gap-4 items-center text-zinc-900 dark:text-zinc-50">
              <VercelIcon />
              <span>Chat</span>
            </p>
            <p>
              This chat interface uses the useChat hook with text streams from a
              FastAPI server.
            </p>
            <p>
              Learn more about the{" "}
              <Link
                className="text-blue-500 dark:text-blue-400"
                href="https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat"
                target="_blank"
              >
                useChat{" "}
              </Link>
              hook from Vercel AI SDK.
            </p>
          </div>
        </motion.div>
      )}
    </>
  );
}
