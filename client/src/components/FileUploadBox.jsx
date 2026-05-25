import { useRef, useState } from "react";

function FileUploadBox({
  label,
  accept,
  hint,
  currentFileName,
  onUpload,
  uploading,
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedName, setSelectedName] = useState("");

  const handleFile = async (file) => {
    if (!file) return;
    setSelectedName(file.name);
    await onUpload(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
          dragOver
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {uploading ? (
          <p className="text-blue-600 text-sm">Uploading...</p>
        ) : (
          <>
            <p className="text-gray-700 font-medium">
              Click or drag file here
            </p>
            <p className="text-xs text-gray-500 mt-1">{hint}</p>
            {(selectedName || currentFileName) && (
              <p className="text-sm text-green-600 mt-2">
                {selectedName || currentFileName}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default FileUploadBox;
