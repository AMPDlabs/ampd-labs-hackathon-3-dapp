import React, { useState, useMemo } from "react";
import {
	FaCog,
	FaMoneyBillWave,
	FaMapMarkerAlt,
	FaCalendarAlt,
	FaChevronDown,
	FaChevronUp,
} from "react-icons/fa";
import { formatEther } from "viem";
import TransactionComponents from "./TransactionComponents";
import SocialLinks from "./SocialLinks";
import Image from "next/image";

const donationItems = [
	"a cuppa ☕",
	"a coffee ☕",
	"a muffin 🧁",
	"a donut 🍩",
	"a slice of cake 🍰",
	"a smoothie 🥤",
	"a pizza 🍕",
	"a burger 🍔",
	"a healthy salad 🥗",
	"an ice cream 🍦",
	"some chocolate 🍫",
	"a beer 🍺",
	"a whiskey 🥃",
	"some wine 🍷",
	"a teddy bear 🧸",
];

export default function UserInfo({
	username,
	avatarUrl,
	walletAddress,
	profileAddress,
	signedInWallet,
	onConfigClick,
	onWithdrawClick,
	totalTips,
	aboutMe,
	bannerUrl,
	socialLinks,
	created,
	location,
}: {
	username: string;
	avatarUrl: string;
	walletAddress: string;
	profileAddress: string;
	signedInWallet: string;
	onConfigClick: () => void;
	onWithdrawClick: () => void;
	totalTips: bigint;
	aboutMe: string;
	bannerUrl: string;
	socialLinks: string | string[];
	created: number;
	location: string;
}) {
	const [showMore, setShowMore] = useState(false);
	const isOwner = signedInWallet === walletAddress;

	const formattedTotalTips = totalTips
		? Number(formatEther(totalTips)).toFixed(4)
		: "0.0000";

	const randomDonationItem = useMemo(() => {
		return donationItems[Math.floor(Math.random() * donationItems.length)];
	}, []);

	const formattedCreationDate = new Date(created * 1000).toLocaleString(
		"en-US",
		{
			month: "long",
			year: "numeric",
		},
	);

	return (
		<div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 mb-4 overflow-hidden border border-white/10">
			<div className="relative mb-16">
				<div className="w-full h-[15rem] bg-gray-700 rounded-xl overflow-hidden">
					<Image
						src={bannerUrl || "/dfb.png"}
						alt={`${username}'s banner`}
						layout="fill"
						objectFit="cover"
					/>
					{isOwner && (
						<div className="absolute right-6 top-4">
							<div className="flex bg-gradient-to-r from-white/30 to-gray-400/30 backdrop-blur-sm rounded-full p-1.5 space-x-1.5 border border-white/20">
								<button
									type="button"
									onClick={onConfigClick}
									className="bg-gray-700 hover:bg-gray-600 text-white p-1.5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
								>
									<FaCog size={16} />
								</button>
								<button
									type="button"
									onClick={onWithdrawClick}
									className="bg-yellow-600 hover:bg-yellow-500 text-white p-1.5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
								>
									<FaMoneyBillWave size={16} />
								</button>
							</div>
						</div>
					)}
				</div>
				<Image
					src={avatarUrl}
					alt={`${username}'s avatar`}
					width={96}
					height={96}
					className="absolute left-6 -bottom-12 rounded-full border-4 border-gray-700/50"
				/>
				<div className="absolute right-0 top-[calc(100%+1rem)] bg-white/10 backdrop-blur-md rounded-full px-1 py-1 flex items-center border border-white/10">
					<SocialLinks links={socialLinks} />
				</div>
			</div>

			<div className="mt-6 mb-6">
				<div className="flex justify-between items-start">
					<div>
						<h1 className="text-2xl font-bold bg-gradient-to-r from-[#DDB76C] via-[#E6C88A] to-[#f5b235] text-transparent bg-clip-text mb-1">
							{username.charAt(0).toUpperCase() + username.slice(1)}
						</h1>
						<p className="text-sm text-gray-300 mb-3">{aboutMe}</p>
						<div className="text-sm text-gray-400 flex items-center space-x-4">
							<span className="flex items-center">
								<FaMapMarkerAlt className="mr-1" /> {location}
							</span>
							<span className="flex items-center">
								<FaCalendarAlt className="mr-1" /> Joined{" "}
								{formattedCreationDate}
							</span>
						</div>
					</div>
				</div>
			</div>

			<div className="space-y-6">
				<div>
					<h2 className="text-lg font-semibold text-gray-300 mb-4">
						Buy <span className="text-[#DDB76C]">{username}</span>{" "}
						{randomDonationItem}
					</h2>
					<div className="flex flex-wrap gap-2">
						<TransactionComponents profileAddress={profileAddress} />
					</div>
				</div>

				<div>
					<button
						type="button"
						onClick={() => setShowMore(!showMore)}
						className="flex items-center text-gray-300/50 hover:text-gray-100 transition-colors duration-200 border border-white/10 rounded-full px-4 py-1"
					>
						<span className="text-xs font-semibold mr-2">Show User Data</span>
						{showMore ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
					</button>
					{showMore && (
						<div className="mt-4 space-y-6">
							<div>
								<h2 className="text-xl font-semibold text-gray-300 mb-2">
									Wallet Information
								</h2>
								<p className="text-sm text-red-400">
									Owner Address: {walletAddress}
								</p>
								<p className="text-sm text-red-400">
									Contract Address: {profileAddress}
								</p>
							</div>
							<div>
								<h2 className="text-xl font-semibold text-gray-300 mb-2">
									Tips
								</h2>
								<p className="text-sm text-green-400">
									Total Tips in contract: {formattedTotalTips} ETH
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
