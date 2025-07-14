import React from "react";
import { Property } from "../../types/index";
import { useMessage } from "../../components/MessageBox";
import Image from "next/image";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedImages: string[];
  currentImageIndex: number;
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedPropertyId: number | null;
  setSelectedImages: React.Dispatch<React.SetStateAction<string[]>>;
  properties: Property[];
  selectedFile: File | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  isUploading: boolean;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
}
const { showMessage } = useMessage();
const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  selectedImages,
  currentImageIndex,
  setCurrentImageIndex,
  selectedPropertyId,
  setSelectedImages,
  properties,
  selectedFile,
  setSelectedFile,
  isUploading,
  setIsUploading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-container" onClick={onClose}>
      <div className="modal-content-image" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold mb-4">Property Images</h2>

        <button onClick={onClose} className="modal-close-btn" aria-label="Close">
          &times;
        </button>

        {selectedImages.length > 0 ? (
          <div className="text-center">
            <Image
              src={selectedImages[currentImageIndex]}
              alt={`Property image ${currentImageIndex + 1}`}
              width={0}
              height={0}
              sizes="100vw"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "60vh",
                objectFit: "cover",
                borderRadius: "0.5rem",
                border: "1px solid #ccc",
                margin: "0 auto",
                display: "block",
              }}
            />

            <div className="pagination-controls">
              <button
                disabled={currentImageIndex === 0}
                onClick={() => setCurrentImageIndex((prev) => prev - 1)}
                className="pagination-btn"
              >
                Previous
              </button>
              <button
                disabled={currentImageIndex === selectedImages.length - 1}
                onClick={() => setCurrentImageIndex((prev) => prev + 1)}
                className="pagination-btn"
              >
                Next
              </button>
              <button
                onClick={() => {
                  const updatedImages = [...selectedImages];
                  updatedImages.splice(currentImageIndex, 1);

                  setSelectedImages(updatedImages);
                  setCurrentImageIndex((prev) =>
                    prev >= updatedImages.length ? updatedImages.length - 1 : prev
                  );

                  fetch("/api/properties", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      ...properties.find((p) => p.id === selectedPropertyId),
                      images: updatedImages,
                    }),
                  });
                }}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center">No images available</p>
        )}

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-700">Add Image from Computer</p>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setSelectedFile(file);
              }
            }}
            className="border border-gray-300 rounded px-4 py-2"
          />

          <div className="mt-2 text-sm text-gray-500">
            Supported formats: JPG, PNG, WebP
          </div>
          <button
            className="button-save"
            style={{ marginTop: "10px" }}
            disabled={!selectedFile || isUploading}
            onClick={async () => {
              if (!selectedFile || !selectedPropertyId) {
                showMessage("Please choose a file.");
                return;
              }

              setIsUploading(true);

              try {
                const formData = new FormData();
                formData.append("file", selectedFile);
                formData.append("propertyId", selectedPropertyId.toString());

                const res = await fetch("/api/upload-image", {
                  method: "POST",
                  body: formData,
                });

                if (!res.ok) {
                  const error = await res.json();
                  showMessage("Upload failed: " + error.message);
                  return;
                }

                const { newImagePath } = await res.json();

                if (newImagePath) {
                  const updatedProperty = {
                    ...properties.find((p) => p.id === selectedPropertyId),
                    images: [...selectedImages, newImagePath],
                  };

                  await fetch("/api/properties", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedProperty),
                  });

                  setSelectedImages((prev) => [...prev, newImagePath]);
                  showMessage("Image uploaded successfully!");
                  setSelectedFile(null);
                }
              } catch (err) {
                console.error("Upload error:", err);
                showMessage("Something went wrong.");
              } finally {
                setIsUploading(false);
              }
            }}
          >
            {isUploading ? "Uploading..." : "Add Image"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;