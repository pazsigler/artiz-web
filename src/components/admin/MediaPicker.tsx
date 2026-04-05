"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { listAllMedia, uploadMediaFile, MediaFile } from "@/lib/storage";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  folder?: string;
}

const FOLDER_LABELS: Record<string, string> = {
  all: "הכל",
  products: "מוצרים",
  blog: "בלוג",
  pages: "עמודים",
  slides: "סליידים",
  media: "כללי",
};

export default function MediaPicker({ open, onClose, onSelect, folder }: Props) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState(folder || "all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listAllMedia();
      setFiles(data);
    } catch {
      console.error("Failed to load media");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      load();
      setSelected(null);
      setSearch("");
    }
  }, [open, load]);

  const handleUpload = async (fileList: FileList) => {
    setUploading(true);
    try {
      for (const file of Array.from(fileList)) {
        await uploadMediaFile(file, folder || "media");
      }
      await load();
    } catch {
      alert("שגיאה בהעלאת קבצים");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleConfirm = () => {
    if (selected) {
      onSelect(selected);
      onClose();
    }
  };

  const filtered = files.filter((f) => {
    if (filter !== "all" && f.folder !== filter) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-primary/10">
          <h3 className="text-lg font-bold text-primary">בחירת מדיה</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-primary/5 rounded-lg transition-colors"
            aria-label="סגור"
          >
            <svg className="w-5 h-5 text-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-primary/5">
          <div className="flex gap-1 flex-wrap">
            {Object.entries(FOLDER_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  filter === key
                    ? "bg-primary text-white"
                    : "bg-primary/5 text-primary/60 hover:bg-primary/10"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="חיפוש..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[150px] border border-primary/15 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-accent"
          />
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) handleUpload(e.target.files);
            }}
          />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="bg-accent text-white px-4 py-1.5 rounded-full text-xs font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {uploading ? "מעלה..." : "העלאה"}
          </button>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center text-primary/40 py-12">טוען...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center text-primary/40 py-12">
              {files.length === 0 ? "אין קבצי מדיה" : "לא נמצאו תוצאות"}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
              {filtered.map((file) => (
                <button
                  key={file.url}
                  onClick={() => setSelected(file.url === selected ? null : file.url)}
                  className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selected === file.url
                      ? "border-accent shadow-lg shadow-accent/20 ring-2 ring-accent/30"
                      : "border-primary/10 hover:border-primary/25"
                  }`}
                >
                  <Image
                    src={file.url}
                    alt={file.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 33vw, 16vw"
                  />
                  {selected === file.url && (
                    <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-[10px] truncate">{file.name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-primary/10">
          <p className="text-xs text-primary/40">
            {selected ? "תמונה נבחרה" : "בחר תמונה מהספרייה או העלה חדשה"}
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="border border-primary/20 text-primary px-6 py-2 rounded-full text-sm font-semibold hover:bg-primary/5 transition-colors"
            >
              ביטול
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selected}
              className="bg-primary text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-40"
            >
              בחר
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
