import React, { useState } from "react";
import { useToast } from "../../contexts/ToastContext";

export const FinalComment: React.FC<{ onSubmit: () => void }> = ({ onSubmit }) => {
  const [txt, setTxt] = useState("");
  const { showSuccess, showInfo } = useToast();

  const handleSubmit = () => {
    if (txt.trim()) {
      showSuccess("Thank you for your detailed feedback!");
    } else {
      showInfo("Proceeding without additional comments");
    }
    onSubmit();
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">Any final thoughts?</h2>
      <textarea
        value={txt}
        onChange={(e) => setTxt(e.target.value)}
        rows={4}
        placeholder="Share any additional feedback that might help us improve..."
        className="w-full resize-none rounded-lg border p-3 dark:border-zinc-700 dark:bg-zinc-800 placeholder:text-zinc-400"
      />
      <button
        onClick={handleSubmit}
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition-colors"
      >
        Submit & Cancel
      </button>
    </div>
  );
};
