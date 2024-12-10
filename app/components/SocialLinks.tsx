import React from "react";
import {
  FaTwitter,
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaTiktok,
  FaTwitch,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

interface SocialLinksProps {
  links: string | string[];
}

const iconMap: {
  [key: string]: {
    icon: React.ComponentType;
    name: string;
    usernamePattern: RegExp;
  };
} = {
  "x.com": {
    icon: FaXTwitter,
    name: "X",
    usernamePattern: /^https?:\/\/(www\.)?x\.com\/([a-zA-Z0-9_]+)\/?$/,
  },
  "twitter.com": {
    icon: FaTwitter,
    name: "Twitter",
    usernamePattern: /^https?:\/\/(www\.)?twitter\.com\/([a-zA-Z0-9_]+)\/?$/,
  },
  "github.com": {
    icon: FaGithub,
    name: "GitHub",
    usernamePattern: /^https?:\/\/(www\.)?github\.com\/([a-zA-Z0-9-]+)\/?$/,
  },
  "linkedin.com": {
    icon: FaLinkedin,
    name: "LinkedIn",
    usernamePattern:
      /^https?:\/\/(www\.)?linkedin\.com\/in\/([a-zA-Z0-9-]+)\/?$/,
  },
  "instagram.com": {
    icon: FaInstagram,
    name: "Instagram",
    usernamePattern: /^https?:\/\/(www\.)?instagram\.com\/([a-zA-Z0-9._]+)\/?$/,
  },
  "facebook.com": {
    icon: FaFacebook,
    name: "Facebook",
    usernamePattern: /^https?:\/\/(www\.)?facebook\.com\/([a-zA-Z0-9.]+)\/?$/,
  },
  "youtube.com": {
    icon: FaYoutube,
    name: "YouTube",
    usernamePattern:
      /^https?:\/\/(www\.)?youtube\.com\/(user|c|channel)\/([a-zA-Z0-9_-]+)\/?$/,
  },
  "tiktok.com": {
    icon: FaTiktok,
    name: "TikTok",
    usernamePattern: /^https?:\/\/(www\.)?tiktok\.com\/@([a-zA-Z0-9._]+)\/?$/,
  },
  "twitch.tv": {
    icon: FaTwitch,
    name: "Twitch",
    usernamePattern: /^https?:\/\/(www\.)?twitch\.tv\/([a-zA-Z0-9_]+)\/?$/,
  },
};

const SocialLinks: React.FC<SocialLinksProps> = ({ links }) => {
  const linksArray = Array.isArray(links) ? links : [links];
  const validLinks = linksArray.filter((link) => link && link.trim() !== "");

  if (validLinks.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {validLinks.map((link, index) => {
        let Icon = FaGlobe;
        let name = "Website";
        let username = "";

        try {
          const url = new URL(link);
          const domain = url.hostname.replace("www.", "");

          for (const [key, value] of Object.entries(iconMap)) {
            if (domain.includes(key)) {
              // @ts-expect-error: Known type inference issue
              Icon = value.icon;
              name = value.name;
              const match = link.match(value.usernamePattern);
              if (match) {
                username = match[match.length - 1];
              }
              break;
            }
          }
        } catch (error) {
          console.error("Invalid URL:", link);
        }

        return (
          <React.Fragment key={index}>
            {index > 0 && <span className="text-white/10 text-sm">|</span>}
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-black hover:text-white bg-transparent hover:bg-[#0E0916] rounded-full px-3 py-1 transition-all duration-200"
            >
              <Icon size={14} />
              <span className="text-xs">{username || name}</span>
            </a>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default SocialLinks;
