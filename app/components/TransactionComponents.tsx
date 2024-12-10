import { useCallback, useState, useEffect } from "react";
import { Avatar, Name } from "@coinbase/onchainkit/identity";
import {
	Transaction,
	TransactionButton,
	TransactionSponsor,
	TransactionStatus,
	TransactionStatusAction,
	TransactionStatusLabel,
} from "@coinbase/onchainkit/transaction";
import { Wallet, ConnectWallet } from "@coinbase/onchainkit/wallet";
import { useAccount } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { encodeFunctionData, parseEther } from "viem";
import axios from "axios";
import { contracts } from "../utils/contracts";
import toast from "react-hot-toast";

//TODO:
// - ETH price if API fails, trigger a toast

const standardAmounts = [5, 10, 25, 50]; // USD amounts
const MAX_TIP_MESSAGE_LENGTH = 90;

export default function TransactionComponents({
	profileAddress,
}: {
	profileAddress: string;
}) {
	const { address } = useAccount();
	const [selectedAmount, setSelectedAmount] = useState(0);
	const [manualAmount, setManualAmount] = useState("");
	const [ethPrice, setEthPrice] = useState(2000); // Default to $2000 if API fails
	const [isValidAmount, setIsValidAmount] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [tipMessage, setTipMessage] = useState("");

	useEffect(() => {
		const fetchEthPrice = async () => {
			setIsLoading(true);
			try {
				const response = await axios.get(
					"https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
				);
				if (response.data?.ethereum?.usd) {
					const price = response.data.ethereum.usd;
					setEthPrice(price);
					console.log("Fetched ETH price:", price);
				} else {
					throw new Error("Invalid response format");
				}
			} catch (error) {
				console.error("Failed to fetch ETH price:", error);
				toast.error("Failed to fetch ETH price. Please try again later.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchEthPrice();
		const interval = setInterval(fetchEthPrice, 120000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		setIsValidAmount(selectedAmount > 0 || Number.parseFloat(manualAmount) > 0);
	}, [selectedAmount, manualAmount]);

	const handleOnStatus = useCallback(() => {
		//console.log("LifecycleStatus", status);
	}, []);

	const getEthAmount = () => {
		const usdAmount = selectedAmount || Number.parseFloat(manualAmount) || 0;
		return parseEther((usdAmount / ethPrice).toFixed(18));
	};

	return address ? (
		<div className="w-full max-w-4xl mx-auto">
			{isLoading ? (
				<p className="text-center">Loading ETH price...</p>
			) : (
				<div className="pb-0">
					<div className="flex flex-wrap gap-6">
						{/* Left column: Amount selection */}
						<div className="flex-1 min-w-[250px]">
							<div className="grid grid-cols-2 gap-3 mb-4">
								{standardAmounts.map((amount) => (
									<button
										type="button"
										key={amount}
										className={`py-2 rounded-lg font-semibold transition-colors duration-200 ${
											selectedAmount === amount
												? "bg-[#DDB76C] text-[#0E0916] hover:bg-[#bd9441]"
												: "bg-white bg-opacity-10 text-white hover:bg-opacity-20"
										}`}
										onClick={() => setSelectedAmount(amount)}
									>
										${amount}
									</button>
								))}
							</div>

							<div className="flex">
								<div className="relative flex-grow">
									<span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white">
										$
									</span>
									<input
										type="number"
										placeholder="Custom amount"
										className="w-full pl-8 pr-4 py-2 rounded-lg bg-white bg-opacity-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DDB76C] focus:bg-opacity-20"
										value={manualAmount}
										onChange={(e) => {
											setSelectedAmount(0);
											setManualAmount(e.target.value);
										}}
									/>
								</div>
							</div>
						</div>

						{/* Right column: Message and Send button */}
						<div className="flex-1 min-w-[250px]">
							<div className="mb-3 relative">
								<textarea
									placeholder="Leave a message with your tip (optional)"
									className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DDB76C] focus:bg-opacity-20 resize-none pr-16"
									value={tipMessage}
									onChange={(e) => {
										if (e.target.value.length <= MAX_TIP_MESSAGE_LENGTH) {
											setTipMessage(e.target.value);
										}
									}}
									rows={3}
									maxLength={MAX_TIP_MESSAGE_LENGTH}
								/>
								<span className="absolute bottom-2 right-2 text-sm text-gray-400">
									{tipMessage.length}/{MAX_TIP_MESSAGE_LENGTH}
								</span>
							</div>
							<Transaction
								chainId={baseSepolia.id}
								calls={[
									{
										to: profileAddress as `0x${string}`,
										data: encodeFunctionData({
											abi: contracts.profile.abi,
											functionName: "addTip",
											args: [tipMessage],
										}),
										value: getEthAmount(),
									},
								]}
								onStatus={handleOnStatus}
							>
								<div className="space-y-3">
									<TransactionButton
										text="Send Tip"
										className={`w-full pl-8 pr-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
											isValidAmount
												? "bg-[#DDB76C] text-[#0E0916] hover:bg-[#bd9441]"
												: "bg-gray-400 text-gray-600 cursor-not-allowed"
										}`}
										disabled={!isValidAmount}
									/>
									<div className="flex items-center justify-between">
										<TransactionSponsor />
										<TransactionStatus>
											<TransactionStatusLabel />
											<TransactionStatusAction />
										</TransactionStatus>
									</div>
								</div>
							</Transaction>
						</div>
					</div>
				</div>
			)}
		</div>
	) : (
		<Wallet>
			<ConnectWallet className="px-6 py-2 rounded-full bg-[#DDB76C] hover:bg-[#bd9441] transition-colors font-semibold text-[#0E0916]">
				<Avatar className="h-6 w-6" />
				<Name />
			</ConnectWallet>
		</Wallet>
	);
}
