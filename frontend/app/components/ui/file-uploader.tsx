// "use client";

// import { Loader2, Paperclip } from "lucide-react";
// import { ChangeEvent, useState } from "react";
// import { buttonVariants } from "./button";
// import { cn } from "./lib/utils";

// export interface FileUploaderProps {
//   config?: {
//     inputId?: string;
//     fileSizeLimit?: number;
//     allowedExtensions?: string[];
//     checkExtension?: (extension: string) => string | null;
//     disabled: boolean;
//   };
//   onFileUpload: (file: File) => Promise<void>;
//   onFileError?: (errMsg: string) => void;
// }

// const DEFAULT_INPUT_ID = "fileInput";
// const DEFAULT_FILE_SIZE_LIMIT = 1024 * 1024 * 50; // 50 MB

// export default function FileUploader({
//   config,
//   onFileUpload,
//   onFileError,
// }: FileUploaderProps) {
//   const [uploading, setUploading] = useState(false);

//   const inputId = config?.inputId || DEFAULT_INPUT_ID;
//   const fileSizeLimit = config?.fileSizeLimit || DEFAULT_FILE_SIZE_LIMIT;
//   const allowedExtensions = config?.allowedExtensions;
//   const defaultCheckExtension = (extension: string) => {
//     if (allowedExtensions && !allowedExtensions.includes(extension)) {
//       return `Invalid file type. Please select a file with one of these formats: ${allowedExtensions!.join(
//         ",",
//       )}`;
//     }
//     return null;
//   };
//   const checkExtension = config?.checkExtension ?? defaultCheckExtension;

//   const isFileSizeExceeded = (file: File) => {
//     return file.size > fileSizeLimit;
//   };

//   const resetInput = () => {
//     const fileInput = document.getElementById(inputId) as HTMLInputElement;
//     fileInput.value = "";
//   };

//   const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setUploading(true);
//     await handleUpload(file);
//     resetInput();
//     setUploading(false);
//   };

//   const handleUpload = async (file: File) => {
//     const onFileUploadError = onFileError || window.alert;
//     const fileExtension = file.name.split(".").pop() || "";
//     const extensionFileError = checkExtension(fileExtension);
//     if (extensionFileError) {
//       return onFileUploadError(extensionFileError);
//     }

//     if (isFileSizeExceeded(file)) {
//       return onFileUploadError(
//         `File size exceeded. Limit is ${fileSizeLimit / 1024 / 1024} MB`,
//       );
//     }

//     await onFileUpload(file);
//   };

//   return (
//     <div className="self-stretch">
//       <input
//         type="file"
//         id={inputId}
//         style={{ display: "none" }}
//         onChange={onFileChange}
//         accept={allowedExtensions?.join(",")}
//         disabled={config?.disabled || uploading}
//       />
//       <label
//         htmlFor={inputId}
//         className={cn(
//           buttonVariants({ variant: "secondary", size: "icon" }),
//           "cursor-pointer",
//           uploading && "opacity-50",
//         )}
//       >
//         {uploading ? (
//           <Loader2 className="h-4 w-4 animate-spin" />
//         ) : (
//           <Paperclip className="-rotate-45 w-4 h-4" />
//         )}
//       </label>
//     </div>
//   );
// }


"use client";

import React, { useState, ChangeEvent } from "react";
import { Loader2, Paperclip } from "lucide-react";
import { cn } from "./lib/utils";


export interface FileUploaderProps {
  config?: {
    inputId?: string;
    fileSizeLimit?: number;
    allowedExtensions?: string[];
    checkExtension?: (extension: string) => string | null;
    disabled: boolean;
  };
  onFileUpload: (file: File) => Promise<void>; // Add this
  onFileError?: (errMsg: string) => void;
}

const DEFAULT_INPUT_ID = "fileInput";
const DEFAULT_FILE_SIZE_LIMIT = 1024 * 1024 * 50; // 50 MB

// Access the environment variable
const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_CHAT_API;

export default function FileUploader({
  config,
  onFileError,
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const inputId = config?.inputId || DEFAULT_INPUT_ID;
  const fileSizeLimit = config?.fileSizeLimit || DEFAULT_FILE_SIZE_LIMIT;
  const allowedExtensions = config?.allowedExtensions;
  const defaultCheckExtension = (extension: string) => {
    if (allowedExtensions && !allowedExtensions.includes(extension)) {
      return `Invalid file type. Allowed formats: ${allowedExtensions.join(", ")}`;
    }
    return null;
  };
  const checkExtension = config?.checkExtension ?? defaultCheckExtension;

  const resetInput = () => {
    const fileInput = document.getElementById(inputId) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("Selected file:", file);
    setUploading(true);
    await handleUpload(file);
    resetInput();
    setUploading(false);
  };

  const handleUpload = async (file: File) => {
    const onFileUploadError = onFileError || window.alert;

    // Check for extension validity
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
    const extensionError = checkExtension(fileExtension);
    if (extensionError) {
      return onFileUploadError(extensionError);
    }

    // Check for file size limit
    if (file.size > fileSizeLimit) {
      return onFileUploadError(`File size exceeded. Limit: ${fileSizeLimit / 1024 / 1024} MB`);
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      if (!uploadUrl) {
        throw new Error("Upload URL is not configured.");
      }

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Upload successful:", result);
    } catch (error: any) {
      console.error("Upload error:", error);
      onFileUploadError(error.message || "An unknown error occurred.");
    }
  };

  return (
    <div className="self-stretch">
      <input
        type="file"
        id={inputId}
        style={{ display: "none" }}
        onChange={onFileChange}
        accept={allowedExtensions?.map((ext) => `.${ext}`).join(",")}
        disabled={config?.disabled || uploading}
      />
      <label
        htmlFor={inputId}
        className={cn(
          "flex items-center justify-center h-10 w-10 rounded-md bg-secondary text-white cursor-pointer",
          uploading && "opacity-50 cursor-not-allowed"
        )}
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Paperclip className="-rotate-45 w-4 h-4" />
        )}
      </label>
    </div>
  );
}
