const hand_drawn_prompt = `
Create a hand-drawn quirky illustration on a solid black background with a playful, expressive, slightly surreal aesthetic. The artwork should feel clever, character-driven, and imperfect, as if sketched by hand with confidence and humor. Drawing Style: Hand-drawn ink or marker illustration, Imperfect, organic linework with visible human strokes, Slight wobble and variation in line thickness, No vector precision, no digital cleanliness, Sketchbook or zine-style energy. Quirk and Character: Exaggerated but restrained proportions, Expressive faces, awkward poses, or odd details, Humor comes from subtle visual irony, Characters or objects feel thoughtful, confused, amused, or quietly weird, Avoid slapstick or childish cartoon tropes. Color Palette: Black background is dominant and untouched, Limited, high-contrast colors only, Accent colors: off-white, muted yellow, dull pink, teal, light blue, soft orange, Use color sparingly to create focal points, No gradients or neon effects. Texture and Fill: Flat fills with occasional rough shading, Dry-brush, crayon, or chalk-like texture allowed, White ink or muted color strokes pop against black, Visible grain or paper-like texture encouraged. Composition: Central subject with generous negative space, Strong silhouette readability, Slight asymmetry for visual interest, Poster or editorial-style framing. Mood and Tone: Quirky, clever, and slightly introspective, Calm humor, not chaos, Feels like indie illustration or editorial art, Contemporary, expressive, and human. Rendering Rules: No photorealism, No 3D rendering, No cinematic lighting, No glossy or polished effects, Maintain a flat, hand-crafted look, High resolution with visible line texture.
`

const three_d_prompt = `
Create a 3D render with a playful, slightly surreal aesthetic, featuring a central subject with a calm, quirky personality. The style should feel like high-end editorial illustration—clever, character-driven, and visually witty. Drawing Style: 3D digital render with soft, rounded forms, Smooth surfaces with subtle imperfections, No hard edges or sharp geometry, Avoid overly realistic skin or textures, Focus on shape and form over surface detail. Quirk and Character: Subject has an expressive but subtle face, Awkward or thoughtful pose, Humor comes from visual irony or unexpected details, Avoid slapstick or childish cartoon tropes, Character feels quietly amused or introspective. Color Palette: Soft, muted, and slightly desaturated, Pastel-adjacent colors with low contrast, Cream, dusty rose, sage green, pale yellow, light blue, soft orange, Limited palette with intentional color blocking, No neon or overly vibrant colors. Lighting and Mood: Soft, diffused studio lighting, Gentle shadows that define form, No harsh highlights or dramatic contrast, Warm and inviting atmosphere, Calm and slightly whimsical mood. Composition: Central subject with generous negative space, Clean and uncluttered, Strong silhouette readability, Slight asymmetry for visual interest, Editorial or poster-style framing. Rendering Rules: No photorealism, No skin pores or fabric textures, No motion blur, No depth of field effects, Maintain a clean, stylized 3D look, High resolution with smooth surfaces.
`

