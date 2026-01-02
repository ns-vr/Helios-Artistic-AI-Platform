import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const filterPrompts: Record<string, string> = {
  'van-gogh': 'Transform this portrait into Vincent van Gogh\'s distinctive post-impressionist style with swirling brushstrokes, bold colors, and expressive texture like Starry Night',
  'impressionist': 'Apply Claude Monet\'s impressionist style with soft, dappled light, loose brushstrokes, and pastel color palette',
  'surreal': 'Transform into Salvador Dali\'s surrealist style with dreamlike, melting elements and unexpected juxtapositions',
  'pop-art': 'Convert to Andy Warhol\'s pop art style with bold colors, high contrast, and repetitive patterns',
  'renaissance': 'Transform into Italian Renaissance style with classical lighting, sfumato technique, and golden proportions',
  'anime': 'Convert to Japanese anime style with large expressive eyes, clean lines, and vibrant colors',
  'watercolor': 'Apply delicate watercolor painting style with soft washes, visible paper texture, and flowing colors',
  'oil-painting': 'Transform into classical oil painting with rich textures, dramatic lighting, and deep colors'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, filterType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const filterPrompt = filterPrompts[filterType] || filterPrompts['impressionist'];
    console.log(`Applying ${filterType} filter to avatar`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: filterPrompt },
              { type: "image_url", image_url: { url: imageUrl } }
            ]
          }
        ],
        modalities: ["image", "text"]
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const filteredImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!filteredImageUrl) {
      throw new Error("Failed to apply filter");
    }

    return new Response(
      JSON.stringify({ imageUrl: filteredImageUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in apply-avatar-filter:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
