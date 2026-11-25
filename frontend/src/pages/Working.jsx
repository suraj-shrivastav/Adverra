import { useState, useEffect } from "react";
import { Radio, Zap, Clock } from "lucide-react";

const CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノ01".split("");

function MatrixColumn({ delay, duration, chars }) {
    return (
        <div
            className="flex flex-col items-center opacity-0 animate-pulse"
            style={{
                animationDelay: `${delay}ms`,
                animationDuration: `${duration}ms`,
                writingMode: "vertical-rl",
                fontSize: "0.7rem",
                color: "#1a1a1a",
                fontFamily: "'Outfit', sans-serif",
                letterSpacing: "0.3em",
                position: "absolute",
                top: 0,
                left: `${Math.random() * 100}%`,
            }}
        >
            {chars.join("")}
        </div>
    );
}

export default function Working() {
    const [dots, setDots] = useState(0);
    const [glitch, setGlitch] = useState(false);
    const [blink, setBlink] = useState(true);
    const [columns] = useState(() =>
        Array.from({ length: 15 }, (_, i) => ({
            id: i,
            delay: Math.random() * 3000,
            duration: 2000 + Math.random() * 3000,
            chars: Array.from({ length: 20 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]),
        }))
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((d) => (d + 1) % 4);
        }, 500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setGlitch(true);
            setTimeout(() => setGlitch(false), 150);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setBlink((b) => !b);
        }, 800);
        return () => clearInterval(interval);
    }, []);

    const dotStr = ".".repeat(dots);

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#000000",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Outfit', sans-serif",
                overflow: "hidden",
                position: "relative",
            }}
        >
            {/* Scanline overlay */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)",
                    pointerEvents: "none",
                    zIndex: 10,
                }}
            />

            {/* Subtle radial glow */}
            <div
                style={{
                    position: "absolute",
                    width: "600px",
                    height: "600px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    pointerEvents: "none",
                }}
            />

            {/* Matrix columns in background */}
            <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
                {columns.map((col) => (
                    <MatrixColumn key={col.id} {...col} />
                ))}
            </div>

            {/* Main content */}
            <div style={{ position: "relative", zIndex: 20, textAlign: "center", padding: "2rem" }}>
                {/* Top badge */}
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        border: "1px solid #222",
                        borderRadius: "2px",
                        padding: "6px 16px",
                        marginBottom: "3rem",
                        color: "#444",
                        fontSize: "0.65rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                    }}
                >
                    <Clock size={10} />
                    <span>status update</span>
                </div>

                {/* Animated Radio icon */}
                <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "center" }}>
                    <div
                        style={{
                            position: "relative",
                            width: "72px",
                            height: "72px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {/* Ping rings */}
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                style={{
                                    position: "absolute",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    borderRadius: "50%",
                                    width: `${i * 24 + 48}px`,
                                    height: `${i * 24 + 48}px`,
                                    animation: `ping ${i * 0.6 + 1}s cubic-bezier(0,0,0.2,1) infinite`,
                                    animationDelay: `${i * 0.4}s`,
                                }}
                            />
                        ))}
                        <div
                            style={{
                                width: "48px",
                                height: "48px",
                                border: "1px solid #2a2a2a",
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#0a0a0a",
                            }}
                        >
                            <Radio size={22} color={blink ? "#ffffff" : "#333"} style={{ transition: "color 0.1s" }} />
                        </div>
                    </div>
                </div>

                {/* "WORKING..." heading */}
                <h1
                    style={{
                        fontSize: "clamp(2.5rem, 8vw, 6rem)",
                        fontWeight: 700,
                        color: "#ffffff",
                        letterSpacing: "-0.02em",
                        lineHeight: 1,
                        marginBottom: "0.5rem",
                        fontFamily: "'Outfit', sans-serif",
                        position: "relative",
                        textShadow: glitch
                            ? "3px 0 #ff0000, -3px 0 #0000ff"
                            : "none",
                        transform: glitch ? "skewX(-1deg) translateX(2px)" : "none",
                        transition: "transform 0.05s, text-shadow 0.05s",
                    }}
                >
                    WORKING{dotStr}
                </h1>

                {/* Divider */}
                <div
                    style={{
                        width: "100%",
                        height: "1px",
                        background: "linear-gradient(90deg, transparent, #1f1f1f, transparent)",
                        margin: "2rem auto",
                        maxWidth: "400px",
                    }}
                />

                {/* "LIVE SOON" */}
                <div style={{ position: "relative", display: "inline-block" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            justifyContent: "center",
                        }}
                    >
                        <Zap size={14} color="#555" />
                        <p
                            style={{
                                fontSize: "clamp(0.9rem, 3vw, 1.1rem)",
                                color: "#333",
                                letterSpacing: "0.5em",
                                textTransform: "uppercase",
                                margin: 0,
                            }}
                        >
                            LIVE SOON
                        </p>
                        <Zap size={14} color="#555" />
                    </div>
                </div>

                {/* Progress bar */}
                <div
                    style={{
                        marginTop: "3rem",
                        width: "200px",
                        height: "1px",
                        backgroundColor: "#111",
                        overflow: "hidden",
                        position: "relative",
                        margin: "3rem auto 0",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            height: "100%",
                            backgroundColor: "#ffffff",
                            animation: "slide 2s ease-in-out infinite",
                            width: "30%",
                        }}
                    />
                </div>

                {/* Footer note */}
                <p
                    style={{
                        marginTop: "3rem",
                        fontSize: "0.6rem",
                        color: "#1a1a1a",
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                    }}
                >
                    © {new Date().getFullYear()} — Coming Online
                </p>
            </div>

            <style>{`
        @keyframes ping {
          0% { transform: scale(0.9); opacity: 0.5; }
          70%, 100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes slide {
          0% { left: -30%; }
          100% { left: 130%; }
        }
      `}</style>
        </div>
    );
}