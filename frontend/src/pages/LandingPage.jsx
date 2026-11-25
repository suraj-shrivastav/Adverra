import CardSwap, { Card } from "../components/CardSwap";
import { Image, Megaphone, AudioLines, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";

const features = [
    {
        icon: Image,
        title: "Image Generation",
        description:
            "Create high-quality visuals instantly using AI-powered image generation."
    },
    {
        icon: Megaphone,
        title: "Campaign Creation",
        description:
            "Generate complete marketing campaigns optimized for conversion."
    },
    {
        icon: AudioLines,
        title: "Audio & Voice",
        description:
            "Produce studio-quality voiceovers and audio content in seconds."
    }
];

const featureRoutes = ["/image", "/campaign", "/audio"];

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen w-full bg-black text-white overflow-y-auto scrollbar-hide font-outfit">
            <Navbar />

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full pointer-events-none opacity-20">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-500/30 blur-[120px] rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* LEFT CONTENT */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left z-10">
                        <span className="mb-6 inline-block text-xs font-bold tracking-[0.2em] text-white/40 uppercase">
                            AI-POWERED MARKETING PLATFORM
                        </span>

                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] text-white tracking-tight">
                            Create marketing <br />
                            assets in
                            <span className="text-white/50"> seconds</span>
                        </h1>

                        <p className="mt-8 max-w-xl text-lg text-white/50 leading-relaxed">
                            Generate high-conversion images, campaigns, and audio content using state-of-the-art AI.
                            Built for modern teams that move at the speed of thought.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <Link
                                to="/image"
                                className="flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-black font-bold hover:bg-gray-200 transition-all active:scale-95 shadow-xl shadow-white/5"
                            >
                                Get started
                                <ArrowRight className="w-4 h-4" />
                            </Link>

                            {/* <button className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-white/60 font-semibold hover:bg-white/10 hover:text-white transition-all backdrop-blur-md active:scale-95">
                                View Demo
                            </button> */}
                        </div>
                    </div>

                    {/* RIGHT CONTENT (Desktop Animation / Mobile Feature Grid) */}
                    <div className="relative">
                        {/* Desktop Only Animation */}
                        <div className="hidden lg:flex items-center justify-center">
                            <div className="relative h-[480px] w-full max-w-md">
                                <CardSwap
                                    cardDistance={70}
                                    verticalDistance={100}
                                    delay={4500}
                                    pauseOnHover={false}
                                    width={500}
                                    height={400}
                                    onCardClick={(index) => navigate(featureRoutes[index] || "/image")}
                                >
                                    {features.map((feature, index) => (
                                        <Card
                                            key={index}
                                            className="cursor-pointer bg-gradient-to-br from-neutral-900 to-black border border-white/10 backdrop-blur-xl shadow-2xl rounded-[2.5rem]"
                                        >
                                            <div className="flex h-full flex-col justify-between p-10">
                                                <div>
                                                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                                                        <feature.icon className="h-7 w-7 text-white/70" />
                                                    </div>
                                                    <h3 className="text-2xl font-bold text-white mb-4">
                                                        {feature.title}
                                                    </h3>
                                                    <p className="text-white/50 leading-relaxed">
                                                        {feature.description}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm font-bold text-white/40 uppercase tracking-widest">
                                                    Explore Feature <ArrowRight size={14} />
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </CardSwap>
                            </div>
                        </div>

                        {/* Mobile Feature List (Alternative to CardSwap) */}
                        <div className="lg:hidden grid grid-cols-1 gap-6">
                            {features.map((feature, index) => (
                                <Link key={index} to={featureRoutes[index] || "/image"} className="block bg-neutral-900/50 border border-white/5 p-8 rounded-3xl backdrop-blur-sm hover:border-white/20 transition-all">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70">
                                        <feature.icon size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                    <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default LandingPage;
