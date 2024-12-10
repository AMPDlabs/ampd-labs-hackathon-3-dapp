![Hackathon-3-banner](/banner.png)
# 🚀 AMPD Labs Open Hackathon - Profile dApp 

## ⚙️ Prerequisites
Before we start there are a few things you need to do.

### Wallet setup
* Create Coinbase Wallet - https://www.coinbase.com/wallet/articles/getting-started-extension#create-a-new-wallet
* Fund wallet with Sepolia ETH from Faucet - https://www.alchemy.com/faucets/base-sepolia

### API Key
* Obtain a Public API Key from the Coinbase Developer Platform APIs https://portal.cdp.coinbase.com/products/onchainkit
* Create a file called .env and copy the content from .env.example
* Copy your key into PUBLIC_ONCHAINKIT_API_KEY in the .env file.

## ✨ Optional!
### Wallet Key (optional already provided in project)
* Go to https://cloud.walletconnect.com/sign-in
* Sign up
* Create  a project
* Copy Project ID and add to PUBLIC_WALLET_CONNECT_PROJECT_ID in .env file

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


# ✅ TODOs ✅

---

## **Preparation**

### **1. 📌 Set Up Wallet Connector**
- 📌 Setup so that the "Connect Wallet" button is working correctly.

### **2. 📌 Locate Deployed ProfileFactory Contract**
- 📌 Find the deployed contract address on the Base testnet.
- 📌 Copy the ABI of the ProfileFactory contract.
- 📌 Copy the ABI of the Profile contract.

---

## **Core Functionality**

### **3. 📌 Check Username Availability**
- 📌 Use the `getProfileByUsername` function to check if a username is available.
- ⭐️ Add a tooltip explaining username restrictions.

### **4. 📌 Dynamic Fee Calculation**
- 📌 Use the `calculateProfileFee` function to dynamically fetch the required fee for profile creation.
- 📌 Show the calculated fee in ETH and USD.

### **5. 📌 Create a Profile**
- 📌 Add a "Claim Username" button to trigger the `createProfile` function.
- 📌 Use `Transaction` and `TransactionButton` from `@coinbase/onchainkit` to handle the transaction process.

### **6. 📌 Display Profiles**
- 📌 Use `getProfiles` to fetch and display profiles on the landing page.

### **7. 📌 Fetch Profile Data**
- 📌 Use the `getProfileDetails` function to fetch and display profile data on `/[username]` pages.
- 📌 Display fields like username, "About Me," total tips, and social links.
- ⭐️ Add error handling for invalid or non-existent usernames.


---

## **Profile Interaction**

### **8. 📌 Send Tips**
- 📌 Add a "Send Tip" form on the `/[username]` page.
- 📌 Let users specify an ETH amount and send it to the profile contract.
- ⭐️ Show a confirmation message with transaction details.

### **9. 📌 Withdraw Tips**
- 📌 Add a "Withdraw Tips" button for profile owners.
- 📌 Use the `withdraw` function to enable fund withdrawal.

### **10. 📌 Display Recent Donations**
- 📌 Fetch and display recent donations on the `/[username]` page.
- 📌 Include details like the sender address, amount, and optional message.
- ⭐️ Add ETH-to-USD conversion for donation amounts.

### **11. 📌 Social Media Links**
- 📌 Enhance profiles by adding and validating links to social media accounts.
- 📌 Allow clickable icons for Twitter, Discord, etc.

---

## **Enhancements**

### **12. 📌 Allow Profile Updates**
- 📌 Add an "Edit Profile" button for logged-in users who own the profile.
- 📌 Use the `update functions in the profile contract` to change details like "About Me" and social links.
- ⭐️ Allow profile picture and banner updates.

### **13. ⭐️ Leaderboard of Top Profiles**
- ⭐️ Use a contract query to fetch the top 5 most-tipped profiles.
- ⭐️ Display a leaderboard with usernames and total tips.
- ⭐️ Include profile pictures and links to individual profile pages.

### **14. ⭐️ Improve Profile Validation**
- ⭐️ Add input validation for profile creation.
  - ⭐️ Ensure usernames are unique, contain no spaces, and meet length requirements.
- ⭐️ Suggest alternative usernames if the chosen one is unavailable.

---

## **Finalization**

### **15. ⭐️ Deploy and Test**
- ⭐️ Deploy the updated dApp.
- ⭐️ Test wallet connection, profile creation, tips, and withdrawals live.

### **16. ⭐️ Multi-Wallet Support**
- ⭐️ Add support for WalletConnect, MetaMask, and Coinbase Wallet.
- ⭐️ Allow users to switch wallets and re-authenticate.

---