import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
const openai = createOpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});
export async function generatePrompt(args: {
  userQuery: string;
  pageContent: string;
}) {
  const { pageContent, userQuery } = args;
  return `Based on this context: "${pageContent}"\n\nAnswer this question: "${userQuery}"`;
}

export async function callModel(prompt: string) {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
    });
    return text;
  } catch (error) {
    console.error("Error calling model:", error);
    throw error;
  }
}
