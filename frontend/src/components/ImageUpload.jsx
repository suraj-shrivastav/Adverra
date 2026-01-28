import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a file first");
            return;
        }

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('http://localhost:3000/api/assets/upload-reference', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                console.log("Upload successful:", response.data.file);
                onUploadSuccess(response.data.file);
                setUploading(false);
            }
        } catch (err) {
            console.error("Upload error:", err);
            setError(err.response?.data?.message || "Failed to upload image");
            setUploading(false);
        }
    };

    return (
        <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl max-w-md w-full">
            <h3 className="text-xl font-semibold text-white mb-4">Upload Reference Image</h3>

            <div className="relative group cursor-pointer">
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept="image/*"
                />
                <div className={`
                    border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all
                    ${preview ? 'border-blue-400 bg-blue-400/10' : 'border-white/30 group-hover:border-white/50'}
                `}>
                    {preview ? (
                        <img src={preview} alt="Preview" className="max-h-48 rounded-lg object-contain" />
                    ) : (
                        <>
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
                                <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <p className="text-white/70 text-sm">Click or drag image to upload</p>
                        </>
                    )}
                </div>
            </div>

            {error && <p className="text-red-400 text-sm mt-3 text-center">{error}</p>}

            <button
                onClick={handleUpload}
                disabled={uploading || !file}
                className={`
                    mt-6 w-full py-3 rounded-xl font-medium transition-all
                    ${uploading || !file
                        ? 'bg-white/10 text-white/30 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 active:scale-95'}
                `}
            >
                {uploading ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                    </span>
                ) : 'Upload to Gemini Files'}
            </button>
        </div>
    );
};

export default ImageUpload;
