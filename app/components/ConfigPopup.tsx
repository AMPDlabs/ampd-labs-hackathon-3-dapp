import React, { useState, useEffect, useMemo } from "react";
import { useReadContract, useWaitForTransactionReceipt } from "wagmi";
import { contracts } from "../utils/contracts";
import {
	Transaction,
	TransactionButton,
	TransactionStatus,
	TransactionStatusLabel,
	TransactionStatusAction,
} from "@coinbase/onchainkit/transaction";
import { baseSepolia } from "wagmi/chains";
import { type Abi, encodeFunctionData, type Hex } from "viem";
import { uploadToIPFS } from "../utils/ipfsUpload";
import { resizeImage } from "../utils/imageResizer";
import { FaTimes, FaUpload } from "react-icons/fa";
import Image from "next/image";

const MAX_SOCIAL_PROFILES = 4;
const MAX_ABOUT_ME_CHARS = 256;

interface ConfigPopupProps {
	isOpen: boolean;
	onClose: () => void;
	contractAddress: string;
	username: string;
}

export default function ConfigPopup({
	isOpen,
	onClose,
	contractAddress,
}: ConfigPopupProps) {
	const [aboutMe, setAboutMe] = useState("");
	const [socialProfiles, setSocialProfiles] = useState<string[]>([]);
	const [location, setLocation] = useState("");
	const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
		null,
	);
	const [bannerFile, setBannerFile] = useState<File | null>(null);
	const [newProfilePictureUrl, setNewProfilePictureUrl] = useState<
		string | null
	>(null);
	const [newBannerUrl, setNewBannerUrl] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);

	const [initialAboutMe, setInitialAboutMe] = useState("");
	const [initialProfilePicture, setInitialProfilePicture] = useState("");
	const [initialSocialProfiles, setInitialSocialProfiles] = useState<string[]>(
		[],
	);
	const [initialLocation, setInitialLocation] = useState("");
	const [initialBannerUrl, setInitialBannerUrl] = useState("");

	const { data: profileData } = useReadContract({});

	const { refetch: refetchProfileData } = useWaitForTransactionReceipt();

	useEffect(() => {
		if (isOpen && profileData && Array.isArray(profileData)) {
			const [
				,
				fetchedAboutMe,
				fetchedProfilePicture,
				fetchedBannerUrl,
				fetchedLocation,
				fetchedSocialProfiles,
			] = profileData;

			setAboutMe(fetchedAboutMe);
			setNewProfilePictureUrl(fetchedProfilePicture);
			setNewBannerUrl(fetchedBannerUrl);
			setLocation(fetchedLocation);
			setSocialProfiles(fetchedSocialProfiles);

			// Set initial values for comparison
			setInitialAboutMe(fetchedAboutMe);
			setInitialProfilePicture(fetchedProfilePicture);
			setInitialBannerUrl(fetchedBannerUrl);
			setInitialLocation(fetchedLocation);
			setInitialSocialProfiles(fetchedSocialProfiles);
		}
	}, [isOpen, profileData]);

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
		setFile: React.Dispatch<React.SetStateAction<File | null>>,
		maxWidth: number,
		maxHeight: number,
	) => {
		const file = event.target.files?.[0];
		if (file) {
			try {
				const resizedBlob = await resizeImage(file, maxWidth, maxHeight);
				const resizedFile = new File([resizedBlob], file.name, {
					type: file.type,
				});
				setFile(resizedFile);
			} catch (error) {
				console.error("Error resizing image:", error);
				setFile(null);
			}
		}
	};

	const handleAboutMeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newValue = e.target.value.slice(0, MAX_ABOUT_ME_CHARS);
		setAboutMe(newValue);
	};

	const uploadImages = async () => {
		setIsUploading(true);
		try {
			if (profilePictureFile) {
				const ipfsHash = await uploadToIPFS(profilePictureFile);
				const url = `https://ampdlabs.mypinata.cloud/ipfs/${ipfsHash}`;
				setNewProfilePictureUrl(url);
			}
			if (bannerFile) {
				const ipfsHash = await uploadToIPFS(bannerFile);
				const url = `https://ampdlabs.mypinata.cloud/ipfs/${ipfsHash}`;
				setNewBannerUrl(url);
			}
		} catch (error) {
			console.error("Error uploading images to IPFS:", error);
		} finally {
			setIsUploading(false);
		}
	};

	const prepareCalls = () => {
		const calls: { to: Hex; data: Hex }[] = [];

		if (aboutMe !== initialAboutMe) {
			calls.push({
				to: contractAddress as Hex,
				data: encodeFunctionData({
					abi: contracts.profile.abi as Abi,
					functionName: "updateAboutMe",
					args: [aboutMe],
				}),
			});
		}

		if (
			newProfilePictureUrl &&
			newProfilePictureUrl !== initialProfilePicture
		) {
			calls.push({
				to: contractAddress as Hex,
				data: encodeFunctionData({
					abi: contracts.profile.abi as Abi,
					functionName: "updateProfilePicture",
					args: [newProfilePictureUrl],
				}),
			});
		}

		if (newBannerUrl && newBannerUrl !== initialBannerUrl) {
			calls.push({
				to: contractAddress as Hex,
				data: encodeFunctionData({
					abi: contracts.profile.abi as Abi,
					functionName: "updateBannerPicture",
					args: [newBannerUrl],
				}),
			});
		}

		if (location !== initialLocation) {
			calls.push({
				to: contractAddress as Hex,
				data: encodeFunctionData({
					abi: contracts.profile.abi as Abi,
					functionName: "updateLocation",
					args: [location],
				}),
			});
		}

		// Handle social profile updates
		socialProfiles.forEach((profile, index) => {
			if (index < initialSocialProfiles.length) {
				if (profile !== initialSocialProfiles[index]) {
					if (profile) {
						calls.push({
							to: contractAddress as Hex,
							data: encodeFunctionData({
								abi: contracts.profile.abi as Abi,
								functionName: "updateSocialProfile",
								args: [index, profile],
							}),
						});
					} else {
						calls.push({
							to: contractAddress as Hex,
							data: encodeFunctionData({
								abi: contracts.profile.abi as Abi,
								functionName: "removeSocialProfile",
								args: [index],
							}),
						});
					}
				}
			} else if (profile) {
				calls.push({
					to: contractAddress as Hex,
					data: encodeFunctionData({
						abi: contracts.profile.abi as Abi,
						functionName: "addSocialProfile",
						args: [profile],
					}),
				});
			}
		});

		// Remove any remaining profiles if the new list is shorter
		for (let i = socialProfiles.length; i < initialSocialProfiles.length; i++) {
			calls.push({
				to: contractAddress as Hex,
				data: encodeFunctionData({
					abi: contracts.profile.abi as Abi,
					functionName: "removeSocialProfile",
					args: [socialProfiles.length], // Remove from the end
				}),
			});
		}

		return calls;
	};

	const hasChanges = useMemo(() => {
		return (
			aboutMe !== initialAboutMe ||
			location !== initialLocation ||
			profilePictureFile !== null ||
			bannerFile !== null ||
			JSON.stringify(socialProfiles) !== JSON.stringify(initialSocialProfiles)
		);
	}, [
		aboutMe,
		initialAboutMe,
		location,
		initialLocation,
		profilePictureFile,
		bannerFile,
		socialProfiles,
		initialSocialProfiles,
	]);

	const isReadyForTransaction = useMemo(() => {
		return (
			hasChanges &&
			!isUploading &&
			(!profilePictureFile || (profilePictureFile && newProfilePictureUrl)) &&
			(!bannerFile || (bannerFile && newBannerUrl))
		);
	}, [
		hasChanges,
		isUploading,
		profilePictureFile,
		newProfilePictureUrl,
		bannerFile,
		newBannerUrl,
	]);

	useEffect(() => {
		if (profilePictureFile || bannerFile) {
			uploadImages();
		}
	}, [profilePictureFile, bannerFile]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
			<div className="bg-[#0E0916] rounded-2xl p-8 w-full max-w-2xl relative overflow-hidden border border-white/10">
				<div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-br from-[#DDB76C]/10 via-transparent to-transparent opacity-30" />
				<div className="relative z-10">
					<button
						type="button"
						onClick={onClose}
						className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
					>
						<FaTimes size={24} />
					</button>
					<h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#DDB76C] via-[#E6C88A] to-[#f5b235] text-transparent bg-clip-text">
						Update Profile
					</h2>
					<form className="space-y-6">
						<div className="relative">
							<label
								htmlFor="aboutMe"
								className="block text-white mb-2 font-semibold"
							>
								About Me
							</label>
							<textarea
								id="aboutMe"
								value={aboutMe}
								onChange={handleAboutMeChange}
								className="w-full bg-white/5 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#DDB76C] transition-all"
								rows={4}
								maxLength={MAX_ABOUT_ME_CHARS}
							/>
							<div className="absolute bottom-2 right-2 text-xs text-gray-400">
								{aboutMe.length}/{MAX_ABOUT_ME_CHARS}
							</div>
						</div>
						<div>
							<label
								htmlFor="profilePicture"
								className="block text-white mb-2 font-semibold"
							>
								Profile Picture
							</label>
							<div className="flex items-center space-x-4">
								<input
									type="file"
									id="profilePicture"
									accept="image/*"
									onChange={(e) =>
										handleFileChange(e, setProfilePictureFile, 120, 120)
									}
									className="hidden"
								/>
								<label
									htmlFor="profilePicture"
									className="flex items-center justify-center w-20 h-20 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
								>
									{profilePictureFile ? (
										<Image
											src={URL.createObjectURL(profilePictureFile)}
											alt="Profile"
											width={80}
											height={80}
											className="w-full h-full object-cover rounded-lg"
										/>
									) : (
										<FaUpload size={20} className="text-white/50" />
									)}
								</label>
								<div className="text-sm text-white/70">
									Click to upload a new profile picture
								</div>
							</div>
						</div>
						<div>
							<label
								htmlFor="socialProfile"
								className="block text-white mb-2 font-semibold"
							>
								Social Profiles
							</label>
							{socialProfiles.map((profile, index) => (
								<div key={index} className="flex items-center mb-2">
									<input
										id="socialProfile"
										type="text"
										value={profile}
										onChange={(e) => {
											const newProfiles = [...socialProfiles];
											newProfiles[index] = e.target.value;
											setSocialProfiles(newProfiles);
										}}
										className="flex-grow bg-white/5 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#DDB76C] transition-all"
										placeholder={`Social profile ${index + 1}`}
									/>
									<button
										type="button"
										onClick={() => {
											const newProfiles = socialProfiles.filter(
												(_, i) => i !== index,
											);
											setSocialProfiles(newProfiles);
										}}
										className="ml-2 text-red-500 hover:text-red-400 transition-colors"
									>
										<FaTimes size={20} />
									</button>
								</div>
							))}
							{socialProfiles.length < MAX_SOCIAL_PROFILES && (
								<button
									type="button"
									onClick={() => setSocialProfiles([...socialProfiles, ""])}
									className="text-[#DDB76C] hover:text-[#E6C88A] transition-colors"
								>
									+ Add Social Profile
								</button>
							)}
						</div>
						<div>
							<label
								htmlFor="bannerUrl"
								className="block text-white mb-2 font-semibold"
							>
								Banner
							</label>
							<div className="flex items-center space-x-4">
								<input
									type="file"
									id="bannerUrl"
									accept="image/*"
									onChange={(e) =>
										handleFileChange(e, setBannerFile, 1200, 1200)
									}
									className="hidden"
								/>
								<label
									htmlFor="bannerUrl"
									className="flex items-center justify-center w-full h-40 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
								>
									{bannerFile ? (
										<Image
											src={URL.createObjectURL(bannerFile)}
											alt="Banner"
											width={1200}
											height={480}
											className="w-full h-full object-cover rounded-lg"
										/>
									) : (
										<FaUpload size={24} className="text-white/50" />
									)}
								</label>
							</div>
						</div>
						<div>
							<label
								htmlFor="location"
								className="block text-white mb-2 font-semibold"
							>
								Location
							</label>
							<input
								type="text"
								id="location"
								value={location}
								onChange={(e) => setLocation(e.target.value)}
								className="w-full bg-white/5 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#DDB76C] transition-all"
								placeholder="Enter your location"
							/>
						</div>
					</form>
					<Transaction
						chainId={baseSepolia.id}
						calls={prepareCalls()}
						onStatus={(status) => {
							// @ts-expect-error: Known type inference issue
							if (status === "success") {
								refetchProfileData();
								onClose();
							}
						}}
					>
						<TransactionButton
							text={isUploading ? "Uploading..." : "Update Profile"}
							disabled={!isReadyForTransaction}
							className="w-full mt-6 bg-gradient-to-r from-[#DDB76C] to-[#E6C88A] text-[#0E0916] font-bold py-3 px-6 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:from-[#E6C88A] hover:to-[#DDB76C]"
						/>
						<TransactionStatus>
							<TransactionStatusLabel className="mt-2 text-center text-white/70" />
							<TransactionStatusAction className="mt-2 text-center" />
						</TransactionStatus>
					</Transaction>
				</div>
			</div>
		</div>
	);
}
