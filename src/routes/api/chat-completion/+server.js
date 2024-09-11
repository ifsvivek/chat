import Groq from "groq-sdk";
import { GROQ_API_KEY } from '$env/static/private';

const groq = new Groq({ apiKey: GROQ_API_KEY });

export async function POST({ request }) {
    try {
        const { content } = await request.json();
        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: content,
                },
            ],
            model: "llama3-70b-8192",
        });
        return new Response(JSON.stringify(response), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error in POST /api/chat-completion:", error);
        return new Response(
            JSON.stringify({ error: "An error occurred. Please try again later." }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
}