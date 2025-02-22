import { OpenAIStream, StreamingTextResponse } from "ai";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const payload = {
    model: "gpt-4o-mini",
    stream: true,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
