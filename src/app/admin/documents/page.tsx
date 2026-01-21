"use client";

import DocumentUpload from "../_components/DocumentUpload";

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Documents</h1>
        <p className="text-foreground/60">Upload and manage documents for vector ingestion</p>
      </div>

      <DocumentUpload />
    </div>
  );
}