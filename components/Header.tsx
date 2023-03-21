import Link from "next/link";

export default function Header() {
    return (
        <header className="flex justify-between items-center w-full mt-5 pb-2 sm:px-4 px-2">
            <Link href="/" className="flex space-x-3">
                <h1 className="sm:text-2xl text-xl font-bold ml-2 text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500">
                    twitter<span className="text-purple-400 p-0.5">.</span>
                    Bio
                </h1>
            </Link>
        </header>
    );
}
