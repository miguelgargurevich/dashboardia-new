import React from "react";
import ReactMarkdown from "react-markdown";

export default function MarkdownViewer({ content }: { content: string }) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <ReactMarkdown>{content || ""}</ReactMarkdown>
    </div>
  );
}
