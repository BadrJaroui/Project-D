import Image from "next/image";
import Link from "next/link";
//rel noopener and norefferer done for security purposes (protects your tab and removes referer header)

export default function TopBanner() {
    return (
        <div className="w-full bg-[#111] text-white flex items-center justify-between px-6 py-3 border-b border-gray-700 shadow-sm">
            <div className="flex items-center space-x-4">
                <Image src="/NDWLogo.svg" alt="NDW Logo" width={120} height={120} />
                <span className="text-lg font-semibold mt-[10px]">Nationaal Dataportaal Wegverkeer</span>
            </div>
            <nav className="hidden md:flex space-x-6 text-sm text-gray-300">
                <a href="https://www.ndw.nu" target="_blank" rel="noopener noreferrer" className="text-[#f15a22]">NDW Website</a>
                <Link href="/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Chat</Link>
                <a href="https://www.ndw.nu/contact" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Contact</a>
                <Link href ="/uploadpage" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Upload File</Link>
            </nav>
        </div>
    );
}