const moody_prompt = `
Create a moody, minimalist editorial illustration with a cinematic, mid-century modern noir aesthetic. The image should feel quiet, introspective, and slightly melancholic, like a frozen frame from an arthouse film or a graphic novel. Visual Style and Form: Simplified, geometric forms with strong structure, Characters and objects appear stylized, not realistic, Faces are calm, distant, or emotionally restrained, Subtle asymmetry and stiff poses are intentional, Scenes feel paused in time, almost surveillance-like. Texture and Surface: Prominent paper grain and canvas texture across the entire image, Matte, chalky, slightly rough surfaces, Visible noise and soft shading transitions, No smooth digital gradients, Texture must feel analog and printed. Color Palette: Very limited, controlled palette, Dominant colors: muted red, brick red, dusty pink, charcoal black, warm gray, desaturated beige, Occasional off-white or pale moonlight accents, No bright colors, no neon, no saturation spikes, High contrast achieved through color blocking, not lighting. Lighting and Contrast: Low-key, cinematic lighting, Strong directional light creating geometric shadow shapes, Flat shadows with soft edges, Lighting feels artificial and deliberate, not natural, Night-time or late-evening mood. Composition: Strong framing and negative space, Architectural balance and clean divisions, Subjects often off-center or partially cropped, Scenes feel isolated and emotionally distant, Every frame should read as a standalone poster. Background and Environment: Minimal urban or domestic settings, Quiet streets, houses, interiors, objects, or symbolic elements, No crowds, no motion blur, no chaos, Background elements are simplified into shapes and planes. Mood and Narrative: Introspective, slightly uneasy, contemplative, Feels like loneliness, memory, or quiet tension, Subtle psychological undertones, Editorial, cinematic, and emotional.
`
const dark_3d_prompt = `
Create a dark, moody 3D render with a cinematic, mid-century modern noir aesthetic. The image should feel quiet, introspective, and slightly melancholic, like a frozen frame from an arthouse film or a graphic novel. Visual Style and Form: Simplified, geometric forms with strong structure, Characters and objects appear stylized, not realistic, Faces are calm, distant, or emotionally restrained, Subtle asymmetry and stiff poses are intentional, Scenes feel paused in time, almost surveillance-like. Texture and Surface: Prominent paper grain and canvas texture across the entire image, Matte, chalky, slightly rough surfaces, Visible noise and soft shading transitions, No smooth digital gradients, Texture must feel analog and printed. Color Palette: Very limited, controlled palette, Dominant colors: muted red, brick red, dusty pink, charcoal black, warm gray, desaturated beige, Occasional off-white or pale moonlight accents, No bright colors, no neon, no saturation spikes, High contrast achieved through color blocking, not lighting. Lighting and Contrast: Low-key, cinematic lighting, Strong directional light creating geometric shadow shapes, Flat shadows with soft edges, Lighting feels artificial and deliberate, not natural, Night-time or late-evening mood. Composition: Strong framing and negative space, Architectural balance and clean divisions, Subjects often off-center or partially cropped, Scenes feel isolated and emotionally distant, Every frame should read as a standalone poster. Background and Environment: Minimal urban or domestic settings, Quiet streets, houses, interiors, objects, or symbolic elements, No crowds, no motion blur, no chaos, Background elements are simplified into shapes and planes. Mood and Narrative: Introspective, slightly uneasy, contemplative, Feels like loneliness, memory, or quiet tension, Subtle psychological undertones, Editorial, cinematic, and emotional.
`

const genZ_prompt = `Create a 3D render with a playful, slightly surreal aesthetic, featuring a stylish Gen Z character lounging comfortably on a floating abstract shape, holding [INSERT YOUR PRODUCT] with a look of pure, unbothered satisfaction. The scene represents "peak vibe" or the "soft life," where the product is the key to their relaxation. The style should feel like high-end editorial illustration—clever, character-driven, and visually witty. Drawing Style: 3D digital render with soft, rounded forms, Smooth surfaces with subtle imperfections, No hard edges or sharp geometry, Avoid overly realistic skin or textures, Focus on shape and form over surface detail. Quirk and Character: Subject wears oversized, trendy streetwear (hoodie or chunky sneakers), has an expressive but subtle face, Awkward or thoughtful pose, Humor comes from visual irony or unexpected details, Avoid slapstick or childish cartoon tropes, Character feels quietly amused or introspective. Color Palette: Soft, muted, and slightly desaturated, Pastel-adjacent colors with low contrast, Cream, dusty rose, sage green, pale yellow, light blue, soft orange, Limited palette with intentional color blocking, No neon or overly vibrant colors. Lighting and Mood: Soft, diffused studio lighting, Gentle shadows that define form, No harsh highlights or dramatic contrast, Warm and inviting atmosphere, Calm and slightly whimsical mood. Composition: Central subject with generous negative space, Clean and uncluttered, Strong silhouette readability, Slight asymmetry for visual interest, Editorial or poster-style framing. Rendering Rules: No photorealism, No skin pores or fabric textures, No motion blur, No depth of field effects, Maintain a clean, stylized 3D look, High resolution with smooth surfaces.
`

