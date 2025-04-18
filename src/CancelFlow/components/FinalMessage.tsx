import React from "react";
export const FinalMessage: React.FC<{ text: string }> = ({ text }) => (
  <div className="text-center">
    <h2 className="mb-4 text-2xl font-bold">{text}</h2>
    <p className="text-zinc-500">A confirmation email is on its way.</p>
  </div>
);
