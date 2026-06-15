"use client";

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

type FileUploadFieldProps = {
  name: string;
  label: string;
  accept: string;
  hint?: string;
  previewType?: "image" | "video" | "none";
  className?: string;
};

export function FileUploadField({
  name,
  label,
  accept,
  hint,
  previewType = "none",
  className,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    if (!file) {
      setFileName("");
      setPreviewUrl(null);
      return;
    }

    setFileName(file.name);
    if (previewType !== "none") {
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  function clearFile() {
    if (inputRef.current) inputRef.current.value = "";
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFileName("");
    setPreviewUrl(null);
  }

  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-semibold text-ink">{label}</label>
      <div className="rounded-sm border border-dashed border-slate-300 bg-white p-4 dark:border-slate-600 dark:bg-slate-900">
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={accept}
          onChange={handleChange}
          className="sr-only"
          id={`${name}-upload`}
        />
        <label
          htmlFor={`${name}-upload`}
          className="flex cursor-pointer flex-col items-center justify-center gap-2 text-center"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/20">
            <Upload className="h-5 w-5" />
          </div>
          <span className="text-sm font-semibold text-ink">
            {fileName || "Choose a file to upload"}
          </span>
          {hint ? <span className="text-xs text-muted">{hint}</span> : null}
        </label>

        {previewUrl && previewType === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element -- local blob preview
          <img
            src={previewUrl}
            alt="Preview"
            className="mx-auto mt-4 max-h-40 rounded-sm object-cover"
          />
        ) : null}

        {previewUrl && previewType === "video" ? (
          <video
            src={previewUrl}
            controls
            className="mx-auto mt-4 max-h-48 w-full rounded-sm bg-ink"
          />
        ) : null}

        {fileName ? (
          <button
            type="button"
            onClick={clearFile}
            className="mx-auto mt-3 flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"
          >
            <X className="h-3.5 w-3.5" />
            Remove file
          </button>
        ) : null}
      </div>
    </div>
  );
}
