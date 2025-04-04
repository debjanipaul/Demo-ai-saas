// import { NextResponse } from "next/server";
// import fs from "fs";
// import path from "path";
// import { FileReference } from "@/lib/types";

// export async function POST(req: Request) {
//     const formData = await req.formData();
//     const files = formData.getAll("documents") as File[];

//     const uploadDir = path.join(process.cwd(), "public/uploads");
//     if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

//     const savedFiles: FileReference[] = [];

//     for (const file of files) {
//         const filePath = path.join(uploadDir, file.name);
//         const buffer = Buffer.from(await file.arrayBuffer());
//         fs.writeFileSync(filePath, buffer);

//         // Generate public URL for the uploaded file
//         const publicUrl = `${process.env.BASE_URL}/uploads/${file.name}`;
//         savedFiles.push({ fileUri: publicUrl, mimeType: file.type });
//     }

//     return NextResponse.json({ message: "Files uploaded successfully!", files: savedFiles });
// }


import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { FileReference } from "@/lib/types";

const uploadDir = path.join(process.cwd(), "public/uploads");

// GET all documents
export async function GET() {
    try {
        if (!fs.existsSync(uploadDir)) return NextResponse.json([]);

        const files = fs.readdirSync(uploadDir).map(file => ({
            name: file,
            url: `${process.env.BASE_URL}/uploads/${file}`
        })).filter(file => fs.statSync(path.join(uploadDir, file.name)).isFile());

        return NextResponse.json(files);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch files" },
            { status: 500 }
        );
    }
}

// POST upload documents
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

// DELETE document
export async function DELETE(req: Request) {
    try {
        const { filename } = await req.json();
        const filePath = path.join(uploadDir, filename);

        if (!fs.existsSync(filePath)) {
            return NextResponse.json(
                { error: "File not found" },
                { status: 404 }
            );
        }

        fs.unlinkSync(filePath);
        return NextResponse.json({ message: "File deleted successfully" });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete file" },
            { status: 500 }
        );
    }
}
