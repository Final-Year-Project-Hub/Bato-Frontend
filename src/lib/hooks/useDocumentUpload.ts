"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

export function useDocumentUpload() {
  const [uploading, setUploading] = useState(false);

  const uploadDocument = async (formData: {
    frameworkKey: string;
    frameworkName: string;
    version: string;
    officialDocsUrl: string;
    fileExtensions: string;
    subdirectory?: string;
    removePatterns?: string;
    cleanWhitespace: boolean;
    targetTokensPerChunk: number;
    maxTokensPerChunk: number;
    file: File;
  }) => {
    console.log("useDocumentUpload hook called");
    setUploading(true);

    try {
      const data = new FormData();
      
      console.log("Creating FormData...");
      
      // Map your form fields to backend expected fields
      data.append("frameworkKey", formData.frameworkKey.toLowerCase());
      data.append("frameworkName", formData.frameworkName);
      data.append("version", formData.version);
      data.append("baseUrl", formData.officialDocsUrl);
      data.append("extensions", formData.fileExtensions);
      
      if (formData.subdirectory) {
        data.append("subdirectory", formData.subdirectory);
      }
      
      if (formData.removePatterns) {
        data.append("removePatterns", formData.removePatterns);
      }
      
      data.append("cleanWhitespace", String(formData.cleanWhitespace));
      data.append("targetTokens", String(formData.targetTokensPerChunk));
      data.append("maxTokens", String(formData.maxTokensPerChunk));
      data.append("file", formData.file);

      // Optional backend fields
      data.append("collectionName", formData.frameworkKey.toLowerCase());
      data.append("recreateCollection", "false");

      console.log("Sending API request to /api/admin/documents/upload");
      console.log("File details:", {
        name: formData.file.name,
        size: formData.file.size,
        type: formData.file.type,
      });

      const response = await apiFetch("/api/admin/documents/upload", {
        method: "POST",
        body: data,
      });

      console.log("API Response received:", response);

      if (response.success) {
        toast.success("Framework uploaded successfully!", {
          description: `${formData.frameworkName} v${formData.version} has been processed`,
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || "Upload failed");
      }
    } catch (error: any) {
      console.error("Document upload error:", error);
      toast.error("Upload failed", {
        description: error.message || "An error occurred during upload",
      });
      return { success: false, error: error.message };
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadDocument,
    uploading,
  };
}