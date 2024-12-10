import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full p-4 bg-black bg-opacity-10 backdrop-filter backdrop-blur-lg">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div>
          <p className="text-xs text-white/50 text-center sm:text-left">
            © 2024 AMPD-u Alpha-HackV0.3. All rights reserved.... just kidding
            this will be fully open sourced. 🤟
          </p>
        </div>
        <Link
          href="https://base.org"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 text-sm transition-colors duration-200"
        >
          <span className="text-xs text-black font-semibold">Built for</span>
          <Image
            src="/base-logo.png"
            alt="BASE Logo"
            width={60}
            height={24}
            className="object-contain"
          />
        </Link>
      </div>
    </footer>
  );
}
