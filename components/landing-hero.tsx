"use client";

import { useAuth } from "@clerk/nextjs";
import TypewriterComponent from "typewriter-effect";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const LandingHero = () => {
    const { isSignedIn } = useAuth();
    return (
        <div className="text-white font-bold py-36 text-center space-y-5">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
                <h1>Build your AI Assisted Enterprise </h1>
                <div className="text-sm md:text-xl font-light text-zinc-400 ">
                    We’re happy to assist you with..
                </div>
                <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-pink-500">
                    <TypewriterComponent
                        options={{
                            strings: [
                                "Autonomous Agents Development",
                                "Enterprise Consulting",
                                "Chatbot Development"
                            ],
                            autoStart: true,
                            loop: true
                        }}
                    />
                </div>
                <div>
                    <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
                        <Button className="md:text-lg p-4 md:p-6 rounded-full font-semibold text-white bg-gradient-to-r from-purple-800 to-pink-500">
                            Start Exploring
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}