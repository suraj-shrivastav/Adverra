import { Mic, Users, Sliders, Package, Target, Clock, Globe, Volume2, Music, Headphones, Radio, Waves, ChevronDown, Check, Download, Play, X, History, Calendar, Loader2, Sliders as SlidersIcon, Volume2 as VolumeIcon, Download as DownloadIcon, Play as PlayIcon, Megaphone } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "../libs/api.js"
import { useDataStore } from "../store/useDataStore.js";
import HistoryModal from "../components/common/HistoryModal";

export default function AudioPage() {
    const [speakerMode, setSpeakerMode] = useState("Single Speaker");
    const { audios, getAllAudios } = useDataStore();
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasAnyData, setHasAnyData] = useState(false);

    useEffect(() => {
        getAllAudios();
    }, []);

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

        try {
            const result = await api.post("/audio", formData);
            if (result && result.id) {
                // Open result in modal
                setSelectedHistoryItem(result);
                setShowHistoryModal(true);
                getAllAudios(); // Refresh history list in background
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="h-full bg-black text-gray-200 overflow-hidden font-outfit relative flex">
            {/* Main Content */}
            <div className="flex-1 h-full relative overflow-hidden">
                {/* Fancy Background Text Overlay */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none select-none opacity-[0.05] z-0 font-space">
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

                {/* History Button */}
                <div className="absolute top-4 right-4 md:top-8 md:right-8 z-20">
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
                                    <VerticalSlider name="formality" label="FORMALITY" onAnyChange={() => setHasAnyData(true)} />
                                    <VerticalSlider name="energy" label="ENERGY" onAnyChange={() => setHasAnyData(true)} />
                                    <VerticalSlider name="emotion" label="EMOTION" onAnyChange={() => setHasAnyData(true)} />
                                    <VerticalSlider name="humor" label="HUMOR" onAnyChange={() => setHasAnyData(true)} />
                                    <VerticalSlider name="authority" label="AUTHORITY" onAnyChange={() => setHasAnyData(true)} />
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
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-black/60 border border-white/10 rounded-2xl p-4">
                                            <Input name="speakerName" label="Speaker Name" placeholder="Narrator" />
                                            <ModernSelect
                                                name="language"
                                                label="Language"
                                                onAnyChange={() => setHasAnyData(true)}
                                                options={["English (US)", "English (UK)", "French", "German", "Spanish", "Japanese"]}
                                            />
                                        </div>
                                    ) : (
                                        <div className="space-y-3 overflow-y-auto max-h-[350px] pr-2 scrollbar-hide">
                                            <div className="bg-black/60 border border-white/10 rounded-2xl p-4 space-y-4">
                                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Speaker 1</div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <Input name="speaker1Name" label="Name" placeholder="Alex" />
                                                    <Input name="speaker1Tone" label="Tone" placeholder="confident" />
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <ModernSelect name="speaker1Language" label="Language" options={["English (US)", "English (UK)", "French"]} onAnyChange={() => setHasAnyData(true)} />
                                                    <ModernSelect name="speaker1Role" label="Role" options={["Host", "Expert", "Customer", "Narrator"]} onAnyChange={() => setHasAnyData(true)} />
                                                </div>
                                            </div>
                                            <div className="bg-black/60 border border-white/10 rounded-2xl p-4 space-y-4">
                                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Speaker 2</div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <Input name="speaker2Name" label="Name" placeholder="Jordan" />
                                                    <Input name="speaker2Tone" label="Tone" placeholder="curious" />
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <ModernSelect name="speaker2Language" label="Language" options={["English (US)", "English (UK)", "French"]} onAnyChange={() => setHasAnyData(true)} />
                                                    <ModernSelect name="speaker2Role" label="Role" options={["Host", "Expert", "Customer", "Narrator"]} onAnyChange={() => setHasAnyData(true)} />
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
                                        onAnyChange={() => setHasAnyData(true)}
                                        options={["Social Feed", "Podcast", "Radio", "Smart Speaker"]}
                                    />
                                </div>
                            </Section>

                            <Section title="Campaign Settings" icon={<Target size={20} />}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <ModernSelect name="campaignGoal" label="Campaign Goal" onAnyChange={() => setHasAnyData(true)} options={["Awareness", "Conversion"]} />
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
                renderDetails={(item) => (
                    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-white/5 border border-white/10"><SlidersIcon size={18} className="text-gray-400" /></div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Script</h3>
                            </div>
                            <div className="bg-black/40 border border-white/5 rounded-3xl p-6 space-y-4">
                                <div className="text-[10px] text-gray-600 italic">Direction: {item.script?.direction_line}</div>
                                <div className="space-y-4">
                                    {item.script?.script_lines?.map((line, idx) => (
                                        <div key={idx} className="space-y-1">
                                            <span className="text-[10px] font-bold text-white/40 uppercase">{line.speaker}:</span>
                                            <p className="text-sm text-gray-300 leading-relaxed font-medium">{line.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6 flex flex-col">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-white/5 border border-white/10"><VolumeIcon size={18} className="text-gray-400" /></div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Playback</h3>
                            </div>
                            <div className="bg-black/40 border border-white/5 rounded-3xl p-8 flex-1 flex flex-col items-center justify-center space-y-8">
                                <audio controls className="w-full accent-white" src={item.publicUrl} />
                                <a href={item.publicUrl} download className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl text-sm font-bold w-full justify-center">
                                    <DownloadIcon size={18} /> Download Audio
                                </a>
                            </div>
                        </div>
                    </div>
                )}
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

    const handleSelect = (option) => {
        setSelectedValue(option);
        if (onChange) onChange(option);
        if (onAnyChange) onAnyChange();
        setIsOpen(false);
    };

    return (
        <div className="space-y-2 relative">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}{required && <span className="text-gray-500 ml-1 opacity-50">*</span>}</label>
            {name && <input type="hidden" name={name} value={selectedValue} />}
            <div className="relative">
                <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full bg-black/60 border border-white/20 hover:border-white/30 focus:border-white/40 rounded-2xl px-4 py-3 text-sm text-white outline-none transition-all flex items-center justify-between group">
                    <span className={selectedValue ? "text-white" : "text-gray-500"}>{selectedValue || "Select..."}</span>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                        <div className="absolute z-20 w-full mt-2 bg-neutral-900 border border-white/30 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto scrollbar-hide">
                            {options.map((option, index) => (
                                <button key={option} type="button" onClick={() => handleSelect(option)} className={`w-full px-4 py-3 text-sm text-left transition-all flex items-center justify-between group ${selectedValue === option ? 'bg-white/15 text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'} ${index !== options.length - 1 ? 'border-b border-white/10' : ''}`}>
                                    <span>{option}</span>
                                    {selectedValue === option && <Check size={16} className="text-white" />}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function VerticalSlider({ label, defaultValue = 50, name, onAnyChange }) {
    const [value, setValue] = useState(defaultValue);
    return (
        <div className="flex flex-col items-center gap-2 sm:gap-3">
            <div className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center h-8 flex items-end leading-tight">{label}</div>
            {name && <input type="hidden" name={name} value={value} />}
            <div className="relative h-24 sm:h-32 flex flex-col items-center group">
                <input type="range" min="0" max="100" value={value} onChange={(e) => { setValue(e.target.value); if (onAnyChange) onAnyChange(); }} className="vertical-slider h-full accent-white cursor-pointer opacity-70 group-hover:opacity-100 transition-opacity" style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical', width: '6px' }} />
            </div>
            <div className="text-xs font-mono font-bold text-white bg-white/10 border border-white/20 px-2 py-1 rounded-lg min-w-[2.5rem] text-center">{value}</div>
        </div>
    );
}
