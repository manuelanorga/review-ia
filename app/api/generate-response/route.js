import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { reviewText, reviewerName, stars, tone } = await request.json();

    const toneInstructions = {
      cercano: "Usa un tono cálido, cercano y amigable. Incluye emojis ocasionalmente. Habla de tú.",
      formal: "Usa un tono formal y respetuoso. Usa 'usted'. Sin emojis.",
      profesional: "Usa un tono profesional y directo. Sé conciso y claro. Sin emojis.",
    };

    const prompt = `Eres el community manager de un negocio en Lima, Perú. 
    
Debes responder la siguiente reseña de Google de manera ${tone}.

${toneInstructions[tone] || toneInstructions.cercano}

Información de la reseña:
- Nombre del cliente: ${reviewerName}
- Calificación: ${stars} de 5 estrellas
- Reseña: "${reviewText}"

Reglas importantes:
- La respuesta debe ser en español
- Máximo 3 oraciones
- Si la reseña es negativa (1-2 estrellas), muestra empatía y ofrece solución
- Si es positiva (4-5 estrellas), agradece y invita a volver
- Si es neutral (3 estrellas), agradece y menciona que mejorarán
- No menciones que eres una IA
- Firma como "El equipo de [nombre del negocio]" solo si es natural

Responde SOLO con el texto de la respuesta, sin explicaciones adicionales.`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const response = message.content[0].text;

    return Response.json({ response });

  } catch (error) {
    console.error("Error generando respuesta:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}