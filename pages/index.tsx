import type { NextPage } from "next";
import Head from "next/head";
import { useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { VibeType } from "../components/DropDown";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";

const Home: NextPage = () => {
    const [loading, setLoading] = useState(false);
    const [bio, setBio] = useState("");
    const [vibe, setVibe] = useState<VibeType>("Professional");
    const [generatedBios, setGeneratedBios] = useState<String>("");

    const bioRef = useRef<null | HTMLDivElement>(null);

    const scrollToBios = () => {
        if (bioRef.current !== null) {
            bioRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const prompt = `Generate 2 ${vibe} twitter biographies with no hashtags and clearly labeled "1.", "2.". ${
        vibe === "Funny"
            ? "Make sure there is a joke in there and it's a little ridiculous."
            : null
    }
      Make sure each generated biography is less than 160 characters, has short sentences that are found in Twitter bios, and base them on this context: ${bio}${
        bio.slice(-1) === "." ? "" : "."
    }`;

    const generateBio = async (e: any) => {
        e.preventDefault();
        if (!bio) {
            toast.error("Input some words about you!");
            return;
        }
        setGeneratedBios("");
        setLoading(true);
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt,
            }),
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        // This data is a ReadableStream
        const data = response.body;
        if (!data) {
            return;
        }

        const reader = data.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunkValue = decoder.decode(value);
            setGeneratedBios((prev) => prev + chunkValue);
        }
        scrollToBios();
        console.log(generatedBios);
        setLoading(false);
    };

    return (
        <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
            <Head>
                <title>Twitter Bio Generator</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />
            <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
                <h1 className="sm:text-6xl text-4xl max-w-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500">
                    Revolutionize Your Twitter Presence with AI-Generated Bios
                </h1>
                <div className="max-w-xl w-full">
                    <div className="flex mt-10 items-center space-x-3">
                        <p className="text-left font-medium">
                            <span className="font-extrabold mr-1">1.</span>
                            Write a few sentences about yourself.
                        </p>
                    </div>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                        className="w-full text-gray-800 rounded border-gray-300 focus:border-purple-600 focus:ring-purple-600 my-5"
                        placeholder={""}
                    />
                    <div className="flex mb-5 items-center space-x-3">
                        <p className="text-left font-medium">
                            <span className="font-extrabold mr-1">2.</span>
                            Select your style.
                        </p>
                    </div>
                    <div className="block">
                        <DropDown
                            vibe={vibe}
                            setVibe={(newVibe) => setVibe(newVibe)}
                        />
                    </div>
                    {!loading && (
                        <button
                            className="bg-purple-700 rounded text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-purple-600 w-full"
                            onClick={(e) => generateBio(e)}
                        >
                            Generate your bio &rarr;
                        </button>
                    )}
                    {loading && (
                        <button
                            className="bg-purple-500 rounded text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-purple-600 w-full"
                            disabled
                        >
                            <LoadingDots color="white" style="large" />
                        </button>
                    )}
                </div>
                <Toaster
                    position="top-right"
                    reverseOrder={false}
                    toastOptions={{ duration: 2000 }}
                />
                <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
                <div className="space-y-10 my-10">
                    {generatedBios && (
                        <>
                            <div>
                                <h2
                                    className="sm:text-4xl text-3xl font-bold text-slate-100 mx-auto"
                                    ref={bioRef}
                                >
                                    Feel free to choose from below
                                </h2>
                            </div>
                            <div className="space-y-8 grid grid-cols-2 gap-12 max-w-xl mx-auto">
                                {generatedBios
                                    .substring(generatedBios.indexOf("1") + 3)
                                    .split("2.")
                                    .map((generatedBio) => {
                                        return (
                                            <div
                                                className="bg-slate-800 rounded-md shadow-md p-4 hover:bg-gray-900 transition cursor-pointer border border-slate-800"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(
                                                        generatedBio
                                                    );
                                                    toast.success(
                                                        "Bio copied to your clipboard"
                                                    );
                                                }}
                                                key={generatedBio}
                                            >
                                                <p>{generatedBio}</p>
                                            </div>
                                        );
                                    })}
                            </div>
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Home;
