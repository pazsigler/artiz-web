"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { listAllMedia, uploadMediaFile, deleteMediaFile, MediaFile } from "@/lib/storage";

const FOLDER_LABELS: Record<string, string> = {
  all: "הכל",
  products: "מוצרים",
  blog: "בלוג",
  pages: "עמודים",
  slides: "סליידים",
  media: "כללי",
};

export default function AdminMedia() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
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

  useEffect(() => { load(); }, [load]);

  const handleUpload = async (fileList: FileList) => {
    setUploading(true);
    try {
      for (const file of Array.from(fileList)) {
        await uploadMediaFile(file);
      }
      await load();
    } catch {
      alert("שגיאה בהעלאת קבצים");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDelete = async (file: MediaFile) => {
    if (!confirm(`למחוק את "${file.name}"?`)) return;
    try {
      await deleteMediaFile(file.url);
      setFiles((prev) => prev.filter((f) => f.url !== file.url));
      if (selected === file.url) setSelected(null);
    } catch {
      alert("שגיאה במחיקת קובץ");
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("הקישור הועתק!");
  };

  const filtered = files.filter((f) => {
    if (filter !== "all" && f.folder !== filter) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const formatSize = (bytes: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  const selectedFile = files.find((f) => f.url === selected);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-primary">ספריית מדיה</h2>
        <div className="flex gap-2">
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
            className="bg-pink text-white px-6 py-2 rounded-full font-semibold hover:bg-pink/90 transition-colors text-sm disabled:opacity-50"
          >
            {uploading ? "מעלה..." : "+ העלאת קבצים"}
          </button>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Folder filter pills */}
        <div className="flex gap-1 flex-wrap">
          {Object.entries(FOLDER_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                filter === key
                  ? "bg-primary text-white"
                  : "bg-primary/5 text-primary/60 hover:bg-primary/10"
              }`}
            >
              {label}
              {key !== "all" && (
                <span className="mr-1 opacity-60">
                  ({files.filter((f) => f.folder === key).length})
                </span>
              )}
              {key === "all" && (
                <span className="mr-1 opacity-60">({files.length})</span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="חיפוש לפי שם קובץ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-primary/15 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-pink"
          />
        </div>

        {/* View toggle */}
        <div className="flex border border-primary/15 rounded-xl overflow-hidden">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary text-white" : "text-primary/40 hover:bg-primary/5"}`}
            aria-label="תצוגת רשת"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary text-white" : "text-primary/40 hover:bg-primary/5"}`}
            aria-label="תצוגת רשימה"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("border-pink", "bg-pink/5"); }}
        onDragLeave={(e) => { e.currentTarget.classList.remove("border-pink", "bg-pink/5"); }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove("border-pink", "bg-pink/5");
          if (e.dataTransfer.files.length) handleUpload(e.dataTransfer.files);
        }}
        className="border-2 border-dashed border-primary/15 rounded-2xl p-4 mb-6 text-center text-primary/30 text-sm transition-colors"
      >
        גרור קבצים לכאן להעלאה
      </div>

      {loading ? (
        <div className="text-center text-primary/40 py-16">טוען מדיה...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-primary/40 py-16">
          {files.length === 0 ? "אין קבצי מדיה עדיין" : "לא נמצאו תוצאות"}
        </div>
      ) : (
        <div className="flex gap-6">
          {/* Files area */}
          <div className="flex-1 min-w-0">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {filtered.map((file) => (
                  <button
                    key={file.url}
                    onClick={() => setSelected(file.url === selected ? null : file.url)}
                    className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selected === file.url
                        ? "border-pink shadow-lg shadow-pink/20"
                        : "border-primary/10 hover:border-primary/30"
                    }`}
                  >
                    <Image
                      src={file.url}
                      alt={file.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs truncate">{file.name}</p>
                    </div>
                    {selected === file.url && (
                      <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-pink flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map((file) => (
                  <button
                    key={file.url}
                    onClick={() => setSelected(file.url === selected ? null : file.url)}
                    className={`w-full flex items-center gap-4 p-3 rounded-xl border transition-all text-right ${
                      selected === file.url
                        ? "border-pink bg-pink/5"
                        : "border-primary/10 hover:border-primary/20 hover:bg-primary/3"
                    }`}
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-primary/5 flex-shrink-0 relative">
                      <Image src={file.url} alt={file.name} fill className="object-cover" sizes="56px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-primary truncate">{file.name}</p>
                      <p className="text-xs text-primary/40">
                        {FOLDER_LABELS[file.folder] || file.folder}
                        {file.size ? ` \u00B7 ${formatSize(file.size)}` : ""}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selectedFile && (
            <div className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-4 bg-white border border-primary/10 rounded-2xl p-4 space-y-4">
                <div className="aspect-square rounded-xl overflow-hidden bg-primary/5 relative">
                  <Image src={selectedFile.url} alt={selectedFile.name} fill className="object-contain" sizes="288px" />
                </div>
                <div>
                  <p className="font-bold text-primary text-sm break-all">{selectedFile.name}</p>
                  <p className="text-xs text-primary/40 mt-1">
                    {FOLDER_LABELS[selectedFile.folder] || selectedFile.folder}
                    {selectedFile.size ? ` \u00B7 ${formatSize(selectedFile.size)}` : ""}
                  </p>
                  {selectedFile.createdAt && (
                    <p className="text-xs text-primary/40 mt-1">
                      {new Date(selectedFile.createdAt).toLocaleDateString("he-IL")}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => copyUrl(selectedFile.url)}
                    className="w-full bg-primary text-white py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    העתק קישור
                  </button>
                  <a
                    href={selectedFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center border border-primary/20 text-primary py-2 rounded-xl text-sm font-semibold hover:bg-primary/5 transition-colors"
                  >
                    פתח בחלון חדש
                  </a>
                  <button
                    onClick={() => handleDelete(selectedFile)}
                    className="w-full border border-red-200 text-red-500 py-2 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors"
                  >
                    מחק
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mobile detail actions (when selected) */}
      {selectedFile && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-primary/10 p-4 flex gap-2 z-30">
          <button
            onClick={() => copyUrl(selectedFile.url)}
            className="flex-1 bg-primary text-white py-2.5 rounded-xl text-sm font-semibold"
          >
            העתק קישור
          </button>
          <button
            onClick={() => handleDelete(selectedFile)}
            className="px-4 py-2.5 border border-red-200 text-red-500 rounded-xl text-sm font-semibold"
          >
            מחק
          </button>
          <button
            onClick={() => setSelected(null)}
            className="px-4 py-2.5 border border-primary/20 text-primary rounded-xl text-sm font-semibold"
          >
            סגור
          </button>
        </div>
      )}
    </div>
  );
}
