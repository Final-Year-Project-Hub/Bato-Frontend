"use client";

import { useState } from "react";
import {
  Upload,
  File,
  X,
  CheckCircle,
  Database,
} from "lucide-react";

export default function DocumentUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const [vectorFiles, setVectorFiles] = useState<File[]>([]);
  const [ingesting, setIngesting] = useState(false);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "document" | "vector"
  ) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    type === "document"
      ? setFiles(selectedFiles)
      : setVectorFiles(selectedFiles);
  };

  const handleUpload = async () => {
    setUploading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setUploading(false);
    alert("Documents uploaded successfully!");
    setFiles([]);
  };

  const handleVectorIngestion = async () => {
    setIngesting(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIngesting(false);
    alert("Vectors ingested successfully!");
    setVectorFiles([]);
  };

  return (
    <div className="space-y-10">
      {/* ================= DOCUMENT UPLOAD ================= */}
      <div className="bg-background rounded-2xl border border-border p-6">
        <div className="border-2 border-dashed border-border rounded-xl p-12 text-center mb-6">
          <Upload className="w-12 h-12 text-foreground/40 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Upload Documents
          </h3>
          <p className="text-sm text-foreground/60 mb-4">
            Drag and drop files here, or click to browse
          </p>

          <input
            type="file"
            multiple
            id="doc-upload"
            onChange={(e) => handleFileChange(e, "document")}
            className="hidden"
          />
          <label
            htmlFor="doc-upload"
            className="inline-block bg-primary text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-primary/90 transition-colors"
          >
            Choose Files
          </label>
        </div>

        {files.length > 0 && (
          <div className="space-y-3 mb-6">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-grey rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <File className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-xs text-foreground/40">
                    {(file.size / 1024).toFixed(2)} KB
                  </span>
                </div>
                <button
                  onClick={() =>
                    setFiles(files.filter((_, i) => i !== index))
                  }
                  className="p-1 hover:bg-background rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {files.length > 0 && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Upload {files.length}{" "}
                {files.length === 1 ? "file" : "files"}
              </>
            )}
          </button>
        )}
      </div>

      {/* ================= VECTOR INGESTION ================= */}
      <div className="bg-background rounded-2xl border border-border p-6">
        <div className="border-2 border-dashed border-border rounded-xl p-12 text-center mb-6">
          <Database className="w-12 h-12 text-foreground/40 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Vector Ingestion
          </h3>
          <p className="text-sm text-foreground/60 mb-4">
            Upload files to generate and store vector embeddings
          </p>

          <input
            type="file"
            multiple
            id="vector-upload"
            onChange={(e) => handleFileChange(e, "vector")}
            className="hidden"
          />
          <label
            htmlFor="vector-upload"
            className="inline-block bg-primary text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-primary/90 transition-colors"
          >
            Choose Files
          </label>
        </div>

        {vectorFiles.length > 0 && (
          <div className="space-y-3 mb-6">
            {vectorFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-grey rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <File className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-xs text-foreground/40">
                    {(file.size / 1024).toFixed(2)} KB
                  </span>
                </div>
                <button
                  onClick={() =>
                    setVectorFiles(
                      vectorFiles.filter((_, i) => i !== index)
                    )
                  }
                  className="p-1 hover:bg-background rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {vectorFiles.length > 0 && (
          <button
            onClick={handleVectorIngestion}
            disabled={ingesting}
            className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {ingesting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Ingesting...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Ingest {vectorFiles.length}{" "}
                {vectorFiles.length === 1 ? "file" : "files"}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
