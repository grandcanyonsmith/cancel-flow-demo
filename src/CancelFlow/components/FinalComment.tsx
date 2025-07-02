import React, { useState } from "react";
export const FinalComment: React.FC<{ onSubmit: () => void }> = ({ onSubmit }) => {
  const [txt, setTxt] = useState("");
  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">Any final thoughts?</h2>
      <textarea
        value={txt}
        onChange={(e) => setTxt(e.target.value)}
        rows={4}
        className="w-full resize-none rounded-lg border p-3 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
      />
      <button
        onClick={onSubmit}
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
      >
        Submit & Cancel
      </button>
    </div>
  );
};
