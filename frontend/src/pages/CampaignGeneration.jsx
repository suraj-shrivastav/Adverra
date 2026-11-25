import { useEffect, useRef, useState } from 'react';
import BrandSidebar from '../components/brand/BrandSidebar';
import BrandModal from '../components/brand/BrandModal';
import { useImageGenerationStore } from '../store/useImageGenerationStore';
import { useDataStore } from '../store/useDataStore';
import { useWalkthrough } from '../context/WalkthroughContext';
import { buildMockCampaign, WALKTHROUGH_PRESETS } from '../libs/showcaseGenerators';
import { Loader2, Send, Copy, Check, Instagram, Twitter, Linkedin, Facebook, Pin, Globe, History, X, Calendar, Megaphone, Menu } from 'lucide-react';
import HistoryModal from '../components/common/HistoryModal';
import WalkthroughTriggerButton from '../components/WalkthroughTriggerButton';
import PipelineInspector from '../components/PipelineInspector';

const CampaignGeneration = () => {
    const {
        brands,
        selectedBrandId,
        isBrandModalOpen,
        newBrandUrl,
        isSubmittingBrand,
        isLoadingBrands,
        getAllBrands,
        setSelectedBrandId,
        openBrandModal,
        closeBrandModal,
        setNewBrandUrl,
        addBrandFromUrl,
    } = useImageGenerationStore();

    const { campaigns: historyCampaigns, addCampaign } = useDataStore();

    const [prompt, setPrompt] = useState("");
    const [platforms, setPlatforms] = useState(["Instagram"]);
    const [product, setProduct] = useState("");
    const [targetAudience, setTargetAudience] = useState("");
    const [tone, setTone] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedCampaign, setGeneratedCampaign] = useState(null);
    const [copyState, setCopyState] = useState({ type: null, active: false });
    const [showResultModal, setShowResultModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [isLoadingHistory] = useState(false);
    const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { isActive, mode, stepIndex } = useWalkthrough();
    const addedWalkthroughCampaignRef = useRef(false);
    const wasWalkthroughCampaignRef = useRef(false);

    const selectedBrand = brands.find(b => b.id == selectedBrandId);

    useEffect(() => {
        getAllBrands();
    }, [getAllBrands]);

    useEffect(() => {
        if (!isActive || mode !== 'campaign') {
            if (wasWalkthroughCampaignRef.current) {
                wasWalkthroughCampaignRef.current = false;
                setIsGenerating(false);
            }
            return;
        }

        wasWalkthroughCampaignRef.current = true;
        const preset = WALKTHROUGH_PRESETS.campaign;

        if (stepIndex === 0) {
            addedWalkthroughCampaignRef.current = false;
            setSelectedBrandId(preset.brandId);
            setPlatforms(preset.platforms);
            setIsGenerating(false);
            setShowResultModal(false);
            setShowHistoryModal(false);
        } else if (stepIndex === 1) {
            setSelectedBrandId(preset.brandId);
            setPlatforms(preset.platforms);
            setProduct(preset.product);
            setTargetAudience(preset.targetAudience);
            setTone(preset.tone);
            setPrompt(preset.prompt);
            setIsGenerating(false);
            setShowResultModal(false);
            setShowHistoryModal(false);
        } else if (stepIndex === 2) {
            setIsGenerating(true);
            setShowResultModal(false);
            setShowHistoryModal(false);
        } else if (stepIndex === 3) {
            setIsGenerating(false);
            setGeneratedCampaign(preset.outputCampaign);
            setShowResultModal(true);
            setShowHistoryModal(false);
            if (!addedWalkthroughCampaignRef.current) {
                const exists = useDataStore
                    .getState()
                    .campaigns.some((c) => c.id === 999201);
                if (!exists) {
                    addCampaign({
                        id: 999201,
                        created_at: new Date().toISOString(),
                        campaign: preset.outputCampaign,
                    });
                }
                addedWalkthroughCampaignRef.current = true;
            }
        }
    }, [isActive, mode, stepIndex, setSelectedBrandId, addCampaign]);

    const handleBrandChange = (e) => {
        const value = e.target.value;
        if (value === 'ADD_NEW_URL') {
            openBrandModal();
        } else {
            setSelectedBrandId(value);
            setIsSidebarOpen(false);
        }
    };

    const handleAddBrandSubmit = async () => {
        if (!newBrandUrl.trim()) return;
        await addBrandFromUrl(newBrandUrl);
    };

    const fetchHistory = async () => {
        setShowHistoryModal(true);
    };

    const handleGenerate = async () => {
        if (!selectedBrandId) {
            const selector = document.querySelector('button[class*="border-white/20"]');
            if (selector) {
                selector.classList.add('animate-shake');
                setTimeout(() => selector.classList.remove('animate-shake'), 500);
            }
            return;
        }

        try {
            setIsGenerating(true);
            setGeneratedCampaign(null);

            await new Promise((resolve) => setTimeout(resolve, 1000));

            const campaign = buildMockCampaign({
                prompt: {
                    content: prompt,
                    product,
                    targetAudience,
                    tone,
                },
                campaignData: {
                    platforms,
                    ...selectedBrand,
                },
            });

            addCampaign({
                id: Date.now(),
                created_at: new Date().toISOString(),
                campaign,
            });

            setGeneratedCampaign(campaign);
            setShowResultModal(true);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = async (text, type) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopyState({ type, active: true });
            setTimeout(() => setCopyState({ type: null, active: false }), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const CampaignDetailView = ({ campaign, createdAt, onClose }) => (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-4 sm:mb-8 flex-shrink-0">
                <div className="flex-1 pr-4">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 leading-tight">{campaign.title}</h3>
                    {createdAt && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Calendar size={14} />
                            <span>{new Date(createdAt).toLocaleDateString()} · {new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    )}
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-2.5 bg-black/40 hover:bg-black/60 rounded-2xl text-gray-500 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 flex-1 min-h-0">
                {/* Main Campaign Text */}
                <div className="lg:col-span-2 bg-black/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/5 hover:border-white/10 transition-all flex flex-col">
                    <div className="flex items-center justify-between mb-6 flex-shrink-0">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Campaign Copy</span>
                        <button
                            onClick={() => handleCopy(campaign.actualCampaign, 'modal_campaign')}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-xs text-gray-400 hover:text-white transition-all"
                        >
                            {copyState.type === 'modal_campaign' && copyState.active ? (
                                <><Check size={14} /> Copied</>
                            ) : (
                                <><Copy size={14} /> Copy</>
                            )}
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
                        <p className="text-sm sm:text-base text-gray-300 whitespace-pre-line leading-relaxed">
                            {campaign.actualCampaign}
                        </p>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-3 sm:space-y-4 flex flex-col">
                    <div className="bg-black/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/5">
                        <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">Target Audience</div>
                        <div className="text-sm text-gray-400 leading-relaxed">{campaign.targetAudience}</div>
                    </div>

                    <div className="bg-black/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/5">
                        <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">Best Time</div>
                        <div className="flex items-center gap-2 text-base text-white font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            {campaign.bestTimeToPost}
                        </div>
                    </div>

                    <div className="bg-black/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/5 flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Hashtags</div>
                            <button
                                onClick={() => handleCopy(campaign.hashtags?.map(tag => tag.startsWith('#') ? tag : `#${tag}`).join(' '), 'modal_hashtags')}
                                className="p-1.5 rounded-lg hover:bg-black/40 text-gray-500 hover:text-white transition-all"
                            >
                                {copyState.type === 'modal_hashtags' && copyState.active ? (
                                    <Check size={14} />
                                ) : (
                                    <Copy size={14} />
                                )}
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {campaign.hashtags?.map((tag, i) => (
                                <span key={i} className="text-xs bg-black/40 px-3 py-1.5 rounded-xl text-gray-500 border border-white/5">
                                    {tag.startsWith('#') ? tag : `#${tag}`}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 sm:mt-6 flex-shrink-0">
                <PipelineInspector
                    title="Pipeline & Engineered Prompt"
                    model="Gemini 2.5 Flash"
                    steps={[
                        `Brand Identity (${selectedBrand?.title || 'Verve Botanics'})`,
                        `Platform Rules (${platforms.join(', ')})`,
                        'Persona & Tone Conditioning',
                        'Structured JSON Schema',
                    ]}
                    promptPreview={[
                        `Brand: ${selectedBrand?.title || 'Verve Botanics'} · Channels: ${platforms.join(', ')}`,
                        `Product: ${product || campaign?.title || 'Brand Flagship'} · Tone: ${tone || 'On-Brand'}`,
                        `Audience: ${campaign?.targetAudience || targetAudience || 'Target Buyers'}`,
                        prompt ? `Brief: ${prompt}` : null,
                    ]
                        .filter(Boolean)
                        .join('\n')}
                />
            </div>
        </div>
    );

    return (
        <div className="flex h-full bg-black text-gray-200 overflow-hidden font-outfit relative">

            {/* Mobile sidebar toggle */}
            <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-40 p-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md"
            >
                <Menu size={20} />
            </button>

            {/* Sidebar overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar wrapper */}
            <div className={`fixed lg:relative z-50 h-full transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                {/* Mobile close button */}
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden absolute top-4 right-4 z-50 p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
                >
                    <X size={18} />
                </button>

                <BrandSidebar
                    brands={brands}
                    selectedBrandId={selectedBrandId}
                    selectedBrandData={selectedBrand}
                    onBrandChange={handleBrandChange}
                    isLoading={isLoadingBrands}
                    title="Campaign Generation"
                    subtitle="Create AI-powered marketing campaigns"
                />
            </div>

            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Fancy Background Text Overlay */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none select-none opacity-[0.05] z-0 font-outfit hidden lg:block">
                    <div className="absolute top-[5%] -left-20 -rotate-12 text-[120px] font-black tracking-tighter whitespace-nowrap">
                        STRATEGY → EXECUTION
                    </div>
                    <div className="absolute top-[25%] -right-40 rotate-6 text-[150px] font-black tracking-tighter whitespace-nowrap">
                        INSIGHT TO IMPACT
                    </div>
                    <div className="absolute bottom-[15%] -left-20 -rotate-6 text-[130px] font-black tracking-tighter whitespace-nowrap">
                        FROM IDEA TO INBOX
                    </div>
                    <div className="absolute top-[45%] -left-60 rotate-12 text-[140px] font-black tracking-tighter whitespace-nowrap">
                        DATA-DRIVEN CREATIVITY
                    </div>
                    <div className="absolute -bottom-10 right-20 -rotate-12 text-[110px] font-black tracking-tighter whitespace-nowrap">
                        AUTOMATED. OPTIMIZED. SCALABLE.
                    </div>
                    <div className="absolute -top-20 right-40 rotate-[25deg] text-[160px] font-black tracking-tighter whitespace-nowrap">
                        CAMPAIGNS THAT CONVERT
                    </div>
                    <div className="absolute top-[75%] -right-40 -rotate-12 text-[140px] font-black tracking-tighter whitespace-nowrap">
                        INTELLIGENT MARKETING FLOWS
                    </div>
                    <div className="absolute bottom-[45%] right-20 rotate-12 text-[130px] font-black tracking-tighter whitespace-nowrap">
                        PRECISION AT SCALE
                    </div>
                </div>
                {/* Top Right Action Buttons */}
                <div className="absolute top-4 right-4 lg:top-8 lg:right-8 z-10 flex items-center gap-2">
                    <WalkthroughTriggerButton startMode="campaign" variant="toolbar" />
                    <button
                        onClick={fetchHistory}
                        className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-black/40 border border-white/10 rounded-2xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-black/60 transition-all"
                    >
                        <History size={16} />
                        <span className="hidden sm:inline">History</span>
                    </button>
                </div>

                {/* Main Form */}
                <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 pt-14 lg:pt-8 overflow-y-auto scrollbar-hide">
                    <div className="max-w-3xl w-full space-y-8 sm:space-y-12">
                        <div className="text-center space-y-2 sm:space-y-3">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                                Campaign Hub
                            </h1>
                            <p className="text-gray-600 text-sm sm:text-base">Create execution-ready social posts from your brand brief</p>
                        </div>

                        <div className="bg-black/20 border border-white/10 rounded-3xl sm:rounded-[2.5rem] p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 backdrop-blur-sm">
                            {/* Platforms */}
                            <div className="space-y-3 sm:space-y-4">
                                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Platforms</label>
                                <div className="flex flex-wrap gap-2 sm:gap-3">
                                    {[
                                        { id: 'Instagram', icon: Instagram },
                                        { id: 'Twitter', icon: Twitter },
                                        { id: 'LinkedIn', icon: Linkedin },
                                        { id: 'Facebook', icon: Facebook },
                                        { id: 'Pinterest', icon: Pin },
                                        { id: 'Web', icon: Globe },
                                    ].map((p) => {
                                        const isSelected = platforms.includes(p.id);
                                        return (
                                            <button
                                                key={p.id}
                                                onClick={() => {
                                                    if (isSelected) {
                                                        if (platforms.length > 1) setPlatforms(platforms.filter(x => x !== p.id));
                                                    } else {
                                                        setPlatforms([...platforms, p.id]);
                                                    }
                                                }}
                                                className={`flex items-center gap-2 sm:gap-2.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-2xl border transition-all ${isSelected
                                                    ? 'bg-white text-black border-white'
                                                    : 'bg-black/30 border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-400'
                                                    }`}
                                            >
                                                <p.icon size={16} />
                                                <span className="text-xs sm:text-sm font-bold">{p.id}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Input Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</label>
                                    <input
                                        type="text"
                                        value={product}
                                        onChange={(e) => setProduct(e.target.value)}
                                        placeholder="Enter product"
                                        className="w-full bg-black/30 border border-white/10 hover:border-white/20 focus:border-white/30 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-gray-700 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Audience</label>
                                    <input
                                        type="text"
                                        value={targetAudience}
                                        onChange={(e) => setTargetAudience(e.target.value)}
                                        placeholder="Target audience"
                                        className="w-full bg-black/30 border border-white/10 hover:border-white/20 focus:border-white/30 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-gray-700 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Tone</label>
                                    <input
                                        type="text"
                                        value={tone}
                                        onChange={(e) => setTone(e.target.value)}
                                        placeholder="Brand voice"
                                        className="w-full bg-black/30 border border-white/10 hover:border-white/20 focus:border-white/30 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-gray-700 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Prompt Area */}
                            <div className="relative">
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Describe your campaign goals and key messaging..."
                                    className="w-full h-36 sm:h-44 bg-black/30 border border-white/10 hover:border-white/20 focus:border-white/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-sm sm:text-base text-white placeholder:text-gray-700 outline-none resize-none transition-all"
                                />
                                <div className="absolute bottom-4 sm:bottom-5 right-4 sm:right-5">
                                    <button
                                        onClick={handleGenerate}
                                        disabled={isGenerating}
                                        className="bg-white text-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-semibold hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin" />
                                                <span>Generating...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send size={16} />
                                                <span>Generate</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Result Modal */}
            {showResultModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-xl">
                    <div className="bg-neutral-950 border border-white/10 rounded-2xl sm:rounded-[2.5rem] w-full max-w-6xl h-[90vh] sm:h-[85vh] overflow-hidden shadow-2xl">
                        <div className="h-full overflow-y-auto scrollbar-hide">
                            <div className="p-4 sm:p-6 lg:p-10 h-full flex flex-col">
                                <div className="mb-4 sm:mb-8 flex-shrink-0">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-3 sm:mb-4">
                                        <div className="w-2 h-2 rounded-full bg-white" />
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Generated</span>
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Your Campaign</h2>
                                </div>
                                <CampaignDetailView
                                    campaign={generatedCampaign}
                                    onClose={() => setShowResultModal(false)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* History Modal */}
            <HistoryModal
                isOpen={showHistoryModal}
                onClose={() => {
                    setShowHistoryModal(false);
                    setSelectedHistoryItem(null);
                }}
                items={historyCampaigns}
                onItemClick={(item) => setSelectedHistoryItem(item)}
                selectedItem={selectedHistoryItem}
                setSelectedItem={setSelectedHistoryItem}
                isLoading={isLoadingHistory}
                icon={<Megaphone size={20} />}
                title="Campaign History"
                emptyMessage="No campaigns yet.\nCreate your first one to get started."
                renderListItem={(item) => (
                    <button className="w-full bg-black/30 hover:bg-black/50 border border-white/5 hover:border-white/10 p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-left transition-all group flex items-center justify-between">
                        <div>
                            <h4 className="text-base sm:text-lg font-semibold text-gray-400 group-hover:text-white mb-2 transition-colors">
                                {item.campaign?.title || "Untitled Campaign"}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Calendar size={12} />
                                {new Date(item.created_at).toLocaleDateString(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </div>
                        </div>
                        <Megaphone size={20} className="text-gray-600 group-hover:text-white transition-colors" />
                    </button>
                )}
                renderDetails={(item) => (
                    <CampaignDetailView
                        campaign={item.campaign}
                        createdAt={item.created_at}
                    />
                )}
            />

            <BrandModal
                isOpen={isBrandModalOpen}
                onClose={closeBrandModal}
                onSubmit={handleAddBrandSubmit}
                url={newBrandUrl}
                setUrl={setNewBrandUrl}
                isSubmitting={isSubmittingBrand}
            />

        </div>
    );
};

export default CampaignGeneration;