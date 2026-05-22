/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from "react";
import { Upload } from "lucide-react";

interface UploadBlueprintsStepProps {
  data: {
    files: File[];
  };
  setData: React.Dispatch<React.SetStateAction<any>>;
}

const UploadBluePrint = ({ data, setData }: UploadBlueprintsStepProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf") {
      alert("Only PDF allowed");
      return;
    }

    setData((prev: any) => ({
      ...prev,
      files: [selectedFile],
    }));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  const file = data.files?.[0];

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Upload Blueprints</h2>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer ${
          isDragging ? "border-blue-600 bg-blue-50" : "border-gray-300 bg-gray-50"
        }`}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-500" />
        <p className="font-medium">Drop blueprint files here</p>
        <p className="text-sm text-gray-500">or click to browse</p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={(e) =>
            e.target.files && handleFileSelect(e.target.files[0])
          }
          className="hidden"
        />
      </div>

      {file && (
        <div className="mt-4 text-sm text-blue-600 font-medium truncate">
          {file.name}
        </div>
      )}
    </div>
  );
};

export default UploadBluePrint;
