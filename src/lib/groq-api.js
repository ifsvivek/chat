// src/lib/groq-api.js
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getGroqChatCompletion(message) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama3-8b-8192",
    });

    return chatCompletion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error calling Groq API:", error);
    return "Sorry, I encountered an error. Please try again.";
  }
}