import { useId, type ChangeEvent } from "react";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";

type UploadProps = {
  onSelect: (file: File | null) => void;
  previewUrl?: string | null;
  disabled?: boolean;
  error?: string | null;
  label?: string;
};

export const Upload = ({
  onSelect,
  previewUrl,
  disabled = false,
  error,
  label = "Upload reference image",
}: UploadProps) => {
  const id = useId();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    onSelect(file ?? null);
    event.target.value = "";
  };

  const hasPreview = Boolean(previewUrl);

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </label>

      <div className="group relative flex items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/5 p-8 transition-all duration-300 hover:border-indigo-400/50 hover:bg-white/10 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-400/30">
        <input
          id={id}
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleChange}
          disabled={disabled}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          aria-describedby={error ? `${id}-error` : undefined}
        />

        {hasPreview ? (
          <div className="relative h-64 w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-lg">
            <img
              src={previewUrl ?? ""}
              alt="Selected reference"
              className="h-full w-full object-cover object-center"
              loading="lazy"
            />
            <button
              type="button"
              className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/10 p-2.5 text-white backdrop-blur transition-all hover:bg-red-500/20 hover:border-red-400/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              onClick={() => onSelect(null)}
              aria-label="Remove selected image"
              disabled={disabled}
            >
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/20">
              <PhotoIcon className="h-8 w-8 text-indigo-300" aria-hidden="true" />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-white">Drag & drop or click to browse</p>
              <p className="text-xs text-slate-400">JPEG or PNG format, maximum 10MB</p>
            </div>
          </div>
        )}
      </div>

      <p id={`${id}-error`} className="min-h-[1.25rem] text-xs font-medium text-red-400">
        {error}
      </p>
    </div>
  );
};

export default Upload;

