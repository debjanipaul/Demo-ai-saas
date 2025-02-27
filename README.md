## Optimiste AI Saas App

This README provides instructions for setting up and running this Next.js application locally.

## Prerequisites
Before you begin, ensure you have the following:

1. Node.js (version v18.20.6)
2. Set up Clerk Secret Keys:
    a. Navigate to and Sign-up at https://clerk.com/
    b. Create Application - Application name: optimiste-ai-saas, Toggle-on: Email and Google
    c. Copy the following environment variables and paste them in the .env file.
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
        CLERK_SECRET_KEY       
3. Set up Google API Key
    a. Navigate to https://ai.google.dev/aistudio
    b. Click Get API Key > Create API Key
    c. Enter Project name
    d. Copy the API key to paste it in the .env file

## Getting Started
Follow these steps to download, install dependencies, and run the application locally.

1. Clone or download the repository Using Git
git clone https://github.com/debjanipaul/Demo-ai-saas.git
cd Demo-ai-saas

2. Install dependencies:

 npx shadcn@latest init
 npx shadcn@latest add button
 npm install @clerk/nextjs
 npx shadcn@latest add sheet
 npx shadcn@latest add card
 npx shadcn@latest add form
 npx shadcn@latest add input
 npm install axios
 npm install @google/generative-ai
 npx shadcn@latest add avatar
 npm i typewriter-effect --legacy-peer-deps

3. Environment Variables
Create a .env.local file in the root directory and add this variables:

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=[your-clerk-key]
CLERK_SECRET_KEY=[your-secret-key]

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL=/

GOOGLE_API_KEY=[Your-API-Key]

4. Run the development server

Start the development server:
npm run dev

The application should now be running on http://localhost:3000.
