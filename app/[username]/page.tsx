"use client";

import { useState, useEffect } from "react";
import { useReadContract, useAccount, useReadContracts } from "wagmi";
import { contracts } from "../utils/contracts";
import Header from "./../components/Header";
import UserInfo from "./../components/UserInfo";
import RecentDonations from "./../components/RecentDonations";
import Footer from "./../components/Footer";
import ConfigPopup from "./../components/ConfigPopup";
import WithdrawPopup from "./../components/WithdrawPopup";
import type { Address } from "viem";

interface Tip {
	timestamp: bigint;
	from: string;
	message: string;
	value: bigint;
}

export interface ProfileData {
	username: string;
	aboutMe: string;
	profilePicture: string;
	bannerPicture: string;
	location: string;
	socialProfiles: string[];
	recentTips: Tip[]; // Update this line
	totalTips: bigint;
	ownerAddress: string;
	totalTipsReceived: bigint;
	created: bigint;
}

export default function UserPage({ params }: { params: { username: string } }) {
	const [profileData, setProfileData] = useState<ProfileData | null>(null);
	const { address: currentSignedInWalletAddress } = useAccount();
	const [isConfigOpen, setIsConfigOpen] = useState(false);
	const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
	const [ethToUsdRate, setEthToUsdRate] = useState<number | null>(null);

	const { data: contractAddress } = useReadContract({
		address: contracts.profileFactory.address as Address,
		abi: contracts.profileFactory.abi,
		functionName: "getProfileByUsername",
		args: [params.username],
	}) as { data: Address };

	const { data: profileContractData } = useReadContracts({
		contracts: [
			{
				address: contractAddress as Address,
				abi: contracts.profile.abi,
				functionName: "getProfileDetails",
			},
			{
				address: contractAddress as Address,
				abi: contracts.profile.abi,
				functionName: "owner",
			},
		],
	});

	useEffect(() => {
		if (profileContractData) {
			console.log(profileContractData);
			const profile = profileContractData[0].result as ProfileData;
			profile.ownerAddress = profileContractData[1].result as string;
			setProfileData(profile);
		}
	}, [profileContractData]);

	useEffect(() => {
		const fetchEthToUsdRate = async () => {
			try {
				const response = await fetch(
					"https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
				);
				const data = await response.json();
				setEthToUsdRate(data.ethereum.usd);
			} catch (error) {
				console.error("Failed to fetch ETH to USD rate:", error);
			}
		};

		fetchEthToUsdRate();
		const intervalId = setInterval(fetchEthToUsdRate, 60000); // Update every 5min

		return () => clearInterval(intervalId);
	}, []);

	if (!profileData) {
		return <div>Loading or User not found...</div>;
	}

	return (
		<div className="flex flex-col min-h-screen relative">
			{/* Background AMPD Design */}
			<div
				className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
				style={{
					backgroundImage: "url(/BG-Design-TopRight.png)",
					backgroundSize: "cover",
					backgroundPosition: "top right",
				}}
			/>

			<Header />

			<main className="flex-grow pt-24 px-4 pb-4 relative z-10">
				<div className="container mx-auto max-w-4xl space-y-2">
					<UserInfo
						username={profileData.username}
						avatarUrl={
							profileData.profilePicture ||
							"https://gravatar.com/avatar/b32311a07e94c3ca45d2b80793b403c7?s=400&d=identicon&r=x"
						}
						walletAddress={profileData.ownerAddress as string}
						profileAddress={contractAddress as string}
						signedInWallet={currentSignedInWalletAddress as string}
						onConfigClick={() => setIsConfigOpen(true)}
						onWithdrawClick={() => setIsWithdrawOpen(true)}
						totalTips={profileData.totalTips}
						aboutMe={profileData.aboutMe}
						bannerUrl={profileData.bannerPicture || ""}
						socialLinks={profileData.socialProfiles}
						created={Number(profileData.created)}
						location={profileData.location || "Earth"}
					/>
					<RecentDonations
						profileAddress={contractAddress as string}
						ethToUsdRate={ethToUsdRate}
					/>
				</div>
			</main>

			<Footer />

			<ConfigPopup
				isOpen={isConfigOpen}
				onClose={() => setIsConfigOpen(false)}
				contractAddress={contractAddress as string}
				username={params.username}
			/>
			<WithdrawPopup
				isOpen={isWithdrawOpen}
				onClose={() => setIsWithdrawOpen(false)}
				contractAddress={contractAddress as string}
				ethToUsdRate={ethToUsdRate}
			/>
		</div>
	);
}
