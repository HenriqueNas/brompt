
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, FileCode, Eye } from 'lucide-react';

interface MarkdownPreviewProps {
  content: string;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
  const [copied, setCopied] = useState(false);
  const [isRaw, setIsRaw] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative group rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden shadow-sm">
      <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
        <button
          onClick={() => setIsRaw(!isRaw)}
          className="p-2 rounded-md bg-zinc-100/80 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 transition-colors backdrop-blur-sm"
          aria-label={isRaw ? "Show preview" : "Show raw markdown"}
          title={isRaw ? "Preview" : "Raw"}
        >
          {isRaw ? (
            <Eye className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
          ) : (
            <FileCode className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
          )}
        </button>
        <button
          onClick={handleCopy}
          className="p-2 rounded-md bg-zinc-100/80 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 transition-colors backdrop-blur-sm"
          aria-label="Copy to clipboard"
          title="Copy raw text"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
          )}
        </button>
      </div>
      <div className="p-6 prose prose-zinc dark:prose-invert max-w-none text-sm leading-relaxed">
        {isRaw ? (
          <pre className="whitespace-pre-wrap font-mono text-xs bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-md overflow-x-auto">
            {content}
          </pre>
        ) : (
          <ReactMarkdown>{content}</ReactMarkdown>
        )}
      </div>
    </div>
  );
};
