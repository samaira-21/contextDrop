"use server";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateEmbedding } from "@/lib/gemini";
import { db } from "@/server/db";
import "dotenv/config";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function askQuestion(question: string, projectId: string) {
  const queryVector = await generateEmbedding(question);
  const vectorQuery = `[${queryVector.join(",")}]`;

  const result = (await db.$queryRaw`
        SELECT "fileName", "sourceCode", "summary", 1-("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
        FROM "SourceCodeEmbedding" 
        WHERE "summaryEmbedding" IS NOT NULL
        AND "projectId" = ${projectId} 
        ORDER BY similarity DESC NULLS LAST
        LIMIT 10
        `) as { fileName: string; sourceCode: string; summary: string; similarity: number }[];

  console.info("Question retrieval completed", {
    projectId,
    matchCount: result.length,
    topSimilarity: result[0]?.similarity ?? null,
  });

  if (result.length === 0) {
    return {
      answer:
        "I couldn't find any indexed source code for this project. Reconnect or re-index the GitHub repository, then try again.",
      filesReferences: result,
    };
  }

  let context = "";

  for (const doc of result) {
    context += `source: ${doc.fileName}\n code content: ${doc.sourceCode}\n summary of file: ${doc.summary}\n\n`;
  }

  try {
    const { text: answer, finishReason, usage } = await generateText({
        model: google("gemini-2.5-flash"),
        prompt: `You are an ai assistant who answers questions about codebase. Your target audience is a technical intern who is trying to understand the codebase.
                    AI assistant is a brand new, powerful, human-like artificial intelligence.
                    The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
                    AI is a well-behaved and well-mannered individual.
                    AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
                    AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in the world.
                    If the question is asking about the code or a specific file, AI will provide the detailed answer, giving step by step instructions and explanations.
                    START CONTEXT BLOCK
                    ${context}
                    END CONTEXT BLOCK
                    
                    START QUESTION
                    ${question}
                    END OF QUESTION
                    AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
                    If the context does not provide the answer to the question, the AI assistant will say, "I am sorry, but I don't know the answer."
                    AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
                    AI assistant will not invent anything that is not drawn directly from the context.
                    Answer in markdown syntax, with code snippets if needed. Be as detailed as possible when answering, make sure there is new information in the answer.`,
      });
    if (!answer.trim()) {
      console.error("Gemini completed without answer text", {
        projectId,
        finishReason,
        usage,
      });
    }
    return { answer, filesReferences: result };
  } catch (error) {
    console.error("Failed to generate question answer", error);
    throw error;
  }
}
