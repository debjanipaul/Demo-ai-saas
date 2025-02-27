import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

// Define the message interface in the API route file as well
interface GeminiMessage {
    role: "user" | "model";
    content: string;
}

export async function POST(req: Request) { //use request instead of nextApiRequest
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: "GOOGLE_API_KEY environment variable is not set." }, { status: 500 });
    }

    const body = await req.json(); //parse request body
    const { messages } = body;

    if (!messages || !messages.length) {
        return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    // Get the latest user message instead of always using the first one
    const userMessages = messages.filter((message: GeminiMessage) => message.role === "user");
    const latestUserMessage = userMessages[userMessages.length - 1];

    if (!latestUserMessage || !latestUserMessage.content) {
        return NextResponse.json({ error: "Valid user message is required" }, { status: 400 });
    }

    const prompt = latestUserMessage.content;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ result: text });

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        if (error instanceof Error) {
            return NextResponse.json({ message: 'Error calling Gemini API', error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ message: 'Error calling Gemini API', error: 'Unknown error' }, { status: 500 });
        }
    }
}