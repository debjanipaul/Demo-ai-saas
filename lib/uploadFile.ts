import path from "path";
// import fs from "fs";

export async function uploadFile(filePath: string, mimeType: string): Promise<{ fileUri: string; mimeType: string }> {
    const fileName = path.basename(filePath); // Extract the file name
    const publicUrl = `${process.env.BASE_URL}/uploads/${fileName}`; // Construct public URL

    return {
        fileUri: publicUrl,
        mimeType,
    };
}
