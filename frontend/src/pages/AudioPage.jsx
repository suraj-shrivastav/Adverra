import { Mic, Users, Sliders, Package, Target, Clock, Volume2, Headphones, ChevronDown, Check, History, Calendar, Loader2, Sliders as SlidersIcon, Volume2 as VolumeIcon, Play as PlayIcon } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useDataStore } from "../store/useDataStore.js";
import { useWalkthrough } from "../context/WalkthroughContext";
import { buildMockAudioScript, createWavBlobUrl, WALKTHROUGH_PRESETS } from "../libs/showcaseGenerators.js";
import HistoryModal from "../components/common/HistoryModal";
import WalkthroughTriggerButton from "../components/WalkthroughTriggerButton";
import AudioWaveformPlayer from "../components/AudioWaveformPlayer";
import PipelineInspector from "../components/PipelineInspector";

export default function AudioPage() {
    const [speakerMode, setSpeakerMode] = useState("Single Speaker");
    const { audios, addAudio } = useDataStore();
    const { isActive, mode, stepIndex } = useWalkthrough();
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
    const [activeVariantId, setActiveVariantId] = useState("multi");
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasAnyData, setHasAnyData] = useState(false);
    const [syncedFields, setSyncedFields] = useState({});
    const formRef = useRef(null);
    const addedWalkthroughAudioRef = useRef(false);
    const wasWalkthroughAudioRef = useRef(false);

    useEffect(() => {
        if (selectedHistoryItem?.compareVariants?.length) {
            setActiveVariantId(selectedHistoryItem.compareVariants[0].id);
        } else {
            setActiveVariantId("multi");
        }
    }, [selectedHistoryItem]);

    useEffect(() => {
        if (!isActive || mode !== "audio") {
            if (wasWalkthroughAudioRef.current) {
                wasWalkthroughAudioRef.current = false;
                setIsGenerating(false);
            }
            return;
        }

        wasWalkthroughAudioRef.current = true;
        const fields = WALKTHROUGH_PRESETS.audio.fields;

        const applyDomInputs = (names) => {
            if (!formRef.current) return;
            for (const key of names) {
                const el = formRef.current.elements.namedItem(key);
                if (el && "value" in el && fields[key] !== undefined) {
                    el.value = fields[key];
                }
            }
        };

        const baseInputKeys = [
            "productName",
            "productCategory",
            "primaryBenefit",
            "secondaryBenefit",
            "proofPoint",
            "additionalProductDetails",
            "targetAudienceRole",
            "primaryPainPoint",
            "scriptDuration",
        ];

        const speakerInputKeys = [
            "speaker1Name",
            "speaker1Tone",
            "speaker2Name",
            "speaker2Tone",
        ];

        if (stepIndex === 0) {
            addedWalkthroughAudioRef.current = false;
            setSpeakerMode("Single Speaker");
            setSyncedFields({
                listeningEnvironment: fields.listeningEnvironment,
                campaignGoal: fields.campaignGoal,
                formality: "50",
                energy: "50",
                emotion: "50",
                humor: "50",
                authority: "50",
            });
            applyDomInputs(baseInputKeys);
            setHasAnyData(true);
            setIsGenerating(false);
            setShowHistoryModal(false);
            setSelectedHistoryItem(null);
        } else if (stepIndex === 1) {
            setSpeakerMode(fields.speakerMode);
            setSyncedFields({
                listeningEnvironment: fields.listeningEnvironment,
                campaignGoal: fields.campaignGoal,
                speaker1Voice: fields.speaker1Voice,
                speaker1Role: fields.speaker1Role,
                speaker2Voice: fields.speaker2Voice,
                speaker2Role: fields.speaker2Role,
                formality: fields.formality,
                energy: fields.energy,
                emotion: fields.emotion,
                humor: fields.humor,
                authority: fields.authority,
            });
            applyDomInputs(baseInputKeys);
            window.requestAnimationFrame(() => applyDomInputs(speakerInputKeys));
            setHasAnyData(true);
            setIsGenerating(false);
            setShowHistoryModal(false);
        } else if (stepIndex === 2) {
            setSpeakerMode(fields.speakerMode);
            setSyncedFields({
                listeningEnvironment: fields.listeningEnvironment,
                campaignGoal: fields.campaignGoal,
                speaker1Voice: fields.speaker1Voice,
                speaker1Role: fields.speaker1Role,
                speaker2Voice: fields.speaker2Voice,
                speaker2Role: fields.speaker2Role,
                formality: fields.formality,
                energy: fields.energy,
                emotion: fields.emotion,
                humor: fields.humor,
                authority: fields.authority,
            });
            applyDomInputs(baseInputKeys);
            window.requestAnimationFrame(() => applyDomInputs(speakerInputKeys));
            setHasAnyData(true);
            setIsGenerating(true);
            setShowHistoryModal(false);
        } else if (stepIndex === 3) {
            setIsGenerating(false);
            const demoAudio = {
                id: 999301,
                created_at: new Date().toISOString(),
                ...WALKTHROUGH_PRESETS.audio.outputAudio,
            };
            if (!addedWalkthroughAudioRef.current) {
                const exists = useDataStore
                    .getState()
                    .audios.some((a) => a.id === 999301);
                if (!exists) {
                    addAudio(demoAudio);
                }
                addedWalkthroughAudioRef.current = true;
            }
            setSelectedHistoryItem(demoAudio);
            setShowHistoryModal(true);
        }
    }, [isActive, mode, stepIndex, addAudio]);

    const checkFormContent = (e) => {
        const form = e.currentTarget.closest('form');
        if (form) {
            const formData = new FormData(form);
            const hasValue = Array.from(formData.values()).some(value =>
                typeof value === 'string' && value.trim() !== ""
            );
            setHasAnyData(hasValue);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsGenerating(true);
        const formData = new FormData(e.target);
        formData.append('speakerMode', speakerMode);
        const formValues = Object.fromEntries(formData.entries());

        try {
            await new Promise((resolve) => setTimeout(resolve, 1100));
            const script = buildMockAudioScript(formValues);
            const duration = Math.min(8, Math.max(4, Number(formValues.scriptDuration || 5) * 0.35));
            const publicUrl = createWavBlobUrl(duration, speakerMode === "Multi Speaker" ? 261.63 : 220);

            const result = {
                id: Date.now(),
                filename: script.filename,
                publicUrl,
                script,
                context: formValues,
                created_at: new Date().toISOString(),
            };

            addAudio(result);
            setSelectedHistoryItem(result);
            setShowHistoryModal(true);
        } catch (error) {
            console.error('Audio showcase error:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="h-full bg-black text-gray-200 overflow-hidden font-outfit relative flex">
            {/* Main Content */}
            <div className="flex-1 h-full relative overflow-hidden">
                {/* Fancy Background Text Overlay */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none select-none opacity-[0.05] z-0 font-outfit">
                    <div className="absolute top-[5%] -left-20 -rotate-12 text-[120px] font-black tracking-tighter whitespace-nowrap">
                        VOICE → RESONANCE
                    </div>
                    <div className="absolute top-[25%] -right-40 rotate-6 text-[150px] font-black tracking-tighter whitespace-nowrap">
                        SOUND TO IMPACT
                    </div>
                    <div className="absolute bottom-[15%] -left-20 -rotate-6 text-[130px] font-black tracking-tighter whitespace-nowrap">
                        FROM SCRIPT TO SPEECH
                    </div>
                    <Mic size={300} className="absolute -top-10 -right-20 rotate-12" />
                    <Headphones size={250} className="absolute top-[40%] -left-20 -rotate-12" />
                    <Volume2 size={200} className="absolute bottom-10 right-[10%] rotate-6" />
                </div>

                {/* Top Right Action Buttons */}
                <div className="absolute top-4 right-4 md:top-8 md:right-8 z-20 flex items-center gap-2">
                    <WalkthroughTriggerButton startMode="audio" variant="toolbar" />
                    <button
                        onClick={() => setShowHistoryModal(true)}
                        className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-black/60 border border-white/20 rounded-2xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-black/80 hover:border-white/30 transition-all"
                    >
                        <History size={16} />
                        <span className="hidden sm:inline">History</span>
                    </button>
                </div>

                <div className="h-full overflow-y-auto scrollbar-hide px-4 sm:px-6 py-8 md:py-10 relative z-10 flex flex-col items-center">
                    <form
                        ref={formRef}
                        onSubmit={handleSubmit}
                        onChange={checkFormContent}
                        className="max-w-6xl w-full space-y-8 md:space-y-10"
                    >

                        <div className="space-y-3 text-center">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
                                Audio Brand Voice
                            </h1>
                            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base px-4">
                                Configure your brand, speakers, and campaign context to generate
                                high-performing audio scripts for TTS.
                            </p>
                        </div>

                        {/* Featured Spoken Voice Ads Showcase */}
                        {audios.length > 0 && (
                            <Section title="Sample Voice Ads · Listen & Compare" icon={<Headphones size={20} />}>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {audios.slice(0, 3).map((sample) => (
                                        <button
                                            key={sample.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedHistoryItem(sample);
                                                setShowHistoryModal(true);
                                            }}
                                            className="p-4 rounded-2xl bg-black/50 border border-white/10 hover:border-white/30 hover:bg-white/[0.04] text-left transition-all flex items-center justify-between gap-3 group"
                                        >
                                            <div className="min-w-0 space-y-1">
                                                <div className="text-xs font-bold text-white truncate">
                                                    {sample.filename?.replace(/_/g, ' ')}
                                                </div>
                                                <div className="text-[11px] text-gray-400 truncate">
                                                    {sample.compareVariants?.length > 1
                                                        ? 'Compare Multi vs. Single Voice'
                                                        : `${sample.script?.mode || 'Voice Spot'} · Studio Audio`}
                                                </div>
                                            </div>
                                            <span className="w-8 h-8 rounded-xl bg-[#f4f4f0] text-zinc-950 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                                <PlayIcon size={13} className="fill-current" />
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </Section>
                        )}

                        {/* Product Details */}
                        <Section title="Product Details" icon={<Package size={20} />}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input name="productName" label="Product Name" placeholder="Atlas" required />
                                <Input name="productCategory" label="Product Category" placeholder="AI ad optimization platform" required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <Input name="primaryBenefit" label="Primary Benefit" placeholder="Turn ad spend into predictable growth" required />
                                <Input name="secondaryBenefit" label="Secondary Benefit" placeholder="Launch campaigns in minutes" />
                            </div>
                            <div className="mt-4">
                                <Input name="proofPoint" label="Proof Point" placeholder="Trusted by 10,000+ founders" />
                            </div>
                            <div className="mt-4">
                                <Textarea
                                    name="additionalProductDetails"
                                    label="Additional Product Details"
                                    placeholder="Key features, differentiators, use cases, or technical details that make your product unique..."
                                    rows={3}
                                />
                            </div>
                        </Section>

                        {/* Brand Tone & Speaker Configuration */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Section title="Brand Tone" icon={<Sliders size={20} />}>
                                <div className="grid grid-cols-5 gap-2 sm:gap-4">
                                    <VerticalSlider name="formality" label="FORMALITY" value={syncedFields.formality} onAnyChange={() => setHasAnyData(true)} />
                                    <VerticalSlider name="energy" label="ENERGY" value={syncedFields.energy} onAnyChange={() => setHasAnyData(true)} />
                                    <VerticalSlider name="emotion" label="EMOTION" value={syncedFields.emotion} onAnyChange={() => setHasAnyData(true)} />
                                    <VerticalSlider name="humor" label="HUMOR" value={syncedFields.humor} onAnyChange={() => setHasAnyData(true)} />
                                    <VerticalSlider name="authority" label="AUTHORITY" value={syncedFields.authority} onAnyChange={() => setHasAnyData(true)} />
                                </div>
                                <div className="mt-6 pt-6 border-t border-white/10 text-center">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed">
                                        Adjust these sliders to define your brand's unique audio personality.
                                    </p>
                                </div>
                            </Section>

                            <Section title="Speaker Configuration" icon={<Users size={20} />}>
                                <div className="space-y-4">
                                    <ModernSelect
                                        label="Speaker Mode"
                                        options={["Single Speaker", "Multi Speaker"]}
                                        value={speakerMode}
                                        onChange={setSpeakerMode}
                                        onAnyChange={() => setHasAnyData(true)}
                                    />

                                    {speakerMode === "Single Speaker" ? (
                                        <div className="space-y-4 bg-black/60 border border-white/10 rounded-2xl p-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <Input name="speakerName" label="Speaker Name" placeholder="Narrator" />
                                                <Input name="speakerTone" label="Voice Tone" placeholder="confident, warm" />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <ModernSelect
                                                    name="voice"
                                                    label="Voice"
                                                    onAnyChange={() => setHasAnyData(true)}
                                                    options={[
                                                        "Zephyr — Bright",
                                                        "Puck — Upbeat",
                                                        "Charon — Informative",
                                                        "Kore — Firm",
                                                        "Fenrir — Excitable",
                                                        "Leda — Youthful",
                                                        "Orus — Firm",
                                                        "Aoede — Breezy",
                                                        "Callirrhoe — Easy-going",
                                                        "Autonoe — Bright"
                                                    ]}
                                                />
                                                <ModernSelect
                                                    name="language"
                                                    label="Language"
                                                    onAnyChange={() => setHasAnyData(true)}
                                                    options={["English (US)", "English (UK)", "French", "German", "Spanish", "Japanese"]}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 overflow-y-auto max-h-[350px] pr-2 scrollbar-hide">
                                            <div className="bg-black/60 border border-white/10 rounded-2xl p-4 space-y-4">
                                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Speaker 1</div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <Input name="speaker1Name" label="Name" placeholder="Alex" />
                                                    <Input name="speaker1Tone" label="Voice Tone" placeholder="confident" />
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <ModernSelect name="speaker1Voice" label="Voice" value={syncedFields.speaker1Voice} options={["Zephyr — Bright", "Puck — Upbeat", "Charon — Informative", "Kore — Firm", "Fenrir — Excitable", "Leda — Youthful", "Orus — Firm", "Aoede — Breezy", "Callirrhoe — Easy-going", "Autonoe — Bright"]} onAnyChange={() => setHasAnyData(true)} />
                                                    <ModernSelect name="speaker1Language" label="Language" options={["English (US)", "English (UK)", "French"]} onAnyChange={() => setHasAnyData(true)} />
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <ModernSelect name="speaker1Role" label="Role" value={syncedFields.speaker1Role} options={["Host", "Expert", "Customer", "Narrator"]} onAnyChange={() => setHasAnyData(true)} />
                                                </div>
                                            </div>
                                            <div className="bg-black/60 border border-white/10 rounded-2xl p-4 space-y-4">
                                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Speaker 2</div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <Input name="speaker2Name" label="Name" placeholder="Jordan" />
                                                    <Input name="speaker2Tone" label="Voice Tone" placeholder="curious" />
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <ModernSelect name="speaker2Voice" label="Voice" value={syncedFields.speaker2Voice} options={["Zephyr — Bright", "Puck — Upbeat", "Charon — Informative", "Kore — Firm", "Fenrir — Excitable", "Leda — Youthful", "Orus — Firm", "Aoede — Breezy", "Callirrhoe — Easy-going", "Autonoe — Bright"]} onAnyChange={() => setHasAnyData(true)} />
                                                    <ModernSelect name="speaker2Language" label="Language" options={["English (US)", "English (UK)", "French"]} onAnyChange={() => setHasAnyData(true)} />
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <ModernSelect name="speaker2Role" label="Role" value={syncedFields.speaker2Role} options={["Host", "Expert", "Customer", "Narrator"]} onAnyChange={() => setHasAnyData(true)} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Section>
                        </div>

                        {/* Audience and Campaign Context */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Section title="Audience Context" icon={<Mic size={20} />}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Input name="targetAudienceRole" label="Audience Role" placeholder="Startup founder" required />
                                    <Input name="primaryPainPoint" label="Primary Pain Point" placeholder="High ad costs" required />
                                </div>
                                <div className="mt-4">
                                    <ModernSelect
                                        name="listeningEnvironment"
                                        label="Listening Environment"
                                        value={syncedFields.listeningEnvironment}
                                        onAnyChange={() => setHasAnyData(true)}
                                        options={["Social Feed", "Podcast", "Radio", "Smart Speaker"]}
                                    />
                                </div>
                            </Section>

                            <Section title="Campaign Settings" icon={<Target size={20} />}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <ModernSelect name="campaignGoal" label="Campaign Goal" value={syncedFields.campaignGoal} onAnyChange={() => setHasAnyData(true)} options={["Awareness", "Conversion"]} />
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                            <Clock size={12} /> Duration
                                        </label>
                                        <input
                                            name="scriptDuration"
                                            type="number"
                                            className="mt-2 w-full bg-black/60 border border-white/20 hover:border-white/30 focus:border-white/40 rounded-2xl px-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none transition-all"
                                            placeholder="15s"
                                            defaultValue={15}
                                        />
                                    </div>
                                </div>
                            </Section>
                        </div>

                        {/* Action Section */}
                        <div className="pt-6 pb-12 flex flex-col items-center gap-6">
                            <button
                                type="submit"
                                disabled={isGenerating || !hasAnyData}
                                className={`bg-white text-black px-8 md:px-12 py-3.5 md:py-4 rounded-2xl text-sm font-bold transition-all shadow-xl w-full sm:w-auto flex items-center justify-center gap-3
                                    ${(isGenerating || !hasAnyData)
                                        ? 'opacity-50 cursor-not-allowed grayscale'
                                        : 'hover:bg-gray-200 shadow-white/10 active:scale-95'
                                    }`}
                            >
                                {isGenerating && <Loader2 size={18} className="animate-spin text-black/60" />}
                                {isGenerating ? "Generating..." : "Generate Audio Script"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* History Modal */}
            <HistoryModal
                isOpen={showHistoryModal}
                onClose={() => {
                    setShowHistoryModal(false);
                    setSelectedHistoryItem(null);
                }}
                items={audios}
                onItemClick={(item) => setSelectedHistoryItem(item)}
                selectedItem={selectedHistoryItem}
                setSelectedItem={setSelectedHistoryItem}
                icon={<Mic size={20} />}
                title="Audio History"
                emptyMessage="No history yet.\nGenerate your first audio to get started."
                renderListItem={(item) => (
                    <button className="w-full bg-black/30 hover:bg-black/50 border border-white/5 hover:border-white/10 p-6 rounded-3xl text-left transition-all group flex items-center justify-between">
                        <div>
                            <h4 className="text-lg font-semibold text-gray-400 group-hover:text-white mb-2 transition-colors">
                                {item.filename || "Untitled Audio"}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Calendar size={12} />
                                {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                        </div>
                        <PlayIcon size={20} className="text-gray-600 group-hover:text-white transition-colors" />
                    </button>
                )}
                renderDetails={(item) => {
                    const variants = item.compareVariants || [];
                    const activeVariant =
                        variants.find((v) => v.id === activeVariantId) || variants[0] || null;
                    const displayScript = activeVariant?.script || item.script;
                    const displayUrl = activeVariant?.publicUrl || item.publicUrl;
                    const formattedScriptText = [
                        displayScript?.direction_line,
                        ...(displayScript?.script_lines || []).map(
                            (l) => `${l.speaker}: ${l.text}`
                        ),
                    ]
                        .filter(Boolean)
                        .join('\n');

                    return (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-white/5 border border-white/10"><SlidersIcon size={18} className="text-gray-400" /></div>
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            Script · {displayScript?.mode || 'Voice Spot'}
                                        </h3>
                                    </div>
                                    <div className="bg-black/40 border border-white/5 rounded-3xl p-6 space-y-4">
                                        <div className="text-[11px] text-gray-500 italic">Direction: {displayScript?.direction_line}</div>
                                        <div className="space-y-4">
                                            {displayScript?.script_lines?.map((line, idx) => (
                                                <div key={idx} className="space-y-1">
                                                    <span className="text-[10px] font-bold text-white/50 uppercase">{line.speaker}:</span>
                                                    <p className="text-sm text-gray-200 leading-relaxed font-medium">{line.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4 flex flex-col">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-white/5 border border-white/10"><VolumeIcon size={18} className="text-gray-400" /></div>
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Playback & Voice Comparison</h3>
                                    </div>
                                    <div className="bg-black/40 border border-white/5 rounded-3xl p-5 sm:p-6 flex-1 flex flex-col justify-center">
                                        <AudioWaveformPlayer
                                            src={displayUrl}
                                            filename={item.filename}
                                            title={item.filename?.replace(/_/g, ' ')}
                                            modeLabel={displayScript?.mode}
                                            variants={variants}
                                            activeVariantId={activeVariant?.id}
                                            onSelectVariant={(variant) => setActiveVariantId(variant.id)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <PipelineInspector
                                title="Pipeline & Engineered Prompt"
                                model="Gemini 3 Flash + TTS"
                                steps={[
                                    `Product Context (${item.context?.productName || 'Brand'})`,
                                    `Mode (${displayScript?.mode || 'Multi Speaker'})`,
                                    'Gemini 3 Flash Script Director',
                                    'Gemini 2.5 Flash TTS (24kHz WAV)',
                                ]}
                                promptPreview={formattedScriptText}
                            />
                        </div>
                    );
                }}
            />
        </div>
    );
}

function Section({ title, icon, children }) {
    return (
        <section className="bg-black/30 border border-white/15 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 space-y-6 backdrop-blur-sm hover:border-white/25 transition-all">
            <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white/10 text-white border border-white/20">{icon}</div>
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</h2>
            </div>
            {children}
        </section>
    );
}

function Input({ label, placeholder, required = false, name }) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}{required && <span className="text-gray-500 ml-1 opacity-50">*</span>}</label>
            <input type="text" name={name} placeholder={placeholder} required={required} className="w-full bg-black/60 border border-white/20 hover:border-white/30 focus:border-white/40 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none transition-all" />
        </div>
    );
}

function Textarea({ label, placeholder, rows = 3, required = false, name }) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}{required && <span className="text-gray-500 ml-1 opacity-50">*</span>}</label>
            <textarea name={name} placeholder={placeholder} required={required} rows={rows} className="w-full bg-black/60 border border-white/20 hover:border-white/30 focus:border-white/40 rounded-2xl p-4 text-sm text-white placeholder:text-gray-500 outline-none transition-all resize-none" />
        </div>
    );
}

function ModernSelect({ label, options, value, onChange, required = false, name, onAnyChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || options[0]);
    const buttonRef = useRef(null);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

    useEffect(() => {
        if (value !== undefined && value !== null && value !== "") {
            setSelectedValue(value);
        }
    }, [value]);

    const handleSelect = (option) => {
        setSelectedValue(option);
        if (onChange) onChange(option);
        if (onAnyChange) onAnyChange();
        setIsOpen(false);
    };

    const handleToggle = () => {
        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 8,
                left: rect.left,
                width: rect.width,
            });
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}{required && <span className="text-gray-500 ml-1 opacity-50">*</span>}</label>
            {name && <input type="hidden" name={name} value={selectedValue} />}
            <div className="relative">
                <button ref={buttonRef} type="button" onClick={handleToggle} className="w-full bg-black/60 border border-white/20 hover:border-white/30 focus:border-white/40 rounded-2xl px-4 py-3 text-sm text-white outline-none transition-all flex items-center justify-between group">
                    <span className={selectedValue ? "text-white" : "text-gray-500"}>{selectedValue || "Select..."}</span>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && createPortal(
                    <>
                        <div className="fixed inset-0 z-[9998]" onClick={() => setIsOpen(false)} />
                        <div
                            className="fixed z-[9999] bg-neutral-900 border border-white/30 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto scrollbar-hide"
                            style={{ top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width }}
                        >
                            {options.map((option, index) => (
                                <button key={option} type="button" onClick={() => handleSelect(option)} className={`w-full px-4 py-3 text-sm text-left transition-all flex items-center justify-between group ${selectedValue === option ? 'bg-white/15 text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'} ${index !== options.length - 1 ? 'border-b border-white/10' : ''}`}>
                                    <span>{option}</span>
                                    {selectedValue === option && <Check size={16} className="text-white" />}
                                </button>
                            ))}
                        </div>
                    </>,
                    document.body
                )}
            </div>
        </div>
    );
}

function VerticalSlider({ label, defaultValue = 50, value: externalValue, name, onAnyChange }) {
    const [value, setValue] = useState(externalValue ?? defaultValue);

    useEffect(() => {
        if (externalValue !== undefined && externalValue !== null) {
            setValue(externalValue);
        }
    }, [externalValue]);

    return (
        <div className="flex flex-col items-center gap-2 sm:gap-3">
            <div className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center h-8 flex items-end leading-tight">{label}</div>
            {name && <input type="hidden" name={name} value={value} />}
            <div className="relative h-24 sm:h-32 flex flex-col items-center group">
                <input type="range" min="0" max="100" value={value} onChange={(e) => { setValue(e.target.value); if (onAnyChange) onAnyChange(); }} className="vertical-slider h-full accent-white cursor-pointer opacity-70 group-hover:opacity-100 transition-opacity" style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical', width: '6px' }} />
            </div>
            <div className="text-xs font-outfit tabular-nums font-bold text-white bg-white/10 border border-white/20 px-2 py-1 rounded-lg min-w-[2.5rem] text-center">{value}</div>
        </div>
    );
}
