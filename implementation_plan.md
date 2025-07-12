## ✅ What You’ll Build in the Hackathon (3-Day Scope)

### 🎯 **Core Flow (End-to-End)**

1. **Connect Wallet**
   * Integrate the Rainbow kit wallet for the dapp

2. **Map View with Location Pins (Hardcoded)**
   * Show 5–10 random locations nearby on a map
   * Users will have to share current location with app so we're able to show monuments in proximity

3. **Place a Monument (AR Camera + Token Gating)**

   * When at a tagged location:

     * Open AR cam (WebXR or Zappar)
     * Select a club from a short list (e.g., PSG, BAR, RMA)
     * Stake fan tokens (e.g., PSG) to place their monument
     * Monument is a 3D model animated image anchored to the space

4. **Territory Ownership + Scoring**

   * Each monument contributes to that **club’s territory score**
   * Display leaderboard by club (e.g., PSG: 3 zones, BAR: 2 zones)
   * Optional: allow other users to **view monuments in their area** and “like” them

---

### 📦 Features by Track Alignment

| Hackathon Track          | MVP Feature(s)                                                      |
| ------------------------ | ------------------------------------------------------------------- |
| 🏅 Fan Token Utility     | Token-staked monument placement, territory scoring                  |
| 🎨 Fan-Created Content   | Optional: Add photo, chant, or 3D emote to your monument            |
| 💼 Socios Wallet         | Connect wallet, read fan token balances, require tokens for actions |
| 🧠 AI (Optional Stretch) | AI-generated quote/banner for your monument based on chosen player  |

---

## 🛠️ Tech Stack (Hackathon-Friendly)

| Layer       | Tools                                                           |
| ----------- | --------------------------------------------------------------- |
| AR          | WebXR (Three.js)           |
| Wallet      | Rainbow kit wallet           |
| Blockchain  | Chiliz EVM contracts (basic token read/stake functions)         |
| Backend     | Supabase to store monument placements & zone scores- api NEXTJS api express
| UI/Frontend | React Nextjs + TailwindCSS  +shadcn/ui             |

---

## 📅 3-Day Build Plan

### 🗓️ Day 1: Foundations

* [ ] Rainbow kit wallet + fan token detection
* [ ] Basic map with hardcoded points
* [ ] Supabase setup for zone + monument state

### 🗓️ Day 2: AR + Monument System

* [ ] WebXR cam + simple 3D/2D monument anchoring
* [ ] Monument placement with token stake logic
* [ ] Zone ownership calculation and leaderboard

### 🗓️ Day 3: Polish + Demo

* [ ] Add basic UX polish (icons, transitions)
* [ ] Live leaderboard page
* [ ] Deploy to testnet
* [ ] Record demo video & prepare pitch

---

## 🎁 Bonus Stretch (if time permits)

* 🎨 Let fans attach a chant, photo, or emoji to their monument
* 🤝 Flash Raids: Enable time-limited tag battles (e.g. 10 mins to tag a zone)
* 🧠 Add AI-generated "tributes" for player monuments using a small LLM or prompt-based model

 