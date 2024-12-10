import React, { useState, useEffect, useCallback } from "react";
import { useReadContract, useWatchContractEvent } from "wagmi";
import { formatEther } from "viem";
import { contracts } from "../utils/contracts";
import { formatDistanceToNow } from "date-fns";
import { Avatar, Name } from "@coinbase/onchainkit/identity";
import { base } from "viem/chains";
import debounce from "lodash/debounce";

type ProfileDetails = [
	string,
	string,
	string,
	string,
	string,
	string,
	Array<{ timestamp: bigint; from: string; value: bigint }>,
];

interface Donation {
	id: number;
	address: string;
	shortAddress: string;
	amount: string;
	time: string;
	isNew?: boolean;
	usdAmount?: string;
	message: string; // New field for the message
}

const shortenAddress = (address: string) => {
	return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

interface RecentDonationsProps {
	profileAddress: string;
	ethToUsdRate: number | null;
}

export default function RecentDonations({
	profileAddress,
	ethToUsdRate,
}: RecentDonationsProps) {
	const [donations, setDonations] = useState<Donation[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const donationsPerPage = 5;

	const { data: profileDetails } = useReadContract({
		address: profileAddress as `0x${string}`,
		abi: contracts.profile.abi,
		functionName: "getProfileDetails",
		// @ts-expect-error: Known type inference issue
		watch: true,
	}) as { data: ProfileDetails | undefined };

	const updateDonations = useCallback((newDonations: Donation[]) => {
		setDonations((prevDonations) => {
			const combinedDonations = [...newDonations, ...prevDonations];
			const uniqueDonations = Array.from(
				new Map(combinedDonations.map((item) => [item.id, item])).values(),
			);
			return uniqueDonations.sort((a, b) => b.id - a.id).slice(0, 200); // Keep only the latest 200 donations
		});
	}, []);

	const debouncedUpdateDonations = useCallback(
		debounce((newDonations: Donation[]) => updateDonations(newDonations), 100),
		[],
	);

	const formatUsdValue = (ethAmount: number): string => {
		if (ethToUsdRate === null) return "";
		const usdValue = ethAmount * ethToUsdRate;
		return usdValue.toFixed(2);
	};

	useEffect(() => {
		if (profileDetails) {
			const recentTips = profileDetails[6];
			const formattedDonations = recentTips.map((tip) => {
				const ethAmount = Number(formatEther(tip.value));
				return {
					id: Number(tip.timestamp),
					address: tip.from,
					shortAddress: shortenAddress(tip.from),
					amount: ethAmount.toFixed(6),
					usdAmount: formatUsdValue(ethAmount),
					time: formatDistanceToNow(new Date(Number(tip.timestamp) * 1000), {
						addSuffix: true,
					}),
					isNew: false,
					// @ts-expect-error: Known type inference issue
					message: tip.message,
				};
			});
			debouncedUpdateDonations(formattedDonations);
		}
	}, [profileDetails, debouncedUpdateDonations, ethToUsdRate]);

	useWatchContractEvent({
		address: profileAddress as `0x${string}`,
		abi: contracts.profile.abi,
		eventName: "TipReceived",
		// @ts-expect-error: Known type inference issue
		listener(log) {
			const [from, amount, message] = log.args as [string, bigint, string];
			const ethAmount = Number(formatEther(amount));
			const newDonation: Donation = {
				id: Date.now(),
				address: from,
				shortAddress: shortenAddress(from),
				amount: ethAmount.toFixed(6),
				usdAmount: formatUsdValue(ethAmount),
				time: "just now",
				isNew: true,
				message: message, // Add the message from the event
			};
			debouncedUpdateDonations([newDonation]);

			setTimeout(() => {
				setDonations((current) =>
					current.map((d) =>
						d.id === newDonation.id ? { ...d, isNew: false } : d,
					),
				);
			}, 500);
		},
	});

	const indexOfLastDonation = currentPage * donationsPerPage;
	const indexOfFirstDonation = indexOfLastDonation - donationsPerPage;
	const currentDonations = donations.slice(
		indexOfFirstDonation,
		indexOfLastDonation,
	);
	const totalPages = Math.ceil(donations.length / donationsPerPage);

	return (
		<div className="flex flex-col overflow-hidden">
			<div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-4 flex flex-col h-full border border-white/10">
				<h2 className="text-xl font-bold mb-2">Recent Donations</h2>
				<ul className="space-y-2 overflow-y-auto flex-grow text-sm">
					{currentDonations.map((donation) => (
						<li
							key={donation.id}
							className={`p-2 rounded-lg transition-all duration-500 ease-in-out border border-white/5 ${
								donation.isNew
									? "bg-green-500 bg-opacity-20"
									: "bg-white bg-opacity-5"
							}`}
							style={{
								animation: donation.isNew ? "slideIn 0.5s ease-out" : "none",
							}}
						>
							<div className="flex items-center space-x-2">
								<Avatar
									address={donation.address as `0x${string}`}
									chain={base}
									className="w-6 h-6"
								/>
								<Name
									address={donation.address as `0x${string}`}
									chain={base}
									className="text-[#DDB76C] font-light text-sm"
								/>
							</div>
							<p className="text-xs text-white text-opacity-70 mt-1">
								<span className="text-[#DDB76C] font-bold">
									{donation.amount} ETH
								</span>{" "}
								<span className="text-white/50">
									{donation.usdAmount && ` (≈$${donation.usdAmount}) `}
								</span>
								- <span className="text-white/50">{donation.time}</span>
							</p>
							{/* Add the message display */}
							<p className="text-xs text-white text-opacity-70 mt-1 italic">
								{donation.message ? `"${donation.message}"` : "No message"}
							</p>
						</li>
					))}
				</ul>
				{totalPages > 1 && (
					<div className="flex justify-between mt-4">
						<button
							type="button"
							onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
							disabled={currentPage === 1}
							className="px-2 py-1 bg-white bg-opacity-20 rounded disabled:opacity-50"
						>
							Previous
						</button>
						<span>
							{currentPage} / {totalPages}
						</span>
						<button
              type="button"
							onClick={() =>
								setCurrentPage((prev) => Math.min(prev + 1, totalPages))
							}
							disabled={currentPage === totalPages}
							className="px-2 py-1 bg-white bg-opacity-20 rounded disabled:opacity-50"
						>
							Next
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
