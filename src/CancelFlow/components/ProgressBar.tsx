import React from "react";
export const ProgressBar: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <div className="mb-6 h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-700">
    <div
      className="h-2 rounded-full bg-blue-600 transition-all dark:bg-blue-500"
      style={{ width: `${(current / total) * 100}%` }}
    />
  </div>
);
