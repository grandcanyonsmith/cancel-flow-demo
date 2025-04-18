import React from "react";
import { motion } from "framer-motion";
import { useCancelFlow } from "./useCancelFlow";
import { Question } from "./components/Question";
import { FinalComment } from "./components/FinalComment";
import { FinalMessage } from "./components/FinalMessage";
import { ProgressBar } from "./components/ProgressBar";

export const CancelFlow: React.FC = () => {
  const { current, progress, select, reset, feedback } = useCancelFlow();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto mt-10 w-full max-w-xl rounded-2xl border bg-white p-6 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900"
    >
      {progress.total > 1 && <ProgressBar {...progress} />}

      {current.kind === "question" && (
        <Question step={progress.current} {...current} onSelect={select} feedback={feedback} />
      )}

      {current.kind === "comment" && (
        <FinalComment onSubmit={() => select("SUBMIT")} />
      )}

      {current.kind === "final" && <FinalMessage text={current.text} />}

      <button
        onClick={reset}
        className="mt-6 text-sm text-zinc-400 hover:text-blue-600 hover:underline"
      >
        Never mind, I don’t want to cancel.
      </button>
    </motion.div>
  );
};
