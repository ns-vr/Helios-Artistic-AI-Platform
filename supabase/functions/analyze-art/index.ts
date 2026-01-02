import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, action } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (action === "analyze") {
      systemPrompt = `You are Helios Muse, an expert art historian and analyst. Analyze artworks with deep knowledge of:
- Art movements and styles (Impressionism, Cubism, Renaissance, etc.)
- Techniques (brushwork, color theory, composition, perspective)
- Historical context and significance
- Artist biographies and influences

Provide analysis in JSON format with these fields:
{
  "title": "Identified or suggested title",
  "artist": "Artist name or 'Unknown'",
  "period": "Art period/era",
  "style": "Art style/movement",
  "technique": "Primary techniques used",
  "colors": ["dominant", "colors", "used"],
  "mood": "Emotional tone",
  "composition": "Composition analysis",
  "historicalContext": "Historical significance",
  "interpretation": "Artistic interpretation",
  "funFact": "An interesting fact about this style or period",
  "similarWorks": ["Similar famous works to explore"]
}`;
      userPrompt = "Analyze this artwork in detail. Identify the style, technique, period, and provide historical context.";
    } else if (action === "chat") {
      const { message, context } = await req.json();
      systemPrompt = `You are Helios Muse, a peaceful and poetic AI assistant for the Helios art platform. You help users:
- Learn about art history, painters, and movements
- Understand artwork analysis results
- Navigate the app features (game, gallery, community)
- Explore creative inspiration

Keep responses warm, artistic, and helpful. Use gentle, encouraging language.`;
      userPrompt = message;
    }

    const messages: any[] = [
      { role: "system", content: systemPrompt }
    ];

    if (imageUrl && action === "analyze") {
      messages.push({
        role: "user",
        content: [
          { type: "text", text: userPrompt },
          { type: "image_url", image_url: { url: imageUrl } }
        ]
      });
    } else {
      messages.push({ role: "user", content: userPrompt });
    }

    console.log("Calling Lovable AI with action:", action);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    console.log("AI response received successfully");

    // Try to parse JSON from the response for analyze action
    if (action === "analyze") {
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const analysis = JSON.parse(jsonMatch[0]);
          return new Response(JSON.stringify({ analysis }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      } catch (e) {
        console.log("Could not parse JSON, returning raw content");
      }
    }

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Error in analyze-art function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
