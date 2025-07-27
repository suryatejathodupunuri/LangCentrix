export async function POST(req) {
  try {
    const { text, source, target } = await req.json();

    if (!text || !Array.isArray(text) || !source || !target) {
      return new Response(JSON.stringify({ error: "Missing or invalid input fields." }), {
        status: 400,
      });
    }

    const translations = [];

    for (const line of text) {
      try {
        const res = await fetch(
          `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              q: line,
              source,
              target,
              format: "text",
            }),
          }
        );

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Google API error:", errorText);
          translations.push("[Translation Failed]");
          continue;
        }

        const data = await res.json();
        const translatedText = data?.data?.translations?.[0]?.translatedText;
        translations.push(translatedText || "[Empty]");
      } catch (err) {
        console.error(" Error translating line:", line, err);
        translations.push("[Translation Failed]");
      }
    }

    return new Response(JSON.stringify({ translations }), {
      status: 200,
    });
  } catch (error) {
    console.error(" General Translation Error:", error.message);
    return new Response(JSON.stringify({ error: error.message || "Translation failed." }), {
      status: 500,
    });
  }
}
