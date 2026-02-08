"use client";

import { useState } from "react";
import { Upload, File, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useDocumentUpload } from "@/lib/hooks/useDocumentUpload";

/* ================= Schema ================= */
const frameworkSchema = z.object({
  frameworkKey: z
    .string()
    .min(1, "Framework key is required")
    .regex(/^[a-z0-9]+$/, "Lowercase, no spaces"),
  frameworkName: z.string().min(1, "Framework name is required"),
  version: z.string().min(1, "Version is required"),
  officialDocsUrl: z.string().url("Enter a valid URL"),
  fileExtensions: z
    .string()
    .min(1, "File extensions are required")
    .refine(
      (val) => val.split(",").every((ext) => ext.trim().startsWith(".")),
      "Each extension must start with a dot (e.g., .md, .mdx)"
    ),
  subdirectory: z.string().optional(),
  removePatterns: z.string().optional(),
  cleanWhitespace: z.boolean(),
  targetTokensPerChunk: z.number().min(100, "Minimum 100 tokens"),
  maxTokensPerChunk: z.number().min(100, "Minimum 100 tokens"),
});

type FrameworkFormValues = z.infer<typeof frameworkSchema>;

export default function DocumentUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Use the custom hook
  const { uploadDocument, uploading } = useDocumentUpload();

  const form = useForm<FrameworkFormValues>({
    resolver: zodResolver(frameworkSchema),
    defaultValues: {
      frameworkKey: "",
      frameworkName: "",
      version: "",
      officialDocsUrl: "",
      fileExtensions: ".md, .mdx",
      subdirectory: "",
      removePatterns: "",
      cleanWhitespace: true,
      targetTokensPerChunk: 800,
      maxTokensPerChunk: 4000,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    // Check if a file is already added
    if (files.length > 0) {
      toast.error("File already added", {
        description: "Only one .zip file at a time. Remove the existing file first.",
      });
      e.target.value = ""; // Reset input
      return;
    }

    // Validate: Only .zip files
    const invalidFiles = selectedFiles.filter(
      (file) => !file.name.toLowerCase().endsWith(".zip")
    );

    if (invalidFiles.length > 0) {
      toast.error("Invalid file type", {
        description: "Only .zip files are allowed",
      });
      e.target.value = ""; // Reset input
      return;
    }

    // Validate: Only one file at a time
    if (selectedFiles.length > 1) {
      toast.error("Multiple files not allowed", {
        description: "Please upload only one .zip file at a time",
      });
      e.target.value = ""; // Reset input
      return;
    }

    setFiles(selectedFiles);
  };

  const handleRemoveFile = () => {
    setFiles([]);
  };

  const onSubmit = async (data: FrameworkFormValues) => {
    console.log("Form submitted!");
    console.log("Form data:", data);
    console.log("Files:", files);

    // Check if file is uploaded
    if (files.length === 0) {
      toast.error("No file uploaded", {
        description: "Please upload a .zip file before submitting",
      });
      return;
    }

    console.log("Starting upload...");

    // Call the hook's upload function
    const result = await uploadDocument({
      ...data,
      file: files[0],
    });

    console.log("Upload result:", result);

    // Reset form and files on success
    if (result.success) {
      form.reset();
      setFiles([]);
      setShowAdvanced(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* ================= BASIC INFORMATION FORM ================= */}
      <div className="bg-background rounded-2xl border border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Basic Information
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Framework Key & Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="frameworkKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Framework Key <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="react"
                        className="bg-grey border-border"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Lowercase, no spaces
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="frameworkName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Framework Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="React"
                        className="bg-grey border-border"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Version & Official Docs URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Version <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="18.2.0"
                        className="bg-grey border-border"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="officialDocsUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Official Docs URL <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://react.dev"
                        className="bg-grey border-border"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* File Handling Section */}
            <div className="pt-4 border-t border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                File Handling
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fileExtensions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        File Extensions <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder=".md, .mdx"
                          className="bg-grey border-border"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Comma-separated
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subdirectory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subdirectory (optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="docs/content"
                          className="bg-grey border-border"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-primary hover:underline text-sm font-medium"
              >
                <svg
                  className={`w-4 h-4 transition-transform ${
                    showAdvanced ? "rotate-90" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                Advanced Settings
              </button>

              {showAdvanced && (
                <div className="mt-4 space-y-4">
                  <FormField
                    control={form.control}
                    name="removePatterns"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Remove Patterns (one per line)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="^---[\s\S]*?---$"
                            className="bg-grey border-border min-h-[100px]"
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Regex patterns to remove from content
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cleanWhitespace"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="w-4 h-4 accent-primary"
                          />
                        </FormControl>
                        <FormLabel className="!mt-0 cursor-pointer">
                          Clean excessive whitespace
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="targetTokensPerChunk"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Tokens per Chunk</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              placeholder="800"
                              className="bg-grey border-border"
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxTokensPerChunk"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Tokens per Chunk</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              placeholder="4000"
                              className="bg-grey border-border"
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Upload Documents Section */}
            <div className="pt-4 border-t border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Upload Documents <span className="text-red-500">*</span>
              </h3>

              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center mb-4">
                <Upload className="w-10 h-10 text-foreground/40 mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-foreground mb-1">
                  Upload ZIP File
                </h4>
                <p className="text-xs text-foreground/60 mb-4">
                  Only .zip files are accepted (one file at a time)
                </p>

                <input
                  type="file"
                  accept=".zip"
                  id="doc-upload"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="doc-upload"
                  className="inline-block bg-primary text-white px-5 py-2 rounded-lg cursor-pointer hover:bg-primary/90 transition-colors text-sm"
                >
                  Choose ZIP File
                </label>
              </div>

              {files.length > 0 && (
                <div className="space-y-3">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-grey rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <File className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium">{file.name}</span>
                        <span className="text-xs text-foreground/40">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-1 hover:bg-background rounded transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={uploading}
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                "Upload Framework"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}