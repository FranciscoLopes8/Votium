# Votium 🗳️

> A decentralized, blockchain-based e-voting mobile application built with React Native (Expo), Express.js, and Ethereum smart contracts.
>


---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Smart Contract](#smart-contract)
- [Backend API](#backend-api)
- [Database Models](#database-models)
- [Scalability Benchmarks](#scalability-benchmarks)
- [Security](#security)

---

## Overview

Votium is a full-stack decentralized voting platform that combines the transparency of the Ethereum blockchain with the accessibility of a cross-platform mobile application. It allows authorized users to create elections, register candidates, and cast votes in a secure and verifiable manner. All ballot records are stored immutably on-chain, ensuring a tamper-proof, transparent election process.

**Key highlights:**

-  **Blockchain-anchored votes** — ballots are recorded on Ethereum via Solidity smart contracts, making results publicly auditable and immutable.
-  **Cryptographic privacy** — voter codes are hashed with `keccak256` before on-chain storage; votes cannot be linked to an identity without the personal code.
-  **Double-vote prevention** — enforced at smart contract level via `mapping(address => bool)` and personal code uniqueness checks.
-  **Cross-platform** — runs on iOS, Android, and Web from a single codebase using Expo.
-  **Hardened backend** — JWT auth (HttpOnly cookies), brute-force rate limiting (5 req/15 min), HTTPS communication, and SecureStore on-device token storage.
-  **Role-based access** — Admin and User roles with separate permissions (e.g., only admins can view live vote statistics).

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Mobile App (Expo / RN)                   │
│          TypeScript · NativeWind · expo-router              │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS REST (Express)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                     Backend (Node.js)                       │
│     Express · JWT Auth · Twilio · Multer · Rate Limiter     │
│                         │                                   │
│          ┌──────────────┴────────────────┐                  │
│          ▼                               ▼                  │
│    MongoDB (Mongoose)          Ethereum Network             │
│    users, candidates,          ethers.js · Truffle          │
│    off-chain metadata          HDWallet Provider            │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│               Solidity Smart Contract (Voto)                │
│       keccak256 hashing · mapping-based dedup               │
│       VotoRegistado event · immutable ballot storage        │
└─────────────────────────────────────────────────────────────┘
```

> The backend was prototyped and stress-tested on a **Raspberry Pi 3B** (ARM Cortex-A53, 1 GB RAM) to validate behaviour under constrained hardware conditions.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile Frontend | React Native 0.79, Expo 53, TypeScript 5.8 |
| Routing | expo-router v5 (file-based) |
| Styling | NativeWind 4 (Tailwind CSS for RN) |
| Secure Storage | expo-secure-store |
| Local Storage | AsyncStorage |
| Backend | Node.js, Express 4 |
| Database | MongoDB via Mongoose 8 |
| Authentication | JWT (`jsonwebtoken`), bcryptjs |
| File Uploads | Multer |
| Blockchain | Ethereum, ethers.js v5 |
| Smart Contracts | Solidity ^0.8.13 |
| Contract Tooling | Truffle, @truffle/hdwallet-provider |
| Local Blockchain | Ganache (port 7545) |


---

## Project Structure

```
Votium/
├── app/                        # Expo Router screens (file-based routing)
│   ├── (auth)/                 # Login, Register, OTP screens
│   ├── (tabs)/                 # Main tab screens (elections, results, profile)
│   └── _layout.tsx             # Root layout
├── assets/
│   ├── images/                 # Icons, splash, adaptive icon
│   └── screenshots/            # App screenshots (for README)
├── backend/
│   ├── middleware/
│   │   └── upload.js           # Multer file upload middleware
│   ├── models/
│   │   ├── User.js             # Mongoose User model
│   │   └── Candidate.js        # Mongoose Candidate model
│   ├── routes/
│   │   ├── authRegister.js     # POST /auth/register
│   │   ├── authLogin.js        # POST /auth/login
│   │   ├── authPerfil.js       # GET  /auth/perfil
│   │   ├── candidates.js       # CRUD /candidates
│   │   ├── users.js            # GET  /users
│   │   ├── editProfile.js      # PUT  /perfil
│   │   └── editCandidate.js    # PUT  /candidatoperfil
│   ├── seedAdmin.js            # Seeds the default admin account
│   ├── seedCandidates.js       # Seeds initial candidate data
│   └── server.js               # Express entry point (port 5000)
├── contracts/
│   └── Voto.sol                # Solidity voting contract
├── Truffle/
│   └── truffle-config.js       # Truffle network configuration
├── config.ts                   # Shared backend IP config
├── app.json                    # Expo app configuration
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## Prerequisites

Make sure the following are installed before proceeding:

| Tool | Version | Install |
|---|---|---|
| Node.js | >= 18.x | [nodejs.org](https://nodejs.org) |
| npm | >= 9.x | Bundled with Node.js |
| Truffle | latest | `npm install -g truffle` |
| Ganache | GUI or CLI | [trufflesuite.com/ganache](https://trufflesuite.com/ganache/) |
| Expo CLI | latest | `npm install -g expo-cli` |
| MongoDB | local or Atlas | [mongodb.com](https://www.mongodb.com) |
| Expo Go | latest | iOS App Store / Google Play |

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/FranciscoLopes8/Votium.git
cd Votium
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` is required to resolve peer dependency conflicts between Expo and some blockchain libraries.

### 3. Start the backend

```bash
cd backend
node server.js
```

The API will start on **port 5000** by default.

### 4. Start Ganache

Launch Ganache (GUI or CLI) with the following settings:

```
Port:       7545
RPC Server: http://127.0.0.1:7545
```

### 5. Verify Truffle configuration

Ensure `Truffle/truffle-config.js` matches your Ganache settings:

```js
networks: {
  development: {
    host: "127.0.0.1",
    port: 7545,
    network_id: "*",
  }
}
```

### 6. Deploy the smart contracts

```bash
cd Truffle
truffle migrate --reset
```

After migration completes, copy the deployed **VotoContract address** from the Ganache UI — you will need it in your `.env` file.

### 7. Configure the admin wallet

Open Ganache, copy the **private key** of the first account, then configure it in `backend/seedAdmin.js` and your `.env`:

```env
ADMIN_PRIVATE_KEY=0xYourGanacheAccountPrivateKey
```

### 8. Verify the Ganache URL in AuthPerfil

Confirm that `backend/routes/authPerfil.js` uses the correct local RPC URL:

```
http://127.0.0.1:7545
```

### 9. Set the backend IP in config.ts

Update `config.ts` in the project root with your machine's LAN IP:

```ts
export const IP = "192.168.1.xxx"; // your local network IP
```

> **Why a LAN IP?** When the app runs on a physical device, `localhost` resolves to the device itself, not your development machine. The LAN IP allows Expo Go to reach the backend server over Wi-Fi.

### 10. Launch the mobile app

```bash
npx expo start
```


---


## Environment Variables

Create a `.env` file inside `backend/`:

```env
# Server
PORT=5000

# MongoDB
MONGO_URI=mongodb://localhost:27017/votium

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=2h

# Ethereum / Blockchain
CONTRACT_ADDRESS=0xYourDeployedVotoContractAddress
GANACHE_URL=http://127.0.0.1:7545
ADMIN_PRIVATE_KEY=your_ganache_account_private_key

```


---

## Smart Contract

The `Voto` contract (`contracts/Voto.sol`, Solidity ^0.8.13) is the core of the voting system.

### Data Structures

```solidity
struct Votacao {
    uint   candidatoId;
    string codigoPessoal;
    address votante;
}

mapping(bytes32 => Votacao) public votos;             // keccak256(code) → vote
mapping(address => bool)    public jaVotou;            // address → already voted
mapping(uint => uint)        public votosPorCandidato; // candidateId → vote count
uint public totalVotos;
```

### Public Functions

| Function | Description |
|---|---|
| `votar(uint _candidatoId, string _codigoPessoal)` | Cast a vote. Validates wallet uniqueness, hashes the personal code with `keccak256`, stores the vote, emits `VotoRegistado` |
| `consultarVoto(string _codigoPessoal)` | Look up which candidate a personal code voted for |
| `obterVotosPorCandidato(uint _candidatoId)` | Get total votes for a specific candidate |
| `obterTotalVotos()` | Get the total number of votes cast |
| `obterCodigosPorCandidato(uint, uint, uint)` | Paginated personal code retrieval (max 100 per call) |

### Cryptographic Privacy

Voter privacy is achieved by hashing the personal code before storage:

```solidity
bytes32 hashCodigo = keccak256(abi.encodePacked(_codigoPessoal));
```

The raw code is never stored on-chain. A third party inspecting the blockchain cannot link a vote to a specific voter without already knowing their personal code.

### Events

```solidity
event VotoRegistado(address indexed votante, uint candidatoId, string codigoPessoal);
```

Events provide a public, auditable log of all voting activity without compromising voter anonymity.

---

## Backend API

The Express server (`backend/server.js`) listens on **port 5000**.

### Route Summary

| Method | Path | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new voter |
| `POST` | `/auth/login` | Authenticate and receive JWT cookie |
| `GET` | `/auth/perfil` | Fetch own profile + on-chain data |
| `GET` | `/candidates` | List all candidates |
| `GET` | `/users` | List all users (admin only) |
| `PUT` | `/perfil` | Update user profile |
| `PUT` | `/candidatoperfil` | Update candidate profile |
| `POST` | `/upload` | Upload profile image (Multer) |
| `GET` | `/uploads/:filename` | Serve an uploaded file |

### Authentication

Protected routes require a valid JWT stored as an **HttpOnly cookie** set at login. Token payload:

```json
{ "id": "...", "telefone": "...", "role": "Admin | User" }
```

Token expiry: **2 hours**.

### Rate Limiting

Login and auth endpoints: **5 requests per IP per 15 minutes**.

### Example: Login

```http
POST /auth/login
Content-Type: application/json

{
  "telefone": "+351910000000",
  "senha": "securepassword"
}
```

**Response:**

```json
{
  "token": "eyJhbGci...",
  "user": { "_id": "...", "role": "User" }
}
```

---

## Database Models

### User

```js
{
  primeiroNome:     String  // required
  ultimoNome:       String  // required
  telefone:         String  // required, unique
  senha:            String  // required (bcrypt hash)
  role:             "Admin" | "User"
  codigoPessoal:    String  // required — pre-generated voting code
  imagem:           String  // profile photo path
  walletPrivateKey: String  // required — Ethereum wallet for tx signing
}
```

### Candidate

```js
{
  nome:           String  // required
  partido:        String  // required
  nascimento:     String  // required
  naturalidade:   String  // required
  biografia:      String  // required
  imagem:         String  // required
  cor:            String  // required — party colour
  planoEleitoral: String  // required
}
```

---

## Scalability Benchmarks

Load tests were run with an automated script against Ganache. Each simulated voter was pre-funded with 0.01 ETH to cover gas costs.

| Voters | Successes | Failures | Total Time | Avg / Vote |
|:---:|:---:|:---:|:---:|:---:|
| 10 | 10 | 0 | 1.48 s | 0.148 s |
| 100 | 100 | 0 | 1.48 s | 0.148 s |
| 1,000 | 1,000 | 0 | 64.47 s | 0.064 s |
| 10,000 *(50 ms delay)* | 10,000 | 0 | 4,995 s | 0.500 s |
| 10,000 *(no delay)* | 324 | 9,676 | 253.49 s | 0.025 s |

> **Conclusion:** Ganache is a local development environment unsuitable for high-throughput production loads. For deployment, we should migrate to a permissioned network (Hyperledger Fabric, Ethereum PoA/IBFT) or a public testnet such as **Sepolia**.


## Security

The platform implements a layered security model across all three tiers.

### Smart Contract (Solidity)
- **Reentrancy** — safe; no external calls before state changes.
- **Overflow/underflow** — safe; Solidity ^0.8 built-in arithmetic checks.
- **Double-vote prevention** — enforced via `jaVotou[msg.sender]` and `keccak256`-hashed code uniqueness.
- **Static analysis** — scanned with **Slither**; 5 low-severity alerts, no critical vulnerabilities detected.

### Backend (Node.js)
- JWT signed with a secret, validated by middleware, expires in 2 hours.
- Tokens stored in **HttpOnly cookies** — protected against XSS.
- Brute-force protection: 5 login attempts per IP per 15 minutes.
- CSRF: naturally mitigated — JWT sent via `Authorization` header, not cookies on the API path.
- Sensitive codes generated with `crypto.randomBytes`.
- No plaintext sensitive data (codes, votes, identities) stored in the backend.

### Frontend (React Native)
- Auth tokens in `expo-secure-store` (OS-level encrypted storage), not AsyncStorage.
- React Native's `<Text>` component does not parse HTML, reducing XSS attack surface.
- Generic error messages to prevent information leakage.
- Tokens sent via `Authorization: Bearer <token>` on every request.

---


