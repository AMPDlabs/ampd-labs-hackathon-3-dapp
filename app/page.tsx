"use client";

import { useCallback, useState, useEffect } from "react";
import { useReadContract, useReadContracts } from "wagmi";
import { contracts } from "./utils/contracts";
import { baseSepolia } from "wagmi/chains";
import {
	parseEther,
	formatEther,
	encodeFunctionData,
	type Abi,
	Address,
	Hex,
} from "viem";
import { useAccount } from "wagmi";
import {
	Transaction,
	TransactionButton,
	TransactionSponsor,
	TransactionToast,
	TransactionToastIcon,
	TransactionToastLabel,
	TransactionToastAction,
} from "@coinbase/onchainkit/transaction";
import type { LifecycleStatus } from "@coinbase/onchainkit/transaction";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

import Header from "./components/Header";
import Footer from "./components/Footer";
import SponsorshipAndToolkit from "./components/SponsorshipAndToolkit";

export default function Home() {
	const [username, setUsername] = useState("");
	const [isUsernameAvailable, setIsUsernameAvailable] = useState<
		boolean | null
	>(null);
	const [latestProfiles, setLatestProfiles] = useState<
		Array<{ username: string; created: number }>
	>([]);
	const [profileFee, setProfileFee] = useState<bigint | null>(
		parseEther("0.0001"),
	);

	const [randomWord, setRandomWord] = useState("sip");

	const [transactionStatus, setTransactionStatus] = useState<string>("idle");
	const [newProfileUrl, setNewProfileUrl] = useState<string | null>(null);
	const [transactionHash, setTransactionHash] = useState<string | null>(null);

	const handleOnError = useCallback((error: Error, additionalInfo: unknown) => {
		console.log(error, additionalInfo);
	}, []);
	const handleOnStatus = useCallback(
		(status: LifecycleStatus) => {
			console.log("LifecycleStatus", status);
			setTransactionStatus(status.statusName);

			if (status.statusName === "success") {
				// Assuming the profile URL is based on the username
				setNewProfileUrl(`/${username}`);
				if (status.statusData && "transactionReceipts" in status.statusData) {
					setTransactionHash(
						status.statusData.transactionReceipts[0].transactionHash,
					);
				}
			}
		},
		[username],
	);

	const createProfileContract: { to: Hex; data?: Hex; value?: bigint } = {
		to: contracts.profileFactory.address as Address,
		data: encodeFunctionData({
			abi: contracts.profileFactory.abi as Abi,
			functionName: "createProfile",
			args: [username, "", []],
		}),
		value: profileFee ?? undefined,
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

	const { data: profileAddress, refetch: getProfileByUsername } =
		useReadContract({
			address: contracts.profileFactory.address as Address,
			abi: contracts.profileFactory.abi as Abi,
			functionName: "getProfileByUsername",
			args: [username],
		});

	const checkUsernameAvailability = useCallback(async () => {
		if (username.trim() === "") {
			setIsUsernameAvailable(null);
			return;
		}

		if (username.length < 3) {
			setIsUsernameAvailable(false);
			return;
		}

		await getProfileByUsername();
		setIsUsernameAvailable(
			profileAddress === "0x0000000000000000000000000000000000000000",
		);
	}, [username, getProfileByUsername, profileAddress]);

	useEffect(() => {
		const debounceTimer = setTimeout(() => {
			checkUsernameAvailability();
		}, 500);

		return () => clearTimeout(debounceTimer);
	}, [checkUsernameAvailability]);

	const { isConnected } = useAccount();

	const { data: latestProfilesData } = useReadContract({
		address: contracts.profileFactory.address as Address,
		abi: contracts.profileFactory.abi as Abi,
		functionName: "getProfiles",
		args: [],
	});

	// Update latestProfiles when latestProfilesData changes
	useEffect(() => {
		if (latestProfilesData) {
			console.log(latestProfilesData);
			const profiles = latestProfilesData.map(
				(profile: { username: string; created: number }) => {
					return {
						username: profile.username,
						created: profile.created,
					};
				},
			);
			setLatestProfiles(profiles);
		}
	}, [latestProfilesData]);

	const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newUsername = e.target.value
			.toLowerCase()
			.replace(/\s/g, "-") // Replace spaces with hyphens
			.replace(/[^a-z0-9-]/g, "");
		setUsername(newUsername);
		console.log("Username updated:", newUsername);
	};

	useEffect(() => {
		const words = ["sip", "cup", "pizza", "brew", "whiskey", "roast"];
		const randomIndex = Math.floor(Math.random() * words.length);
		setRandomWord(words[randomIndex]);
	}, []);

	return (
		<div className="flex flex-col min-h-screen relative overflow-hidden">
			{/* Background AMPD Design */}
			<div
				className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-45"
				style={{
					backgroundImage: "url(/BG-Design-TopRight.png)",
					backgroundSize: "cover",
					backgroundPosition: "top right",
				}}
			/>

			<Header />

			{/* Main content */}
			<main className="flex-grow flex flex-col justify-between p-4 sm:p-8 text-center relative z-10">
				<div className="flex-grow flex flex-col justify-center items-center">
					<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-8 bg-gradient-to-r from-[#DDB76C] via-[#E6C88A] to-[#f5b235] text-transparent bg-clip-text">
						Support your favorite creators,
						<br />{" "}
						<span className="block sm:inline">
							One {randomWord} at the time
						</span>
					</h1>

					<div className="w-full max-w-md px-4 sm:px-0">
						<p className="mb-10 text-base sm:text-lg">
							Create your page now and start receiving support today!
						</p>
						<form className="flex flex-col" onSubmit={handleSubmit}>
							<div className="text-left mb-2 px-2 text-sm text-gray-600">
								Profile creation fee:{" "}
								{profileFee ? formatEther(profileFee) : "0.0001"} ETH
							</div>
							<div className="flex flex-col md:flex-row items-center border rounded-2xl md:rounded-full bg-white p-3 mb-2">
								<div className="flex items-center w-full md:w-auto mb-3 md:mb-0">
									<span className="bg-white text-[#ffb444] font-bold px-3 py-2">
										ampdtr.ee/
									</span>
									<input
										type="text"
										placeholder="yourname"
										className="flex-grow p-2 focus:outline-none text-stone-900 w-full md:w-auto"
										aria-label="Your page name"
										value={username}
										onChange={handleUsernameChange}
										pattern="[a-z0-9-]+"
										title="Only lowercase letters, numbers, and hyphens are allowed"
										minLength={3}
										maxLength={31}
										required
									/>
								</div>
								<Transaction
									chainId={baseSepolia.id}
									calls={[createProfileContract]}
									onStatus={handleOnStatus}
								>
									<div className="w-full md:w-auto md:ml-2">
										{transactionStatus === "success" ? (
											<Link
												href={newProfileUrl ?? "/"}
												className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition-colors whitespace-nowrap w-full md:w-auto mb-0 inline-block text-center"
											>
												View Profile
											</Link>
										) : (
											<TransactionButton
												className={`text-white px-6 py-2 rounded-full transition-colors whitespace-nowrap w-full md:w-auto ${
													isConnected &&
													isUsernameAvailable &&
													username.trim() !== "" &&
													username.length >= 3
														? "bg-green-500 hover:bg-green-600"
														: "bg-gray-400 cursor-not-allowed"
												}`}
												text={"Claim"}
												disabled={
													!isConnected ||
													!isUsernameAvailable ||
													username.trim() === "" ||
													username.length < 3
												}
											/>
										)}
										<TransactionSponsor />
										<TransactionToast className="z-[1050]">
											<TransactionToastIcon />
											<TransactionToastLabel />
											<TransactionToastAction />
										</TransactionToast>
									</div>
								</Transaction>
							</div>
							<div className="flex flex-col items-start mt-2 text-sm">
								{username.trim() !== "" && (
									<div className="w-full text-left mb-1">
										<span
											className={`px-2 ${
												isUsernameAvailable === null
													? "text-gray-500"
													: isUsernameAvailable && username.length >= 3
														? "text-green-500"
														: "text-red-500"
											}`}
										>
											{isUsernameAvailable === null
												? "Enter a username"
												: username.length < 3
													? "✗ Username must be at least 3 characters long"
													: isUsernameAvailable
														? "✓ Username is available"
														: "✗ Username is already taken"}
										</span>
									</div>
								)}
								{transactionStatus === "success" && (
									<div className="w-full text-left px-2">
										<span className="text-green-500">
											✓ Profile Successfully created{" "}
											<a
												href={`https://sepolia.basescan.org/tx/${transactionHash}`}
												target="_blank"
												rel="noopener noreferrer"
												className="text-blue-500 hover:underline"
											>
												view transaction
											</a>
										</span>
									</div>
								)}
							</div>
						</form>
					</div>
				</div>

				{/* Updated Latest Profiles section */}
				<div className="px-4 py-2 text-sm w-8/12 mx-auto mt-8">
					<div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 py-4">
						<h2 className="text-xl font-bold bg-gradient-to-r from-[#DDB76C] via-[#E6C88A] to-[#f5b235] text-transparent bg-clip-text mr-2">
							Recent Profiles:
						</h2>
						{latestProfiles.map(({ username, created }, index) => (
							<Link
								key={username}
								href={`/${username}`}
								className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm hover:bg-white/20 transition-colors duration-200 cursor-pointer"
							>
								<span className="font-semibold text-[#f5b235]">{username}</span>
								<span className="text-gray-400 ml-2">
									(
									{formatDistanceToNow(new Date(Number(created) * 1000), {
										addSuffix: true,
									})}
									)
								</span>
							</Link>
						))}
					</div>
				</div>
			</main>

			<Footer />

			<SponsorshipAndToolkit />
		</div>
	);
}
