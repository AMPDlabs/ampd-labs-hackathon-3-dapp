import { useState } from "react";
import Link from "next/link";
import { FaTimes, FaReact, FaCss3Alt } from "react-icons/fa";
import { SiNextdotjs, SiTailwindcss, SiVite } from "react-icons/si";
import { TbBrandVscode } from "react-icons/tb";

const toolkits = [
  {
    name: "Next.js",
    url: "https://nextjs.org/",
    icon: SiNextdotjs,
  },
  {
    name: "React",
    url: "https://reactjs.org/",
    icon: FaReact,
  },
  {
    name: "Tailwind CSS",
    url: "https://tailwindcss.com/",
    icon: SiTailwindcss,
  },
  {
    name: "Wagmi",
    url: "https://wagmi.sh/",
    icon: FaCss3Alt,
  },
  {
    name: "Viem",
    url: "https://viem.sh/",
    icon: SiVite,
  },
  {
    name: "Onchain Kit",
    url: "https://github.com/coinbase/onchainkit",
    icon: TbBrandVscode,
  },
];

export default function SponsorshipAndToolkit() {
  const [isToolkitOpen, setIsToolkitOpen] = useState(false);

  const toggleToolkit = () => {
    setIsToolkitOpen(!isToolkitOpen);
  };

  return (
    <>
      {/* Toolkit slide-out window */}
      <div
        className={`fixed right-0 top-1/2 transform -translate-y-1/2 transition-transform duration-300 ease-in-out ${
          isToolkitOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ zIndex: 1000 }}
      >
        <div className="backdrop-blur-xl opacity-65 bg-gradient-to-br from-[#DDB76C] via-[#E6C88A] to-[#f5b235] text-black p-6 rounded-l-lg shadow-lg max-w-xs w-64">
          <button
            type="button"
            onClick={toggleToolkit}
            className="absolute top-2 right-2 text-black hover:text-gray-700 transition-colors"
          >
            <FaTimes size={20} />
          </button>
          <h3 className="text-xl font-bold mb-4 text-black">Built using:</h3>
          <ul className="space-y-2">
            {toolkits.map((toolkit) => (
              <li key={toolkit.name} className="w-full">
                <Link
                  href={toolkit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center w-full bg-black/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm hover:bg-black/20 transition-colors duration-200 text-black"
                >
                  <toolkit.icon className="mr-2" size={20} />
                  <span>{toolkit.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full">
          <button
            type="button"
            onClick={toggleToolkit}
            className={`backdrop-blur-xl opacity-65 bg-gradient-to-r from-[#DDB76C] to-[#f5b235] text-black p-2 rounded-l-lg shadow-lg hover:from-[#E6C88A] hover:to-[#f5b235] transition-colors ${
              isToolkitOpen ? "hidden" : "block"
            }`}
            style={{ zIndex: 1001 }}
          >
            <div className="flex items-center justify-center transform rotate-90 origin-center h-24 w-8">
              <span className="text-black text-xs font-semibold whitespace-nowrap">
                Built using
              </span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
