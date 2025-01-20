import { ChatGroq } from '@langchain/groq';
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { GROQ_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import { PromptTemplate } from "@langchain/core/prompts";
import { AVAILABLE_MODELS } from '$lib/constants';

let model;
let chain;
let memory;

export async function POST({ request }) {
    try {
        const { message, history, modelId } = await request.json();

        // Initialize new model instance if model changed
        model = new ChatGroq({
            model: modelId || 'llama3-8b-8192',
            apiKey: GROQ_API_KEY
        });

        const prompt = PromptTemplate.fromTemplate(`
            {system_message}
            Current conversation:
            {chat_history}
            Human: {input}
            Assistant: `);

        memory = new BufferMemory({
            returnMessages: true,
            memoryKey: "chat_history",
            inputKey: "input"
        });

        chain = new ConversationChain({
            llm: model,
            memory: memory,
            prompt,
            inputKeys: ["input", "system_message"]
        });

        if (history?.length > 0) {
            await memory.clear();
            for (let i = 0; i < history.length - 1; i += 2) {
                const userMessage = new HumanMessage(history[i].content);
                const aiMessage = new AIMessage(history[i + 1].content);
                await memory.chatHistory.addMessage(userMessage);
                await memory.chatHistory.addMessage(aiMessage);
            }
        }

        const response = await chain.call({
            input: message,
            system_message: "You are a helpful AI assistant. Be concise and clear in your responses."
        });

        return json({ message: response.response });
    } catch (error) {
        console.error('Error:', error);
        return json({ error: 'Failed to get response' }, { status: 500 });
    }
}