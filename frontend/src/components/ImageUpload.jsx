import React from "react";
import { useImageGenerationStore } from "../store/useImageGenerationStore.js";

const ImageUpload = () => {
    const { addUploadedImages, formData } = useImageGenerationStore();

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        addUploadedImages(files); // ✅ THIS was missing
        e.target.value = null;
    };

    return (
        <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl max-w-md w-full">
            <h3 className="text-xl font-semibold text-white mb-4">
                Upload Reference Image
            </h3>

            <div className="relative group cursor-pointer">
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all border-white/30 group-hover:border-white/50">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
                        <svg
                            className="w-6 h-6 text-white/70"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                    </div>
                    <p className="text-white/70 text-sm">
                        Click or drag image to upload
                    </p>
                </div>
            </div>

            {/* Optional preview */}
            {formData.uploadedImages.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                    {formData.uploadedImages.map((img) => (
                        <div key={img.id} className="relative">
                            <img
                                src={img.url}
                                alt={img.name}
                                className="rounded-lg object-cover h-24 w-full"
                            />
                            {img.isUploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-xs text-white">
                                    Uploading...
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
