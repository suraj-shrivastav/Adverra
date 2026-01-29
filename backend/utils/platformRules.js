export const Platform = {
    instagram: {
        tone: "Trendy, visual-first, emotionally engaging",
        captionLength: "Short to medium (1–3 lines)",
        hashtags: {
            count: "8–15",
            type: "Trending + niche",
        },
        contentFocus: ["Reels", "Stories", "Visual storytelling"],
        cta: ["Tap to shop", "Save this post", "Share with friends"],
        // bestTimeToPost: "6–9 PM (local time)",
    },

    facebook: {
        tone: "Conversational, community-driven",
        captionLength: "Medium (2–4 lines)",
        hashtags: {
            count: "3–5",
            type: "Relevant",
        },
        contentFocus: ["Engagement", "Shares", "Comments"],
        cta: ["Share with friends", "Join the conversation"],
        bestTimeToPost: "12–1 PM, 6–8 PM",
    },

    linkedin: {
        tone: "Professional, value-driven, authoritative",
        captionLength: "Medium to long (3–6 lines)",
        hashtags: {
            count: "3–5",
            type: "Professional only",
        },
        contentFocus: ["Industry insights", "Brand credibility", "Outcomes"],
        cta: ["Read more", "Let’s connect"],
        bestTimeToPost: "Weekdays 8–10 AM",
    },

    x: {
        tone: "Sharp, concise, witty",
        captionLength: "Very short (≤ 280 characters)",
        hashtags: {
            count: "1–3",
            type: "Trending",
        },
        contentFocus: ["Timely updates", "Opinions", "Trends"],
        cta: ["Retweet if you agree", "Join the discussion"],
        bestTimeToPost: "9–11 AM",
    },

    youtube: {
        tone: "Informative, engaging, storytelling",
        captionLength: "Long-form descriptions",
        hashtags: {
            count: "3–5",
            type: "Relevant",
        },
        contentFocus: ["Tutorials", "Reviews", "Brand stories"],
        cta: ["Subscribe for more", "Watch till the end"],
        bestTimeToPost: "6–9 PM",
    },

    tiktok: {
        tone: "Fun, authentic, trend-driven",
        captionLength: "Short (1–2 lines)",
        hashtags: {
            count: "5–10",
            type: "Trending",
        },
        contentFocus: ["Trends", "Challenges", "Short-form storytelling"],
        cta: ["Try this trend", "Follow for more"],
        bestTimeToPost: "7–11 PM",
    },

    pinterest: {
        tone: "Inspirational, aspirational",
        captionLength: "Medium with keywords",
        hashtags: {
            count: "2–5",
            type: "Optional",
        },
        contentFocus: ["Discovery", "Evergreen content"],
        cta: ["Save for later", "Explore more ideas"],
        bestTimeToPost: "8–11 PM",
    },
};


export const getPlatformRules = (platform) => {
    return JSON.stringify(Platform[platform.toLowerCase()] || Platform.instagram);
}