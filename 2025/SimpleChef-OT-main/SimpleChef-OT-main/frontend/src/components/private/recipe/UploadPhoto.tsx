import { useState, useCallback } from "react";

interface Photo {
  name: string;
  url: string;
  file: File;
}
interface UploadPhotoProps {
  initialImage?: string;
  onPhotoSelected: (file: File) => void;
  onPhotoRemoved: () => void;
}

export default function UploadPhoto({
  initialImage,
  onPhotoSelected,
  onPhotoRemoved,
}: UploadPhotoProps) {
   const [photo, setPhoto] = useState<Photo | null>(
    initialImage ? { name: "Existing Image", url: initialImage, file: new File([], '') } : null
  );
  const [isDragging, setIsDragging] = useState(false);
  const MAX_SIZE_MB = 3;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  
  const handleFiles = useCallback(
    (files: FileList) => {
      const file = files[0];
      if (!file) return;

      const newPhoto: Photo = {
        name: file.name,
        url: URL.createObjectURL(file),
        file,
      };
      setPhoto(newPhoto);
      onPhotoSelected(file);
    },
    [onPhotoSelected]
  );
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (!ValidatePhoto(file)) return;
      handleFiles(e.dataTransfer.files);
    }
  };

  function ValidatePhoto(file: File) {
    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed!");
      return false;
    }
    if (file.size > MAX_SIZE_BYTES) {
      alert(`File is too large! Maximum allowed size is ${MAX_SIZE_MB} MB.`);
      return false;
    }
    return true;
  }
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;
    if (!ValidatePhoto(file)) return;
    handleFiles(e.target.files);
  };
  const removePhoto = () => {
    setPhoto(null);
    onPhotoRemoved();
  };
  return (
    <div className="py-4">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`border-4 border-dashed rounded-xl p-10 text-center transition ${
          isDragging ? "bg-base-300" : "bg-base-200"
        }`}
      >
        {photo ? (
          <div className="flex flex-col items-center gap-2">
            <img
              src={photo.url}
              alt={photo.name}
              className="w-48 rounded-lg shadow"
            />
            <button
              type="button"
              className="btn btn-error btn-sm"
              onClick={removePhoto}
            >
              Remove
            </button>
          </div>
        ) : (
          <>
            <p className="mb-2">Drop your food photo here</p>
            <p className="mb-4">or</p>
            <input type="file" accept="image/*" onChange={onInputChange} />
          </>
        )}
      </div>
    </div>
  );
}