const kids_prompt = `Create a 3D render with a playful, slightly surreal aesthetic, featuring a round, soft, and huggable mascot character (like a friendly blob or whimsical animal) interacting with [INSERT YOUR PRODUCT] with pure curiosity and joy. The image should feel like a frame from a high-quality animated short—safe, inviting, and magical. Drawing Style: 3D digital render with soft, rounded forms, Smooth surfaces with subtle imperfections, No hard edges or sharp geometry, Avoid overly realistic skin or textures, Focus on shape and form over surface detail. Quirk and Character: Subject has wide, friendly eyes and an expressive face, Awkward or bouncy pose, Humor comes from visual irony or unexpected details, Avoid slapstick or childish cartoon tropes, Character feels quietly amused or introspective. Color Palette: Soft, muted, and slightly desaturated, Pastel-adjacent colors with low contrast, Cream, dusty rose, sage green, pale yellow, light blue, soft orange, Limited palette with intentional color blocking, No neon or overly vibrant colors. Lighting and Mood: Soft, diffused studio lighting, Gentle shadows that define form, No harsh highlights or dramatic contrast, Warm and inviting atmosphere, Calm and slightly whimsical mood. Composition: Central subject with generous negative space, Clean and uncluttered, Strong silhouette readability, Slight asymmetry for visual interest, Editorial or poster-style framing. Rendering Rules: No photorealism, No skin pores or fabric textures, No motion blur, No depth of field effects, Maintain a clean, stylized 3D look, High resolution with smooth surfaces.
`

const kids_fomo_prompt = `Create a hand-drawn quirky illustration on a solid black background with a playful, expressive, slightly surreal aesthetic. The artwork should feel clever, character-driven, and imperfect, as if sketched by hand with confidence and humor.Subject: A group of three quirky, confident characters standing together. One central character is holding [INSERT YOUR PRODUCT] and glowing with subtle confidence, while the other two characters look at the product with exaggerated expressions of awe and "want." The scene captures the feeling of a "limited drop" or having the coolest new thing on the playground. Drawing Style: Hand-drawn ink or marker illustration, Imperfect, organic linework with visible human strokes, Slight wobble and variation in line thickness, No vector precision, no digital cleanliness, Sketchbook or zine-style energy. Quirk and Character: Exaggerated but restrained proportions, Expressive faces, awkward poses, or odd details, Humor comes from subtle visual irony, Characters or objects feel thoughtful, confused, amused, or quietly weird, Avoid slapstick or childish cartoon tropes. Color Palette: Black background is dominant and untouched, Limited, high-contrast colors only, Accent colors: off-white, muted yellow, dull pink, teal, light blue, soft orange, Use color sparingly to create focal points, No gradients or neon effects. Texture and Fill: Flat fills with occasional rough shading, Dry-brush, crayon, or chalk-like texture allowed, White ink or muted color strokes pop against black, Visible grain or paper-like texture encouraged. Composition: Central subject with generous negative space, Strong silhouette readability, Slight asymmetry for visual interest, Poster or editorial-style framing. Mood and Tone: Quirky, clever, and slightly introspective, Calm humor, not chaos, Feels like indie illustration or editorial art, Contemporary, expressive, and human. Rendering Rules: No photorealism, No 3D rendering, No cinematic lighting, No glossy or polished effects, Maintain a flat, hand-crafted look, High resolution with visible line texture.
`

const fomo_saas_hero_prompt = `
Create a high-impact editorial illustration for a modern SaaS landing page hero that subtly communicates momentum, exclusivity, and quiet urgency. The image should make viewers feel like something important is already happening—and they’re just on the edge of joining it.

Visual Style and Form:
Clean, contemporary illustration or stylized 3D (only if it enhances clarity),
Simplified forms with intentional restraint,
No visual clutter, no gimmicks,
The design should feel product-led, not marketing-led.

Narrative and Concept:
Imply progress, adoption, or activation without showing crowds,
Visual metaphors like flowing signals, connected nodes, dashboards coming alive, or systems aligning,
The scene should feel “in motion,” but frozen at a decisive moment,
Avoid literal clocks, countdowns, or overused urgency symbols.

Color Palette:
Controlled, confident palette,
Deep neutrals (charcoal, midnight blue, graphite),
Accents of calm optimism: muted teal, soft blue, pale green, off-white,
High contrast through color blocking, not gradients or glow effects.

Lighting and Mood:
Soft, directional lighting that highlights the core subject,
No dramatic or cinematic lighting,
Mood should feel focused, confident, and quietly urgent,
Feels like a calm room where serious work is happening.

Composition:
Strong central focus with generous negative space for headline copy,
Clear visual hierarchy,
Elements subtly point inward, drawing the eye toward the core message,
Editorial, homepage-ready framing.

Marketing Psychology:
Feels like “people like you are already using this,”
Signals traction, credibility, and inevitability,
Creates FOMO through implication, not pressure,
Trust-first, urgency-second.

Rendering Rules:
No photorealism,
No neon, no gradients, no hype visuals,
No mascots or playful cartoons,
High resolution, sharp silhouettes, brand-safe.
`

