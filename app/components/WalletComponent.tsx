import {
	Wallet,
	ConnectWallet,
	WalletDropdown,
	WalletDropdownLink,
	WalletDropdownDisconnect,
	WalletDropdownBasename,
	WalletDropdownFundLink,
} from "@coinbase/onchainkit/wallet";
import {
	Address,
	Avatar,
	Name,
	Identity,
	EthBalance,
} from "@coinbase/onchainkit/identity";
import { color } from "@coinbase/onchainkit/theme";

export default function WalletComponent() {
	return (
		<div className="relative">
			<Wallet>
				<ConnectWallet className="bg-gradient-to-r from-[#DDB76C] via-[#E6C88A] to-[#f5b235]">
					<Avatar className="h-6 w-6" />
					<Name />
				</ConnectWallet>
				<WalletDropdown>
					<Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
						<Avatar />
						<Name />
						<Address />
						<EthBalance />
					</Identity>
					<WalletDropdownBasename />
					<WalletDropdownLink icon="wallet" href="https://keys.coinbase.com">
						Wallet
					</WalletDropdownLink>
					<WalletDropdownFundLink />
					<WalletDropdownDisconnect />
				</WalletDropdown>
			</Wallet>
		</div>
	);
}
