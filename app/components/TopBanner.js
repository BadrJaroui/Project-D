import Image from "next/image";
import HamburgerMenu from "./HamburgerMenu";
//rel noopener and norefferer done for security purposes (protects your tab and removes referer header)

export default function TopBanner() {
  return (
    <div className="w-full bg-white dark:bg-black text-gray-900 dark:text-white flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300">
      <div className="flex items-center space-x-4">
        <Image src="/NDWLogo.svg" alt="NDW Logo" width={120} height={120} />
        <span className="text-lg font-semibold mt-[10px]">
          Nationaal Dataportaal Wegverkeer
        </span>
      </div>
      <nav className="hidden md:flex space-x-6 text-sm text-gray-500 dark:text-gray-300 items-center">
        <a
          href="https://www.ndw.nu"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#f15a22]"
        >
          NDW Website
        </a>
        <a
          href="https://www.ndw.nu/contact"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-900 dark:hover:text-white transition"
        >
          Contact
        </a>
        <HamburgerMenu />
      </nav>
    </div>
  );
}