const genz_buzz_prompt = `
Create a visually sharp, culturally fluent illustration that feels native to Gen Z digital spaces without trying to perform Gen Z slang, humor, or trends. The image should feel effortlessly cool, self-aware, and aesthetically intentional.

Visual Style:
Indie-editorial illustration or lo-fi inspired digital art,
Intentional imperfections, slightly raw but curated,
Feels like something discovered, not advertised,
Avoid meme formats, emojis, or internet clichés.

Character and Expression:
Characters feel detached, observant, or mildly amused,
Minimal facial expressions—cool, neutral, unbothered,
No exaggerated emotions or forced relatability,
The vibe is “I noticed this,” not “look at me.”

Color Palette:
Muted but expressive,
Charcoal, off-white, dusty lavender, sage, washed blue, soft brown,
Low saturation with strong contrast,
No neon, no gradient overload.

Composition:
Asymmetrical, slightly off-center framing,
Negative space feels intentional,
Designed to look good cropped, screenshotted, or reposted,
Poster-like composition with visual confidence.

Cultural Signal:
Feels design-forward, not trend-chasing,
Could live on a landing page, a Notion cover, or an aesthetic Instagram carousel,
Respects Gen Z intelligence and visual literacy.

Marketing Impact:
Creates buzz by taste, not volume,
Signals that the brand “gets it” without saying so,
Feels shareable without asking to be shared,
Quietly distinctive and memorable.
`


const premium_fintech_prompt = `
Create a premium, minimal visual for a fintech product that communicates trust, stability, and authority without feeling cold or intimidating. The image should feel calm, composed, and quietly powerful.

Visual Style:
Minimalist illustration or restrained stylized 3D,
Strong structure, clean geometry,
No decorative elements without purpose,
Feels engineered, precise, and dependable.

Color Palette:
Deep, grounded tones: navy, charcoal, slate gray,
Soft accents: muted gold, warm beige, off-white,
Very limited palette,
No bright colors, no saturation spikes.

Lighting and Mood:
Even, soft lighting with no harsh contrast,
No dramatic shadows,
Mood feels steady, composed, and reassuring,
The kind of calm associated with financial confidence.

Composition:
Balanced, symmetrical or near-symmetrical layout,
Strong vertical or horizontal alignment,
Clear visual order and hierarchy,
Plenty of negative space for clarity.

Psychological Signal:
Feels safe to trust with money,
Suggests long-term thinking, not quick wins,
Authority without arrogance,
Modern, but not trendy.

Rendering Rules:
No playful mascots,
No flashy charts or exaggerated growth arrows,
No visual noise,
High resolution, brand-safe, executive-level polish.
`


const apple_indie_editorial_prompt = `
Create a refined editorial illustration that blends Apple-level minimalism with indie creative sensibility. The visual should feel intentional, human, and quietly expressive.

Visual Style:
Ultra-clean composition with subtle character,
Hand-drawn or soft digital illustration,
Nothing excessive, nothing accidental,
Feels designed by someone with taste and restraint.

Color Palette:
Soft neutrals dominate,
Off-white, light gray, warm black,
One restrained accent color only (sage, soft blue, muted orange),
No gradients, no visual effects.

Composition:
Strong negative space,
Perfect balance between emptiness and meaning,
Central subject feels isolated but intentional,
Feels like a magazine cover or keynote slide.

Mood:
Calm, thoughtful, confident,
Emotion comes from simplicity, not drama,
Feels premium without feeling corporate.

Brand Signal:
Signals clarity of thought,
Feels “designed, not marketed,”
Timeless rather than trendy,
Creative credibility + product confidence.
`


