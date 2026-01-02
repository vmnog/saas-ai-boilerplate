import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/cn";
import { getTruncatedFilename } from "@/utils/get-truncate-filename";
import { FileIcon, Loader } from "lucide-react";
import { RemoveUploadButton } from "./remove-upload-button";

interface UploadAttachmentsProps {
  selectedFiles: File[];
  uploadingFiles: { [key: string]: boolean };
  removeFile: (fileName: string) => void;
}

function formatFileSize(size: number): string {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let unitIndex = 0;
  let newSize = size;

  while (newSize >= 1024 && unitIndex < units.length - 1) {
    newSize /= 1024;
    unitIndex++;
  }

  return `${newSize.toFixed(2)} ${units[unitIndex]}`;
}

export function UploadAttachments({
  selectedFiles,
  uploadingFiles,
  removeFile,
}: UploadAttachmentsProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-t-xl bg-muted">
      <div className="flex gap-4">
        {selectedFiles.length > 0 && (
          <div className="p-4 rounded-t-xl flex gap-4">
            {selectedFiles.map((file) => {
              const isUploading = uploadingFiles[file.name];

              return (
                <div
                  key={file.name}
                  className={cn(
                    "flex items-center w-fit bg-background border p-1 pr-2 rounded-lg relative",
                    isUploading && "animate-pulse opacity-30",
                  )}
                >
                  {isUploading ? (
                    <div className="size-10 mr-2 flex items-center justify-center rounded-md bg-primary-foreground">
                      <Loader className="size-4 animate-spin text-primary" />
                    </div>
                  ) : file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="size-10 object-cover mr-2 rounded-md"
                    />
                  ) : (
                    <div className="size-10 mr-2 flex items-center justify-center rounded-md bg-primary-foreground">
                      <FileIcon className="size-5 text-primary" />
                    </div>
                  )}
                  <div className="flex-grow">
                    <p className="text-sm font-medium">
                      {getTruncatedFilename(file.name)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isUploading
                        ? "Carregando..."
                        : formatFileSize(file.size)}
                    </p>
                  </div>
                  {!isUploading && (
                    <RemoveUploadButton file={file} removeFile={removeFile} />
                  )}
                </div>
              );
            })}
          </div>
        )}
        <ScrollBar orientation="horizontal" />
      </div>
    </ScrollArea>
  );
}
