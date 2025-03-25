'use client';

import React, { useState } from 'react';

export default function KnowledgeRepositoryPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFiles(Array.from(event.target.files));
        }
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        files.forEach((file) => formData.append('documents', file));

        setUploadStatus('Uploading...');
        const response = await fetch('/api/knowledge-repository/upload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            setUploadStatus('Files uploaded successfully!');
        } else {
            setUploadStatus('Error uploading files.');
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Knowledge Repository</h1>
            <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="mb-4 border p-2"
            />
            <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Upload Documents
            </button>
            {uploadStatus && <p className="mt-4">{uploadStatus}</p>}
        </div>
    );
}