const screenshot_worthy_prompt = `
Create a visually striking editorial illustration designed to be screenshotted, saved, and shared organically. The image should feel visually complete even when cropped or viewed without context.

Visual Style:
Strong shapes, bold composition,
Immediate visual hook within the first second,
High contrast through form, not color overload.

Composition:
Poster-like framing,
Clear focal point,
Works at full view and cropped square or vertical,
Negative space feels intentional and aesthetic.

Color Palette:
Limited but impactful,
Two to three colors max,
Strong tonal contrast,
No gradients or visual clutter.

Emotional Pull:
Feels clever, insightful, or quietly powerful,
Invites interpretation,
Feels like a visual quote without text.

Marketing Effect:
People save it because it feels valuable,
Shareable without CTA,
Signals intelligence and taste,
Feels like something worth keeping.
`


const quiet_confidence_prompt = `
Create a modern, editorial-style visual that communicates excitement through clarity, momentum, and intention—never through loud colors, exaggerated motion, or hype-driven visuals.

Visual Style:
Clean illustration or restrained stylized 3D,
Everything feels deliberate,
No unnecessary elements,
Confidence through simplicity.

Color Palette:
Neutral foundation,
One optimistic accent color only,
Muted, controlled, professional,
No neon, no glow effects.

Motion and Energy:
Implied motion through composition,
Directional lines, subtle flow,
No literal speed effects,
Feels like progress, not chaos.

Mood:
Optimistic, focused, assured,
Feels like a product that knows where it’s going,
No urgency panic,
No hype language visualized.

Marketing Impact:
Signals maturity and readiness,
Appeals to serious users and decision-makers,
Excitement that feels sustainable,
Trust-first, energy-second.
`


const institutional_trust_prompt = `
Create a clean, authoritative editorial-style visual that communicates stability, credibility, and long-term trust. The image should feel dependable, composed, and structurally sound—like a product trusted by serious teams and institutions.

Visual Style and Form:
Minimalist illustration or restrained stylized 3D only if necessary,
Strong geometry and clear structure,
No playful exaggeration or decorative elements,
Everything feels deliberate, engineered, and controlled.

Color Palette:
Deep, grounded neutrals dominate,
Charcoal, navy, slate gray, graphite,
Subtle accents in off-white, muted beige, or soft metallic tones,
No bright colors, no saturation spikes, no neon.

Lighting and Mood:
Even, neutral lighting,
No dramatic highlights or shadows,
Mood is calm, stable, and reassuring,
Feels like a well-lit, quiet professional environment.

Composition:
Balanced and symmetrical or near-symmetrical,
Clear visual hierarchy,
Strong negative space for clarity and focus,
Editorial, enterprise-ready framing.

Emotional and Business Signal:
Feels safe to rely on,
Signals maturity and longevity,
Suggests compliance, security, and seriousness,
Authority without intimidation.

Rendering Rules:
No photorealism,
No mascots or playful characters,
No visual noise or gimmicks,
High resolution, brand-safe, timeless.
`


const momentum_growth_prompt = `
Create a modern editorial visual that subtly communicates momentum, adoption, and progress. The image should feel like a system in motion—calm, aligned, and moving forward—without visual chaos or hype.

Visual Style:
Contemporary illustration or stylized 3D where form clarity matters,
Simplified shapes with directional intent,
No clutter, no unnecessary elements.

Narrative and Motion:
Implied movement through alignment, flow, or convergence,
Visual metaphors like signals syncing, paths aligning, elements activating,
The moment feels active but controlled,
Avoid literal arrows, charts, or speed effects.

Color Palette:
Neutral base with optimistic accents,
Soft blues, muted greens, warm off-white,
High contrast through composition, not effects,
No gradients, no glow.

Composition:
Central focus with subtle directional pull,
Elements guide the eye inward,
Generous negative space for headline copy,
Hero-section ready.

Psychological Impact:
Creates FOMO through implication,
Feels like others are already moving forward,
Progress without pressure,
Momentum without urgency panic.
`


const premium_minimal_prompt = `
Create a premium, minimal visual that communicates value, refinement, and restraint. The image should feel expensive through simplicity, not decoration.

Visual Style:
Ultra-clean illustration or soft stylized 3D,
Perfectly controlled forms,
No excess detail, no ornamentation,
Everything earns its place.

Color Palette:
Dominantly neutral,
Off-white, warm gray, soft black,
One subtle accent color at most,
No gradients, no visual effects.

Lighting and Texture:
Soft, even lighting,
Matte surfaces,
No shine, no gloss,
Feels tactile but understated.

Composition:
Strong negative space,
Central or isolated subject,
Feels like a luxury product ad or keynote slide,
Timeless framing.

Brand Signal:
Signals confidence and high standards,
Feels curated and intentional,
Suggests higher pricing without stating it,
Premium without being cold.

Rendering Rules:
No playful elements,
No trends,
No visual noise,
High-resolution, timeless aesthetic.
`


