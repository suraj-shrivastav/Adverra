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
        <div className="flex-1 flex flex-col relative h-full">
            <div className="flex-1 overflow-y-auto p-10 pb-32 scrollbar-hide">
                <div className="w-full space-y-8">
                    <div className="text-center space-y-3">
                        <h1 className="text-5xl font-bold text-white tracking-tight">
                            Image Generation Hub
                        </h1>
                    </div>

                    {/* Additional Context */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-widest pl-1">Additional Context</label>
                        <textarea
                            className="w-full h-32 bg-black/30 border border-white/10 rounded-[2rem] p-6 text-gray-200 placeholder-gray-700 hover:border-white/20 focus:border-white/30 outline-none transition-all resize-none shadow-inner"
                            placeholder="Describe specific details for the AI..."
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
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-widest pl-1">Target Audience</label>
                            <input
                                type="text"
                                className="w-full bg-black/30 border border-white/10 hover:border-white/20 focus:border-white/30 rounded-2xl px-6 py-4 text-sm text-white placeholder-gray-700 outline-none transition-all"
                                placeholder="e.g. GenZ, Business Professionals"
                                value={formData.targetAudience}
                                onChange={(e) => setFormData({ targetAudience: e.target.value })}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-widest pl-1">Text Overlay</label>
                            <input
                                type="text"
                                className="w-full bg-black/30 border border-white/10 hover:border-white/20 focus:border-white/30 rounded-2xl px-6 py-4 text-sm text-white placeholder-gray-700 outline-none transition-all"
                                placeholder="e.g. Join the Hub"
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
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gray-600 font-black font-space">Estimated Power</span>
                    <span className="text-white font-black text-xl tracking-tighter font-space">12 <span className="text-xs text-gray-500 font-medium">Credits</span></span>
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