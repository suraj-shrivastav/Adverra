import CardSwap, { Card } from "../components/CardSwap";
import { Image, Megaphone, AudioLines, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";

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

const LandingPage = () => {
    return (
        <div className="relative min-h-screen w-full bg-black text-white overflow-y-auto scrollbar-hide">
            {/* NAVBAR */}
            <Navbar />

            {/* HERO */}
            <section
                className="
          grid min-h-screen grid-cols-1 lg:grid-cols-2
          px-6 md:px-16
        "
            >
                {/* LEFT */}
                <div className="flex flex-col justify-center text-center lg:text-left">
                    <span className="mb-6 inline-block text-sm tracking-wide text-white/45">
                        AI-POWERED MARKETING PLATFORM
                    </span>

                    <h1 className="
            text-3xl sm:text-4xl md:text-5xl lg:text-6xl
            font-semibold leading-tight text-white/85
          ">
                        Create marketing
                        <br />
                        assets in
                        <span className="text-white/65"> seconds</span>
                    </h1>

                    <p className="
            mt-6 max-w-xl
            text-base sm:text-lg
            text-white/55
            leading-relaxed
            mx-auto lg:mx-0
          ">
                        Generate images, campaigns, and audio content using AI.
                        Built for teams that move fast and ship smarter.
                    </p>

                    <div className="
            mt-10 flex flex-col sm:flex-row
            gap-4
            justify-center lg:justify-start
          ">
                        <button className="
              flex items-center justify-center gap-2
              rounded-xl bg-white px-8 py-4
              text-black font-medium
              hover:bg-gray-200 transition
            ">
                            Get started
                            <ArrowRight className="w-4 h-4" />
                        </button>

                        <button className="
              rounded-xl border border-white/15
              bg-white/5 px-8 py-4
              text-white/65
              hover:bg-white/10 hover:text-white
              transition backdrop-blur
            ">
                            View demo
                        </button>
                    </div>

                    <div className="
            mt-10 text-sm text-white/45
            text-center lg:text-left
          ">
                        No credit card required · Cancel anytime
                    </div>
                </div>

                {/* RIGHT — Card Swap */}
                <div
                    className="
            relative flex
            items-start lg:items-center
            justify-center
            mt-12 lg:mt-0
            -mt-6 sm:-mt-10 lg:mt-0
            overflow-hidden
          "
                >
                    <div
                        className="
              relative
              h-[340px] sm:h-[380px] lg:h-[420px]
              w-full
              max-w-sm sm:max-w-md
            "
                    >
                        <CardSwap
                            cardDistance={70}
                            verticalDistance={100}
                            delay={4500}
                            pauseOnHover={false}
                            width={500}
                            height={400}
                        >
                            {features.map((feature, index) => (
                                <Card
                                    key={index}
                                    className="
                    bg-gradient-to-br from-neutral-950 to-black
                    border border-white/10
                    backdrop-blur
                  "
                                >
                                    <div className="flex h-full flex-col justify-between p-6">
                                        <div>
                                            <div className="
                        mb-4 flex h-12 w-12 items-center justify-center
                        rounded-xl border border-white/15 bg-white/5
                      ">
                                                <feature.icon className="h-6 w-6 text-white/65" />
                                            </div>

                                            <h3 className="text-lg sm:text-xl font-medium text-white/85">
                                                {feature.title}
                                            </h3>

                                            <p className="mt-3 text-sm text-white/55 leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>

                                        <span className="mt-6 text-sm text-white/45">
                                            Learn more →
                                        </span>
                                    </div>
                                </Card>
                            ))}
                        </CardSwap>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
