# TrustChain — Blockchain Charity Donation Tracker

A complete full-stack demo project with:

- Attractive React + Vite frontend
- Three login roles: Admin, Donor, Charity
- MetaMask wallet connection and account switching
- Real Hardhat-local blockchain donations
- Public donation ledger and receipt verification
- Pinata/IPFS proof bill upload through FastAPI backend
- Admin charity/proof/withdrawal verification workflow
- Solidity smart contract + Hardhat deployment script

## 1. Start blockchain

```powershell
cd blockchain
npm install
npm run node
```

Keep this terminal open.

## 2. Deploy contract

Open another terminal:

```powershell
cd blockchain
npm run deploy:local
```

Copy the deployed contract address printed in terminal.

## 3. Configure frontend

Create `frontend/.env` from `.env.example`:

```env
VITE_API_BASE=http://localhost:8000
VITE_CONTRACT_ADDRESS=paste_deployed_contract_address_here
VITE_CHAIN_ID=31337
VITE_PINATA_GATEWAY=https://gateway.pinata.cloud
```

## 4. Configure backend for Pinata

Create `backend/.env` from `.env.example`:

```env
APP_NAME=TrustChain API
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
PINATA_JWT=paste_pinata_jwt_here
PINATA_GATEWAY=https://gateway.pinata.cloud
```

## 5. Run backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Backend docs: `http://localhost:8000/docs`

## 6. Run frontend

```powershell
cd frontend
npm install
npm run dev
```

Open: `http://localhost:5173`

## MetaMask local network

Add network:

- Network name: Hardhat Local
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `31337`
- Currency: `ETH`

Import any private key printed by `npm run node`. These accounts have 10,000 fake ETH.

## Demo users

Use the login page quick buttons:

- Donor: `donor@trustchain.org`
- Charity: `charity@trustchain.org`
- Admin: `admin@trustchain.org`

No real password validation is used in this demo.

## Important

Hardhat local blockchain resets when you restart `npm run node`. After every restart, run `npm run deploy:local` again and update `frontend/.env` with the new contract address.
