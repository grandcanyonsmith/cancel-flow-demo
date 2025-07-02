// import React from "react";
import { CancelFlow } from "./CancelFlow/CancelFlow";

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-100 p-8 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <h1 className="mb-8 text-3xl font-bold text-center">Manage Subscription</h1>
      <CancelFlow />
    </div>
  );
}
