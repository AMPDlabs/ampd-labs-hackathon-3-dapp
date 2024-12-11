import React, { useState, useEffect } from "react";
import { useBalance } from "wagmi";
import { contracts } from "../utils/contracts";
import { encodeFunctionData, formatEther } from "viem";
import {
	Transaction,
	TransactionButton,
	TransactionStatus,
	TransactionStatusLabel,
	TransactionStatusAction,
} from "@coinbase/onchainkit/transaction";
import { baseSepolia } from "wagmi/chains";
import { FaTimes } from "react-icons/fa";

interface WithdrawPopupProps {
	isOpen: boolean;
	onClose: () => void;
	contractAddress: string;
	ethToUsdRate: number | null;
}

export default function WithdrawPopup({
	isOpen,
	onClose,
	contractAddress,
	ethToUsdRate,
}: WithdrawPopupProps) {
	const [isWithdrawing, setIsWithdrawing] = useState(false);

	const { data: balance, refetch: refetchBalance } = useBalance({
		address: contractAddress as `0x${string}`,
		// @ts-expect-error: Known type inference issue
		watch: true,
	});

	useEffect(() => {
		if (isOpen) {
			refetchBalance();
		}
	}, [isOpen, refetchBalance]);

	const handleWithdraw = () => {
		setIsWithdrawing(true);
	};

	// @ts-expect-error: Known type inference issue
	const isBalanceZero = balance && balance.value === 0n;

	const formatUsdValue = (ethValue: string): string => {
		if (!ethToUsdRate) return "N/A";
		const usdValue = Number.parseFloat(ethValue) * ethToUsdRate;
		return usdValue.toFixed(2);
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
			<div className="bg-[#0E0916] rounded-2xl p-8 w-full max-w-md relative overflow-hidden border border-white/10">
				<div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-br from-[#DDB76C]/10 via-transparent to-transparent opacity-30" />
				<div className="relative z-10">
					<button
						type="button"
						onClick={onClose}
						className="absolute top-0 right-0 text-white/50 hover:text-white transition-colors"
					>
						<FaTimes size={24} />
					</button>
					<h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#DDB76C] via-[#E6C88A] to-[#f5b235] text-transparent bg-clip-text flex items-center ml-1">
						{/*<FaWallet
              color="#E6C88A"
              size={30}
              className="p-1 bg-white/20 rounded-full mr-2"
            />*/}
						Withdraw Funds
					</h2>
					<div className="bg-white/5 rounded-lg p-4 mb-6">
						<p className="text-white text-lg mb-2">Current Balance:</p>
						<p className="text-xl font-bold text-[#E6C88A]">
							{balance ? formatEther(balance.value) : "0"} ETH
						</p>
						<p className="text-md text-white/40">
							≈ ${balance ? formatUsdValue(formatEther(balance.value)) : "0"}{" "}
							USD
						</p>
					</div>
					<Transaction
						chainId={baseSepolia.id}
						calls={[
							{
								to: contractAddress as `0x${string}`,
								data: encodeFunctionData({
									abi: contracts.profile.abi,
									functionName: "withdraw",
									args: [],
								}),
							},
						]}
						onStatus={(status) => {
							// @ts-expect-error: Known type inference issue
							if (status === "success") {
								setIsWithdrawing(false);
								refetchBalance();
								onClose();
							}
						}}
					>
						<TransactionButton
							text={isBalanceZero ? "No funds to withdraw" : "Withdraw"}
							// @ts-expect-error: Known type inference issue
							onClick={handleWithdraw}
							disabled={isWithdrawing || isBalanceZero}
							className={`w-full py-3 px-6 rounded-full font-bold text-lg transition-colors ${
								isBalanceZero
									? "bg-gray-500 cursor-not-allowed text-white/50"
									: "bg-gradient-to-r from-[#DDB76C] to-[#E6C88A] text-[#0E0916] hover:from-[#E6C88A] hover:to-[#DDB76C]"
							}`}
						/>
						<TransactionStatus>
							<TransactionStatusLabel className="mt-4 text-center text-white/70" />
							<TransactionStatusAction className="mt-2 text-center" />
						</TransactionStatus>
					</Transaction>
				</div>
			</div>
		</div>
	);
}
