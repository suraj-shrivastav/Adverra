import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import PlatformSelector from './PlatformSelector';
import ReferenceUploader from './ReferenceUploader';
import VisualToneGrid from './VisualToneGrid';
import AspectRatioSelector from './AspectRatioSelector';
import PremiumInput from './PremiumInput';
import PremiumSelect from './PremiumSelect';

const GenerationControls = ({
    formData,
    setFormData,
    visualTones,
    isLoadingData,
    isGenerating,
    handlers
}) => {

    // Helper to update nested state
    const updateNested = (category, field, value) => {
        setFormData({
            [category]: {
                [field]: value
            }
        });
    };

    return (
        <div className="flex-1 flex flex-col relative h-full bg-black/40">
            <div className="flex-1 overflow-y-auto p-6 pb-32 scrollbar-hide space-y-8">

                {/* 1. Platform & Aspect Ratio */}
                <div className="grid grid-cols-2 gap-4 items-start">
                    <PlatformSelector
                        platform={formData.platform}
                        setPlatform={(val) => setFormData({ platform: val })}
                    />
                    <AspectRatioSelector
                        value={formData.aspectRatio}
                        onChange={(val) => setFormData({ aspectRatio: val })}
                    />
                </div>

                <hr className="border-white/10" />

                {/* 2. Strategy: Campaign Objective & Target Audience */}
                <div className="grid grid-cols-2 gap-6 items-start">

                    {/* Campaign Objective */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Campaign Objective</h3>
                        <PremiumSelect
                            label="Objective"
                            value={formData.objective}
                            onChange={(val) => setFormData({ objective: val })}
                            options={[
                                { value: "Brand Awareness", label: "Brand Awareness" },
                                { value: "Conversion", label: "Conversion" },
                                { value: "Engagement", label: "Engagement" },
                            ]}
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <PremiumSelect
                                label="Content Type"
                                value={formData.contentType}
                                onChange={(val) => setFormData({ contentType: val })}
                                options={[
                                    { value: "Product Photography", label: "Product Photo" },
                                    { value: "Lifestyle Illustration", label: "Lifestyle" },
                                    { value: "Infographic", label: "Infographic" },
                                    { value: "Abstract Art", label: "Abstract" },
                                ]}
                            />
                            <PremiumSelect
                                label="Emotion"
                                value={formData.emotion}
                                onChange={(val) => setFormData({ emotion: val })}
                                options={[
                                    { value: "Sophisticated", label: "Sophisticated" },
                                    { value: "Playful", label: "Playful" },
                                    { value: "Urgent", label: "Urgent" },
                                    { value: "Trustworthy", label: "Trustworthy" },
                                ]}
                            />
                        </div>
                    </div>

                    {/* Target Audience */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Target Audience</h3>
                        <div className="space-y-4">
                            <PremiumInput
                                label="Age Range"
                                placeholder="e.g. 18-24"
                                value={formData.audience?.ageRange || ""}
                                onChange={(val) => updateNested('audience', 'ageRange', val)}
                            />
                            <PremiumInput
                                label="Mindset"
                                placeholder="e.g. Tech-savvy"
                                value={formData.audience?.mindset || ""}
                                onChange={(val) => updateNested('audience', 'mindset', val)}
                            />
                        </div>
                    </div>
                </div>

                <hr className="border-white/10" />

                {/* 3. References & Message */}
                <div className="grid grid-cols-2 gap-6 items-start">

                    {/* References & Assets */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">References & Assets</h3>
                        <ReferenceUploader
                            uploadedImages={formData.uploadedImages}
                            onUpload={handlers.onImageUpload}
                            onRemove={handlers.onImageRemove}
                            logoUsage={formData.logoUsage}
                            onLogoUsageChange={(val) => setFormData({ logoUsage: val })}
                        />
                    </div>

                    {/* Message & Copy */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Message & Copy</h3>
                        <PremiumInput
                            label="Headline"
                            placeholder="Main headline text..."
                            value={formData.message?.headline || ""}
                            onChange={(val) => updateNested('message', 'headline', val)}
                        />
                        <PremiumInput
                            label="Supporting Text"
                            placeholder="Additional details..."
                            value={formData.message?.supportingText || ""}
                            onChange={(val) => updateNested('message', 'supportingText', val)}
                        />
                    </div>
                </div>

                <hr className="border-white/10" />

                {/* 4. Additional Prompt */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Additional Prompt</h3>
                    <textarea
                        className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-white/30 
                                   rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 
                                   outline-none transition-all shadow-inner focus:bg-white/10 h-24 resize-none"
                        placeholder="Any extra instructions for the AI..."
                        value={formData.additionalPrompt || ""}
                        onChange={(e) => setFormData({ additionalPrompt: e.target.value })}
                    />
                </div>

                <hr className="border-white/10" />

                {/* 5. Visual Framework */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Visual Framework</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <PremiumSelect
                            label="Layout"
                            value={formData.visualStyle?.layout}
                            onChange={(val) => updateNested('visualStyle', 'layout', val)}
                            options={[
                                { value: "Minimal", label: "Minimal" },
                                { value: "Editorial", label: "Editorial" },
                                { value: "Infographic", label: "Infographic" },
                                { value: "Cinematic", label: "Cinematic" },
                            ]}
                        />
                        <PremiumSelect
                            label="Brand Expression"
                            value={formData.visualStyle?.brandExpression}
                            onChange={(val) => updateNested('visualStyle', 'brandExpression', val)}
                            options={[
                                { value: "Subtle", label: "Subtle" },
                                { value: "Balanced", label: "Balanced" },
                                { value: "Bold", label: "Bold" },
                            ]}
                        />
                    </div>

                    <VisualToneGrid
                        tones={visualTones}
                        selectedToneId={formData.visualStyle?.toneId}
                        onSelect={(id) => updateNested('visualStyle', 'toneId', id)}
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