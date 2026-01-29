import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react";

/**
 * ImageUploadSection - Reusable image upload component
 * Features:
 * - Drag & drop support
 * - File preview with thumbnails
 * - Max 4 images (configurable)
 * - File validation (type & size)
 * - Remove before submit
 * - Existing images support (for edit mode)
 */
const ImageUploadSection = ({
  onImagesChange,
  maxImages = 4,
  maxFileSize = 5, // MB
  existingImages = []
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

  // Validate file
  const validateFile = (file) => {
    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Invalid file type. Only JPG, PNG, and WebP are allowed.`;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      return `File size exceeds ${maxFileSize}MB limit.`;
    }

    return null;
  };

  // Handle file selection (input or drag-drop)
  const handleFiles = (files) => {
    setError(null);

    // Check total image count
    const totalImages = selectedFiles.length + existingImages.length + files.length;
    if (totalImages > maxImages) {
      setError(
        `Maximum ${maxImages} images allowed. You can add ${maxImages - selectedFiles.length - existingImages.length} more.`
      );
      return;
    }

    const validFiles = [];
    const newPreviews = [];

    for (const file of files) {
      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        continue;
      }

      validFiles.push(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push({
          id: `${file.name}-${Date.now()}`,
          src: reader.result,
          name: file.name,
          file: file
        });

        // If all files are read, update state
        if (newPreviews.length === validFiles.length) {
          setSelectedFiles((prev) => [...prev, ...validFiles]);
          setPreviews((prev) => [...prev, ...newPreviews]);
          onImagesChange([...selectedFiles, ...validFiles]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle click on upload area
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file input change
  const handleInputChange = (e) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  // Handle drag over
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files || []);
    handleFiles(files);
  };

  // Remove selected image
  const removeImage = (id) => {
    const updatedPreviews = previews.filter((p) => p.id !== id);
    const updatedFiles = selectedFiles.filter((_, idx) => {
      return previews[idx]?.id !== id;
    });

    setPreviews(updatedPreviews);
    setSelectedFiles(updatedFiles);
    onImagesChange(updatedFiles);
    setError(null);
  };

  const canAddMore = selectedFiles.length + existingImages.length < maxImages;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Images <span className="text-gray-500 font-normal">({selectedFiles.length + existingImages.length}/{maxImages})</span>
        </label>
        <p className="text-sm text-gray-600">
          Add up to {maxImages} high-quality photos of your work. Supports JPG, PNG, WebP (max 5MB each).
        </p>
      </div>

      {/* Upload Area - Only show if can add more */}
      {canAddMore && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? "border-green-500 bg-green-50"
              : "border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ALLOWED_EXTENSIONS.map((ext) => `.${ext}`).join(",")}
            onChange={handleInputChange}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-3">
            <div className={`p-3 rounded-full ${dragActive ? "bg-green-100" : "bg-gray-200"}`}>
              <Upload className={`w-6 h-6 ${dragActive ? "text-green-600" : "text-gray-600"}`} />
            </div>
            <div>
              <p className={`font-medium ${dragActive ? "text-green-700" : "text-gray-700"}`}>
                {dragActive ? "Drop images here" : "Drag & drop images"}
              </p>
              <p className="text-sm text-gray-500 mt-1">or click to browse</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Preview Grid */}
      {(previews.length > 0 || existingImages.length > 0) && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">
            {existingImages.length > 0 && `${existingImages.length} existing image(s)`}
            {existingImages.length > 0 && previews.length > 0 && " + "}
            {previews.length > 0 && `${previews.length} new image(s)`}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Existing Images */}
            {existingImages.map((image) => (
              <div
                key={image.publicId}
                className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group"
              >
                <img
                  src={image.url}
                  alt="Service"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-xs text-white font-medium bg-gray-800/60 px-2 py-1 rounded">
                    Existing
                  </span>
                </div>
              </div>
            ))}

            {/* New Selected Images */}
            {previews.map((preview) => (
              <div
                key={preview.id}
                className="relative aspect-square rounded-lg overflow-hidden border-2 border-green-200 bg-green-50 group"
              >
                <img
                  src={preview.src}
                  alt={preview.name}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(preview.id)}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-0 inset-x-0 bg-black/40 px-2 py-1">
                  <p className="text-xs text-white truncate">{preview.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {previews.length === 0 && existingImages.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">No images added yet</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploadSection;