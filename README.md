## **TurfStake AR**

**Claim your turf. Raise your club's legacy.**

TurfStake AR is a geo-based augmented reality experience where fans turn real-world locations into evolving monuments for their favorite sports clubs using **Chiliz fan tokens**.

Fans stake their tokens at physical locations to anchor and upgrade **AR monuments** — transforming streets, cafes, and landmarks into living tributes to their teams. The more tokens staked at a monument, the more it **levels up** (from Level 1 to 5), visually evolving and climbing the club monument leaderboard.

Each monument is:

* **Anchored to an immovable real-world object** using an image uploaded by the fan.
* **Visualized in AR** via WebXR (ARCore on Android) when users are near the location.
* **Monetized with club sponsor ads** — generating **revenue share** for staking fans.
* **A gateway to rewards** — like exclusive merch, discount NFTs, and fan privileges from the club.

Think **Turf Wars x Pokémon GO** — but for your team.

---

### Core Features

1. **Map Page**
   Explore a global view of all active club monuments and their levels, locations, and club rankings.

2. **Create Monument Page**

   * Use your current GPS location.
   * Upload or capture a photo of a **permanent object** (like a statue, building, or sign) to serve as the AR anchor.
   * Choose your club and stake fan tokens to mint a Level 1 monument.

3. **AR Viewer Page**

   * When near a monument, open the viewer to see the club monument anchored to the real-world object.
   * Interact, take photos, and view dynamic upgrades as levels increase.

4. **Monument Stats Page**

   * View total tokens staked, top contributing fans, monument level (1-5), and live sponsor ads.
   * See your club's global monument ranking (#1, #2, etc.).
   * Monuments gain visual upgrades and unlock perks at each level.

---

### Setup Instructions

1. **Install dependencies:**
   ```bash
   yarn install
   ```

2. **Configure environment variables:**
   Create a `.env.local` file in the root directory with the following variables:
   ```bash
   # Pinata IPFS Configuration (required for image uploads)
   NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_token_here
   NEXT_PUBLIC_PINATA_GATEWAY_URL=https://gateway.pinata.cloud
   
   # WalletConnect Project ID (already set with default)
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=3efcd27f7b2cd095a70a209a01033aa7
   ```
   
   **Note:** The map uses OpenStreetMap which doesn't require any API keys, but you'll need to set up Pinata for image uploads in campaign creation.

3. **Run the development server:**
   ```bash
   yarn dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000` to see the application.
