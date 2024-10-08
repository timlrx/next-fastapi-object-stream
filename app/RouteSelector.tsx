"use client";

import { useRouter } from "next/navigation";

const RouteSelector = () => {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4 mb-2">
      <label className="text-zinc-600 dark:text-zinc-300">Mode:</label>
      <select
        onChange={(e) =>
          router.push(e.target.value === "expense" ? "/" : `/${e.target.value}`)
        }
        className="bg-zinc-100 rounded-md px-2 py-1 outline-none dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300"
      >
        <option value="expense">Expense Text Stream</option>
        <option value="chat">Chat Text Stream</option>
        <option value="expense-object">Expense Object Stream</option>
      </select>
    </div>
  );
};

export default RouteSelector;
