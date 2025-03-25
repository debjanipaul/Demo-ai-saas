import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiClient = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

/**
 * Generate embeddings for a batch of document contents.
 * @param contents Array of document contents as strings.
 * @returns Array of embedding vectors.
 */
export async function createBatchDocumentEmbeddings(contents: string[]) {
    // Get the embedding model
    const model = geminiClient.getGenerativeModel({
        model: 'text-embedding-004', // Replace with the correct model ID for embeddings
    });

    try {
        // Prepare requests for batch embedding
        const requests = contents.map((content) => ({
            content: {
                role: 'user', // Specify the role (e.g., "user")
                parts: [{ text: content }], // Properly structure the content field
            },
        }));

        // Generate embeddings using batchEmbedContents
        const result = await model.batchEmbedContents({ requests });

        // Extract and return embeddings
        return result.embeddings.map((embedding) => embedding.values); // Array of embedding vectors
    } catch (error) {
        console.error('Error generating batch embeddings:', error);
        throw new Error('Failed to generate batch embeddings');
    }
}
