import React from 'react'
export const FinalMessage: React.FC<{ text: string }> = ({ text }) => (
  <div className="text-center">
    <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
      {text}
    </h2>
    <p className="text-zinc-500 dark:text-zinc-400">
      A confirmation email is on its way.
    </p>
  </div>
)
