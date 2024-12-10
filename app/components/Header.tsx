import Image from "next/image";
import Link from "next/link";
import WalletComponent from "./WalletComponent";

export default function Header() {
  return (
    <header className="w-full p-4 fixed top-0 left-0 z-50 bg-black bg-opacity-10 backdrop-filter backdrop-blur-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Your Logo"
            width={150}
            height={140}
            priority
          />
        </Link>
        <WalletComponent />
      </div>
    </header>
  );
}
