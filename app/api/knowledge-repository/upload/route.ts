import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { FileReference } from "@/lib/types";

export async function POST(req: Request) {
    const formData = await req.formData();
    const files = formData.getAll("documents") as File[];

    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const savedFiles: FileReference[] = [];

    for (const file of files) {
        const filePath = path.join(uploadDir, file.name);
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(filePath, buffer);

        // Generate public URL for the uploaded file
        const publicUrl = `${process.env.BASE_URL}/uploads/${file.name}`;
        savedFiles.push({ fileUri: publicUrl, mimeType: file.type });
    }

    return NextResponse.json({ message: "Files uploaded successfully!", files: savedFiles });
}