const calm_problem_solving_prompt = `
Create a calm, human-centered editorial illustration that communicates clarity, relief, and thoughtful problem-solving. The image should feel emotionally grounding and supportive.

Visual Style:
Soft illustration or hand-drawn-inspired digital art,
Organic but controlled linework,
Human scale and proportions,
No exaggeration or drama.

Characters and Emotion:
Characters appear thoughtful, focused, or gently relieved,
Subtle expressions only,
No forced smiles or cartoon emotions,
Feels emotionally intelligent.

Color Palette:
Warm neutrals dominate,
Beige, soft gray, muted blue, sage,
Low saturation,
Comforting and stable tones.

Composition:
Simple, open framing,
Breathing room around subjects,
Nothing feels rushed or crowded,
Editorial clarity.

Emotional Impact:
Reduces anxiety,
Feels like the product brings order and calm,
Signals understanding, not pressure,
Supportive, not salesy.
`


const internet_native_tasteful_prompt = `
Create a culturally aware, internet-native visual that feels modern and shareable without using trends, slang, or meme language. The image should feel effortlessly cool and visually fluent.

Visual Style:
Indie editorial illustration or lo-fi digital art,
Intentional imperfections,
Feels discovered, not advertised,
Avoid meme formats or UI clichés.

Tone and Expression:
Detached, observant, quietly confident,
Minimal emotional signaling,
No forced relatability.

Color Palette:
Muted, contemporary tones,
Charcoal, dusty lavender, washed blue, soft brown,
Strong contrast without brightness,
No neon, no gradients.

Composition:
Asymmetrical or off-center framing,
Poster-like structure,
Designed to look good when cropped or screenshotted,
Negative space feels intentional.

Cultural Signal:
Respects audience intelligence,
Feels design-forward, not trend-chasing,
Shareable without asking to be shared,
Modern, calm, and confident.
`


const future_ready_prompt = `
Create a forward-looking editorial visual that communicates innovation, clarity, and long-term vision. The image should feel modern and future-ready without looking speculative or sci-fi.

Visual Style:
Clean, contemporary illustration or stylized abstraction,
Structured and intentional forms,
No futuristic clichés.

Color Palette:
Cool neutrals dominate,
Soft blues, graphite, off-white,
Subtle contrast,
No neon, no glow effects.

Composition:
Open, spacious framing,
Feels expandable and scalable,
Strong sense of direction without literal symbols.

Mood:
Optimistic and composed,
Feels prepared, not experimental,
Visionary but grounded.

Brand Signal:
Signals long-term thinking,
Feels technologically current,
Future-ready without hype,
Credible innovation.
`

const fashion_identity_editorial_prompt = `
Create a bold editorial fashion visual that communicates identity, attitude, and self-expression. The image should feel like a magazine spread—not a product catalog.

Visual Style:
Editorial illustration or stylized photography-inspired art,
Strong poses and silhouettes,
Minimal background distraction.

Character and Attitude:
Subjects appear confident, composed, and self-aware,
Emotion is restrained but intentional,
No forced smiles or exaggerated gestures.

Color Palette:
Neutral base with intentional contrast,
Black, white, beige, muted accent colors,
Fashion-forward but timeless.

Composition:
Asymmetrical framing,
Strong negative space,
Feels like a campaign image,
Designed to stop scrolling.

Brand Signal:
This brand represents a lifestyle,
Feels expressive, not generic,
Encourages identity alignment,
Shareable and aspirational.
`

const food_craft_authentic_prompt = `
Create a warm, handcrafted visual that communicates authenticity, care, and craftsmanship. The image should feel real, personal, and slightly imperfect.

Visual Style:
Hand-drawn or artisanal-inspired illustration,
Organic shapes and textures,
Nothing overly polished.

Color Palette:
Earthy, warm tones,
Brown, beige, muted green, soft off-white,
Natural and grounded.

Texture:
Visible grain, paper texture, or hand-made feel,
No glossy or artificial finishes.

Composition:
Simple, honest framing,
Feels like a story, not an ad,
Human-scale and intimate.

Brand Signal:
Feels local or artisanal,
Builds emotional trust,
Signals quality through care,
Authenticity over mass production.
`

