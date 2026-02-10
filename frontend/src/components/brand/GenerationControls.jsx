import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import PlatformSelector from './PlatformSelector';
import ReferenceUploader from './ReferenceUploader';
import VisualToneGrid from './VisualToneGrid'; // See snippet below
import AspectRatioSelector from './AspectRatioSelector'; // Simple component extracting aspect ratio logic

const GenerationControls = ({
    formData,
    setFormData,
    visualTones,
    isLoadingData,
    isGenerating,
    handlers
}) => {

    return (
        <div className="flex-1 flex flex-col relative h-screen">
            <div className="flex-1 overflow-y-auto p-10 pb-32 custom-scrollbar">
                <div className="w-full space-y-8">
                    <div className="border-b border-gray-800 pb-4">
                        <h2 className="text-lg font-semibold text-white">Generation Controls</h2>
                    </div>

                    {/* Additional Context */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-300">Additional Context</label>
                        <textarea
                            className="w-full h-24 bg-[#111] border border-gray-800 rounded-2xl p-4 text-gray-200 placeholder-gray-600 focus:border-blue-600 outline-none transition-all resize-none"
                            placeholder="Describe specific details..."
                            value={formData.additionalContext}
                            onChange={(e) => setFormData({ additionalContext: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <PlatformSelector
                            platform={formData.platform}
                            setPlatform={(val) => setFormData({ platform: val })}
                        />
                        {/* Simple Aspect Ratio Button Group Logic can go here or be its own component */}
                        <AspectRatioSelector
                            value={formData.aspectRatio}
                            onChange={(val) => setFormData({ aspectRatio: val })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-300">Target Audience</label>
                            <input
                                type="text"
                                className="w-full bg-[#111] border border-gray-800 rounded-2xl px-4 py-3 text-gray-200 focus:border-blue-600 outline-none"
                                placeholder="e.g. GenZ"
                                value={formData.targetAudience}
                                onChange={(e) => setFormData({ targetAudience: e.target.value })}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-300">Text Overlay</label>
                            <input
                                type="text"
                                className="w-full bg-[#111] border border-gray-800 rounded-2xl px-4 py-3 text-gray-200 focus:border-blue-600 outline-none"
                                placeholder="e.g. Join the Beta"
                                value={formData.textOverlay}
                                onChange={(e) => setFormData({ textOverlay: e.target.value })}
                            />
                        </div>
                    </div>

                    <ReferenceUploader
                        uploadedImages={formData.uploadedImages}
                        onUpload={handlers.onImageUpload}
                        onRemove={handlers.onImageRemove}
                    />

                    <VisualToneGrid
                        tones={visualTones}
                        selectedToneId={formData.selectedToneId}
                        onSelect={(id) => setFormData({ selectedToneId: id })}
                        isLoading={isLoadingData}
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-black/90 backdrop-blur-xl border-t border-gray-900 flex justify-between items-center z-20">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Estimated Cost</span>
                    <span className="text-white font-medium">12 Credits</span>
                </div>
                <button
                    onClick={() => handlers.onGenerate(formData)}
                    disabled={isGenerating}
                    className={`flex items-center gap-2 bg-white hover:bg-gray-200 text-black px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-white/5 active:scale-95 ${isGenerating ? 'opacity-70 cursor-wait' : ''}`}
                >
                    {isGenerating ? (
                        <>
                            <Loader2 size={18} className="animate-spin text-black" />
                            <span>Generating...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles size={18} className="fill-black" />
                            <span>Generate Image</span>
                        </>
                    )}
                </button>

            </div>
        </div>
    );
};

export default GenerationControls;