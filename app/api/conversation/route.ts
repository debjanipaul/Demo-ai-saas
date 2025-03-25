import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Define interfaces for messages, documents, and citations
interface GeminiMessage {
    role: "user" | "model";
    content: string;
}

interface DocumentFile {
    fileName: string;
    mimeType: string;
    content?: string; // Add content to store extracted text
}

// interface UploadedFile {
//     fileName: string;
//     mimeType: string;
// }

interface Citation {
    startIndex?: number;
    endIndex?: number;
    uri?: string;
    title?: string;
    license?: string;
    publicationDate?: {
        year?: number;
        month?: number;
        day?: number;
    };
}

interface CitationMetadata {
    citations?: Citation[];
}

// Environment variables
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!;
// const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

if (!GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY environment variable is not set.");
}

// Function to scan the uploads directory and extract text from files
async function scanUploadsDirectory(): Promise<DocumentFile[]> {
    const uploadsDir = path.join(process.cwd(), "public/uploads");

    if (!fs.existsSync(uploadsDir)) {
        console.warn(`Uploads directory does not exist: ${uploadsDir}`);
        return [];
    }

    const files = fs.readdirSync(uploadsDir);
    const documentFiles: DocumentFile[] = [];

    for (const file of files) {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);

        if (stats.isFile()) {
            const ext = path.extname(file).toLowerCase();
            let mimeType = "text/plain"; // Default mime type

            if (ext === ".pdf") mimeType = "application/pdf";
            else if (ext === ".txt") mimeType = "text/plain";
            else if (ext === ".md") mimeType = "text/markdown";

            // Extract content from the file
            const content = await extractTextFromFile(filePath, mimeType);

            documentFiles.push({
                fileName: file,
                mimeType,
                content,
            });
        }
    }

    return documentFiles;
}

// Function to extract text from different file types
async function extractTextFromFile(filePath: string, mimeType: string): Promise<string> {
    try {
        if (mimeType === "text/plain" || mimeType === "text/markdown") {
            return fs.readFileSync(filePath, "utf-8");
        } else {
            console.log(`Text extraction for ${mimeType} not implemented yet`);
            return "";
        }
    } catch (error) {
        console.error(`Error extracting text from ${filePath}:`, error);
        return "";
    }
}

// Function to search for relevant documents based on a query
async function findRelevantDocuments(query: string, allDocuments: DocumentFile[]): Promise<DocumentFile[]> {
    const keywords = query
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length > 3);

    if (keywords.length === 0) return [];

    return allDocuments
        .filter((doc) => doc.content && keywords.some((keyword) => doc.content!.toLowerCase().includes(keyword)))
        .sort((a, b) => {
            const scoreA = keywords.filter((keyword) => a.content!.toLowerCase().includes(keyword)).length;
            const scoreB = keywords.filter((keyword) => b.content!.toLowerCase().includes(keyword)).length;

            return scoreB - scoreA; // Higher score first
        })
        .slice(0, 3); // Limit to top-3 documents
}

// Function to format responses with citations
function formatResponseWithCitations(text: string, citations?: Citation[]): string {
    if (!citations || citations.length === 0) return text;

    let formattedResponse = `${text}\n\nSources:\n`;
    citations.forEach((citation, index) => {
        formattedResponse += `[${index + 1}] ${citation.title || citation.uri || "Unknown source"}\n`;
    });

    return formattedResponse;
}

// POST API handler
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages } = body;

        // Validate messages
        if (!messages || !messages.length) {
            return NextResponse.json({ error: "Messages are required" }, { status: 400 });
        }

        // Get the latest user message
        const userMessages = messages.filter((message: GeminiMessage) => message.role === "user");
        const latestUserMessage = userMessages[userMessages.length - 1];

        if (!latestUserMessage || !latestUserMessage.content) {
            return NextResponse.json({ error: "Valid user message is required" }, { status: 400 });
        }

        const userQuery = latestUserMessage.content;

        // Scan the uploads directory to find all documents
        const allDocuments = await scanUploadsDirectory();

        // Find documents relevant to the user query
        const relevantDocuments = await findRelevantDocuments(userQuery, allDocuments);

        let contentParts;

        if (relevantDocuments.length > 0) {
            // Use knowledge repo documents as context
            const contextText = relevantDocuments.map((doc) => `---- Document: ${doc.fileName} ----\n${doc.content}`).join("\n\n");
            contentParts = [
                { text: `Based on the following documents:\n\n${contextText}\n\nQuestion: ${userQuery}` },
            ];
        } else {
            // Use LLM fallback when no relevant documents are found
            contentParts = [{ text: `Please answer the following question based on your knowledge:\n\n${userQuery}` }];
        }

        // Initialize Google Generative AI client
        const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY!);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: { temperature: 0.2, topP: 0.8, topK: 40, maxOutputTokens: 4096 },
        });

        // Generate response with multimodal content
        const result = await model.generateContent(contentParts);
        const response = result.response;

        let text = response.text();

        // Handle citations if available
        const candidateMetadata = response.candidates?.[0]?.citationMetadata as CitationMetadata;
        if (candidateMetadata?.citations) {
            text = formatResponseWithCitations(text, candidateMetadata.citations);
        }

        return NextResponse.json({ result: text });

    } catch (error) {
        console.error("Error calling Gemini API:", error);

        return NextResponse.json(
            { message: "An error occurred while processing your request.", error },
            { status: error instanceof Error && error.message.includes("context length") ? 413 : 500 }
        );
    }
}