const fashion_drop_culture_prompt = `
Create a visually intense, culture-driven visual that communicates exclusivity, limited availability, and underground appeal. The image should feel like a drop, not a product launch.

Visual Style:
Raw editorial illustration or gritty stylized art,
Intentional roughness,
Feels underground, not commercial.

Color Palette:
Dark base with sharp contrast,
Black, deep gray, muted accent colors,
High contrast without neon overload.

Composition:
Bold framing,
Tight crops or dramatic negative space,
Feels urgent and intentional.

Mood and Psychology:
Exclusive, not inclusive,
Feels time-bound,
Encourages immediate attention,
Designed to trigger drop FOMO.
`

const fashion_aspirational_minimal_prompt = `
Create a premium, minimal fashion visual that feels elevated, refined, and aspirational. The image should communicate quality through restraint.

Visual Style:
Ultra-clean composition,
Minimal props or environment,
Sharp focus on form and silhouette.

Color Palette:
Soft neutrals dominate,
Off-white, charcoal, warm gray,
One subtle accent color maximum.

Lighting:
Soft, diffused lighting,
No harsh contrast,
Feels like a luxury showroom.

Composition:
Centered or carefully balanced framing,
Strong negative space,
Feels calm, expensive, and intentional.

Marketing Impact:
Signals premium pricing,
Encourages desire without shouting,
Feels timeless and high-quality,
Luxury through simplicity.
`
const bold_dark_grooming_prompt = `
Create a bold, dark, premium visual representing a modern grooming brand rooted in confidence, discipline, and self-respect. The image should feel powerful, controlled, and intentional—never flashy, never aggressive.

Visual Style and Form:
Editorial-grade illustration or restrained stylized realism,
Strong, sculptural forms with clear structure,
Minimal elements, nothing decorative without purpose,
Feels like a high-end grooming campaign, not a lifestyle ad.

Color Palette:
Dark, dominant tones lead the composition,
Deep black, charcoal, graphite, gunmetal gray,
Accents allowed only in muted metallics (brushed silver, dull gold, bronze) or deep earthy tones,
No bright colors, no neon, no saturation spikes.

Lighting and Mood:
Low-key, directional lighting,
Controlled highlights that define form and texture,
Strong contrast with intentional shadow presence,
Feels intimate, moody, and confident—like a private grooming ritual.

Texture and Finish:
Matte surfaces dominate,
Subtle grain, leather-like, stone, or brushed-metal textures allowed,
No glossy or plastic finishes,
Everything feels tactile, solid, and premium.

Composition:
Central hero subject (product, silhouette, or symbolic form),
Strong negative space,
Bold silhouette readability even in low light,
Poster-like framing suitable for packaging, banners, and campaigns.

Masculinity & Brand Tone:
Masculinity expressed through restraint, not aggression,
Feels disciplined, composed, and self-assured,
No exaggerated toughness, no clichés,
Modern, refined, and intentional masculinity.

Marketing & Consumer Signal:
Signals premium quality and authority,
Feels trustworthy and ritual-driven,
Encourages brand loyalty over impulse buying,
Designed to elevate grooming into a personal standard.

Rendering Rules:
No playful elements,
No cartoon styling,
No over-polished or glossy effects,
No loud typography cues implied,
High resolution, dark-first, brand-safe, timeless.
`



const assetPrompts = {
    hand_drawn_prompt,
    three_d_prompt,
    moody_prompt,
    dark_3d_prompt,
    genZ_prompt,
    kids_prompt,
    kids_fomo_prompt, // Creepy prompt :|
    internet_native_tasteful_prompt,
    future_ready_prompt,
    quiet_confidence_prompt,
    premium_minimal_prompt,
    calm_problem_solving_prompt,
    momentum_growth_prompt,
    screenshot_worthy_prompt,
    fashion_identity_editorial_prompt,
    food_craft_authentic_prompt,
    fashion_drop_culture_prompt,
    fashion_aspirational_minimal_prompt,
    bold_dark_grooming_prompt

};

export default assetPrompts;