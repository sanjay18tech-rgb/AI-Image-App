import { UserIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { buildAssetUrl } from "../lib/api";

type ChatMessageProps = {
  message: {
    id: string;
    role: "user" | "assistant";
    prompt?: string;
    style?: string;
    imageUrl?: string;
    referenceImage?: string;
    createdAt: string;
    isGenerating?: boolean;
  };
};

export const ChatMessage = ({ message }: ChatMessageProps) => {
  if (message.role === "user") {
    return (
      <div className="group w-full border-b border-white/5">
        <div className="mx-auto flex max-w-3xl gap-4 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
          <UserIcon className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 space-y-3 pt-1">
          {message.referenceImage && (
              <div className="relative inline-block max-w-md overflow-hidden rounded-xl border-2 border-white/10 bg-slate-900 shadow-lg">
              <img
                src={message.referenceImage}
                alt="Reference image"
                  className="h-auto w-full max-w-md object-cover"
                  style={{ maxHeight: "400px" }}
              />
            </div>
          )}
            <div className="prose prose-invert max-w-none">
              <p className="text-base leading-relaxed text-slate-100">{message.prompt}</p>
            {message.style && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-200">
                {message.style}
              </span>
                </div>
            )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group w-full border-b border-white/5 bg-gradient-to-b from-slate-950/50 to-transparent">
      <div className="mx-auto flex max-w-3xl gap-4 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
        <SparklesIcon className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 space-y-4 pt-1">
        {message.isGenerating ? (
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-6">
              <div className="flex gap-1.5">
              <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:-0.3s]" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:-0.15s]" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-400" />
            </div>
              <span className="text-sm font-medium text-slate-300">Generating your fashion design...</span>
          </div>
        ) : message.imageUrl ? (
            <div className="space-y-4">
              <div className="relative inline-block w-full max-w-2xl overflow-hidden rounded-2xl border-2 border-white/10 bg-slate-900 shadow-2xl">
              <img
                src={buildAssetUrl(message.imageUrl)}
                alt="Generated fashion design"
                  className="h-auto w-full object-contain"
                  style={{ 
                    maxHeight: "70vh",
                    minHeight: "300px",
                    display: "block"
                  }}
                  loading="lazy"
              />
            </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Your fashion design has been generated successfully</span>
              </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-sm text-slate-300">Ready to generate your fashion design.</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;

