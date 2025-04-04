// 'use client';

// import React, { useState } from 'react';

// export default function KnowledgeRepositoryPage() {
//     const [files, setFiles] = useState<File[]>([]);
//     const [uploadStatus, setUploadStatus] = useState<string | null>(null);

//     const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//         if (event.target.files) {
//             setFiles(Array.from(event.target.files));
//         }
//     };

//     const handleSubmit = async () => {
//         const formData = new FormData();
//         files.forEach((file) => formData.append('documents', file));

//         setUploadStatus('Uploading...');
//         const response = await fetch('/api/knowledge-repository/upload', {
//             method: 'POST',
//             body: formData,
//         });

//         if (response.ok) {
//             setUploadStatus('Files uploaded successfully!');
//         } else {
//             setUploadStatus('Error uploading files.');
//         }
//     };

//     return (
//         <div className="p-4">
//             <h1 className="text-2xl font-bold mb-4">Knowledge Repository</h1>
//             <input
//                 type="file"
//                 multiple
//                 onChange={handleFileUpload}
//                 className="mb-4 border p-2"
//             />
//             <button
//                 onClick={handleSubmit}
//                 className="bg-blue-500 text-white px-4 py-2 rounded"
//             >
//                 Upload Documents
//             </button>
//             {uploadStatus && <p className="mt-4">{uploadStatus}</p>}
//         </div>
//     );
// }



'use client';

import React, { useState, useEffect } from 'react';
import { Heading } from "@/components/heading";
import { SquareLibrary } from "lucide-react";

interface Document {
    name: string;
    url: string;
}

export default function KnowledgeRepositoryPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch documents on mount and after changes
    const refreshDocuments = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/knowledge-repository/upload');
            const data = await response.json();
            setDocuments(data);
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        refreshDocuments();
    }, []);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFiles(Array.from(event.target.files));
        }
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        files.forEach((file) => formData.append('documents', file));

        setUploadStatus('Uploading...');
        try {
            const response = await fetch('/api/knowledge-repository/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setUploadStatus('Files uploaded successfully!');
                await refreshDocuments();
                setFiles([]);
            } else {
                setUploadStatus('Error uploading files.');
            }
        } catch (error) {
            setUploadStatus('Error uploading files.');
        }
    };

    const handleDelete = async (filename: string) => {
        if (confirm(`Are you sure you want to delete ${filename}?`)) {
            try {
                const response = await fetch('/api/knowledge-repository/upload', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ filename }),
                });

                if (response.ok) {
                    await refreshDocuments();
                } else {
                    alert('Error deleting file');
                }
            } catch (error) {
                console.error('Delete error:', error);
                alert('Error deleting file');
            }
        }
    };

    return (
        <div className="p-4 max-w-4xl mx-auto ">
            <div className='flex items-center justify-center h-full text-center mt-[4rem]'>
                <Heading
                    title="Knowledge Repository"
                    description=""
                    icon={SquareLibrary}
                    iconColor="text-violet-300"
                    bgColor="bg-violet-400/10"
                />
            </div>
            {/*      */}

            {/* Upload Section */}
            <div className="mb-8 border-b pb-4 ">
                <div className='flex items-center justify-center h-full text-center'>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="border p-2 rounded"
                    />
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2 ml-4"
                    >
                        Upload Documents
                    </button>
                    {/* <button
                    onClick={refreshDocuments}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                    Refresh List
                </button> */}
                </div>
                {uploadStatus && <p className="mt-2 text-sm">{uploadStatus}</p>}
            </div>

            {/* Documents Table */}
            {loading ? (
                <p>Loading documents...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-2 text-left">Title</th>
                                <th className="border border-gray-300 p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((doc) => (
                                <tr key={doc.name}>
                                    <td className="border border-gray-300 p-2">
                                        <a
                                            href={doc.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {doc.name}
                                        </a>
                                    </td>
                                    <td className="border border-gray-300 p-2 text-center">
                                        <button
                                            onClick={() => handleDelete(doc.name)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {documents.length === 0 && !loading && (
                        <p className="mt-4 text-gray-500">No documents found</p>
                    )}
                </div>
            )}
        </div>
    );
}
