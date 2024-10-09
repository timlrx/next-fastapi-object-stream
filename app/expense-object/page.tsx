"use client";

import { ObjectIcon, VercelIcon } from "@/components/icons";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { type Expense, type PartialExpense } from "@/app/api/chat/schema";
import { useStreamJson } from "./useStreamJson";

const api =
  process.env.NODE_ENV === "production"
    ? "https://stream-demo.zapdos.io/api/stream_object_json"
    : "/api/stream_object_json";

const ExpenseView = ({ expense }: { expense: Expense | PartialExpense }) => {
  return (
    <motion.div
      className={`flex flex-row gap-2 px-4 w-full md:w-[500px] md:px-0`}
      initial={{ opacity: 0.4 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex flex-row gap-4 w-full">
        <div className="text-zinc-400 dark:text-zinc-400 w-16">
          {expense?.date || "N/A"}
        </div>
        <div className="text-zinc-800 dark:text-zinc-300 flex-1 capitalize flex flex-row gap-2 items-center">
          <div>{expense?.details || "Processing..."}</div>
          <div className="flex flex-row gap-2 size-6">
            {expense?.participants?.map((participant) => (
              <img
                key={participant}
                className="size-full rounded-full"
                src={`https://vercel.com/api/www/avatar?u=${participant}&s=64`}
                alt={participant}
              />
            ))}
          </div>
        </div>
        <div className="text-zinc-600 dark:text-zinc-300 text-xs bg-zinc-200 rounded-md flex flex-row items-center p-1 font-medium capitalize h-fit dark:bg-zinc-700 dark:text-zinc-300">
          {expense?.category?.toLowerCase() || "N/A"}
        </div>
        <div className="text-emerald-600 dark:text-emerald-400 w-8 text-right">
          ${expense?.amount ?? "N/A"}
        </div>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const { streamJson, isLoading, error } = useStreamJson<Expense>();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const input = form.elements.namedItem("expense") as HTMLInputElement;

    if (input.value.trim()) {
      setExpenses((prev) => [...prev, {} as Expense]); // Add a new empty expense

      await streamJson({
        url: api,
        method: "POST",
        body: { expense: input.value },
        onChunk: (chunk) => {
          setExpenses((prev) => {
            const newExpenses = [...prev];
            newExpenses[newExpenses.length - 1] = {
              ...newExpenses[newExpenses.length - 1],
              ...chunk,
            } as Expense;
            return newExpenses;
          });
        },
      });

      setInput("");
      inputRef.current?.focus();
    }
  };

  return (
    <>
      <form className="gap-2 items-center" onSubmit={handleSubmit}>
        <input
          name="expense"
          className="bg-zinc-100 rounded-md px-2 py-1.5 w-full md:w-[500px] outline-none dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300 disabled:text-zinc-400 disabled:cursor-not-allowed placeholder:text-zinc-400"
          placeholder="Expense a transaction..."
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
          }}
          disabled={isLoading}
          ref={inputRef}
        />
      </form>
      {expenses.length > 0 || isLoading ? (
        <div className="flex flex-col gap-2 h-full items-center">
          {expenses.map((expense, index) => (
            <ExpenseView key={index} expense={expense} />
          ))}
        </div>
      ) : (
        <motion.div className="h-[350px] px-4 w-full md:w-[500px] md:px-0 pt-20">
          <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
            <p className="flex flex-row justify-center gap-4 items-center text-zinc-900 dark:text-zinc-50">
              <VercelIcon />
              <span>+</span>
              <ObjectIcon />
            </p>
            <p>Custom hook with object partial to json stream</p>
            <p>
              Learn more about{" "}
              <Link
                className="text-blue-500 dark:text-blue-400"
                href="https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams"
                target="_blank"
              >
                placeholder
              </Link>
            </p>
          </div>
        </motion.div>
      )}
    </>
  );
}
