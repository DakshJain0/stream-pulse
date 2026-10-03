# OneAquaHealth: Demo Video Recording, Editing & Screenshot Guide

**Creator:** Laksh Panthi  
**Deliverable:** 3–5 Minute Demo Video & Portfolio Screenshots  
**Target Platform:** YouTube (Unlisted or Public) + Hackathon Submission Portal (Devpost / IEEE)  

---

## 1. Video Script & Timestamped Storyboard (3–5 Minutes)

### Target Duration: ~3 minutes 45 seconds

```
+-----------------------------------------------------------------------------------------+
| TIMELINE OVERVIEW                                                                       |
| 0:00 - 0:35  [Hook] Urban Freshwater Crisis & OneAquaHealth Mission                     |
| 0:35 - 1:15  [Data Architecture] 100 Sites Across 5 European Cities & Synthetic Data    |
| 1:15 - 2:05  [Dashboard Metrics] 3 Core Stat Cards (Coverage, Stale Sites, Avg Days)    |
| 2:05 - 2:50  [Interactive Analytics] Recharts City Bar Chart & Dynamic Filtering        |
| 2:50 - 3:30  [Citizen Science Activation] Community Challenge & Priority Target Queue    |
| 3:30 - 3:50  [Conclusion] One Health Impact & Future Expansion                          |
+-----------------------------------------------------------------------------------------+
```

---

### Segment 1: The Hook & OneAquaHealth Mission (0:00 – 0:35)
* **Visual on Screen:** Title slide showing project name, OneAquaHealth logo, and Laksh Panthi's name, followed by opening browser view of the dashboard.
* **Audio / Voiceover:**
  > *"Hello everyone! I'm Laksh Panthi, and today I'm excited to present the OneAquaHealth Citizen Science Dashboard. Urban streams and rivers are the lifeblood of our cities, directly influencing human health, microclimates, and biodiversity. Yet, environmental agencies often lack the continuous field presence needed to detect degradation early.*  
  > *Under the One Health paradigm, this dashboard bridges the gap: empowering citizen scientists across Europe to monitor urban waterways and transforming crowdsourced field checks into real-time surveillance for decision-makers."*

---

### Segment 2: Data Architecture & Multi-City Scope (0:35 – 1:15)
* **Visual on Screen:** Quick split-screen or transition to the `data/` folder structure (`sites.json`, `seed-observations.json`), then showing the map/pilot city list on the dashboard.
* **Audio / Voiceover:**
  > *"Our data pipeline is built around the 5 official OneAquaHealth pilot cities: Coimbra in Portugal, Benevento in Italy, Ghent in Belgium, Oslo in Norway, and Toulouse in France.*  
  > *We expanded our initial 15-site benchmark into an exhaustive registry of 100 monitoring sites—exactly 20 per city. Because real-time sensor APIs are currently restricted within consortium partners, our datasets are derived from published Zenodo sampling protocols and explicitly labeled with `source: 'synthetic'`. We've pre-seeded the platform with over 130 realistic citizen observations spanning water temperature, pH, dissolved oxygen, turbidity, and ecological well-being ratings."*

---

### Segment 3: The 3 Core Stat Cards (1:15 – 2:05)
* **Visual on Screen:** Zoom in smoothly on the 3 top stat cards on the dashboard, hovering cursor over each value.
* **Audio / Voiceover:**
  > *"At the heart of the dashboard are three primary intelligence indicators:*  
  > *First, **Coverage Percentage (72%)** — immediately shows that 72 out of 100 sites have at least one active citizen check.*  
  > *Second, **Never-Checked Sites (28 sites / 28%)** — an urgent operational metric that alerts coordinators to unmonitored aquatic zones.*  
  > *Third, **Average Days Since Check (11.4 days)** — giving municipalities a pulse on data freshness, so we know whether our environmental picture is up to date or getting stale."*

---

### Segment 4: Interactive Analytics & Recharts Bar Chart (2:05 – 2:50)
* **Visual on Screen:** Cursor moves to the interactive Recharts Bar Chart. Click city toggle pills (Coimbra, Oslo, etc.), hover over bars to trigger custom tooltips, switch between 'Total vs Checked' views.
* **Audio / Voiceover:**
  > *"To compare urban progress, we built this responsive Recharts bar chart component. Here, each of our 5 pilot cities is visualised side-by-side.*  
  > *Hovering over Ghent or Toulouse breaks down active checks versus remaining gaps. We can instantly see that Oslo has high monitoring density, while Benevento requires dedicated volunteer mobilization.*  
  > *Filtering by city dynamically updates all cards and observational feeds instantly in the browser, showing how modular React state seamlessly interacts with standard JSON data."*

---

### Segment 5: Citizen Science Activation & Priority Queue (2:50 – 3:30)
* **Visual on Screen:** Scroll to the Community Challenge Progress Bar and the Priority Sites Action Table. Click on a site to open its observation history drawer.
* **Audio / Voiceover:**
  > *"Citizen science thrives on community motivation. Our **Community Challenge Progress Bar** tracks the collective goal—currently at 130 checks toward our milestone target of 200 checks, awarding the community the 'Silver River Scout' badge.*  
  > *Directly below, coordinators have a 'Never-Checked Priority Queue' that highlights exactly which stream reaches—like Valagão do Choupal in Coimbra or Alna Canyon in Oslo—need volunteer boots on the ground today."*

---

### Segment 6: Conclusion & Call to Action (3:30 – 3:50)
* **Visual on Screen:** Full dashboard view, showing GitHub repository link and closing credits.
* **Audio / Voiceover:**
  > *"By coupling transparent open data standards with intuitive visual analytics, the OneAquaHealth dashboard turns raw citizen science into actionable environmental protection.*  
  > *The complete source code, synthetic data schemas, and documentation are available on our GitHub repository. Thank you for watching!"*

---

## 2. Recording & Production Setup (Windows)

### Recommended Tools
1. **Screen Capture:**
   - **OBS Studio (Recommended):** Set Canvas to 1920x1080 @ 60 FPS, Bitrate 8000–12000 Kbps (CBR), Audio 320 Kbps.
   - **Windows Game Bar (`Win + G`):** Quick fallback recording with high-quality stereo audio.
2. **Audio:**
   - Use a decent headset or USB microphone.
   - Enable Noise Suppression filter in OBS (RNNoise) to eliminate background fan or room noise.
3. **Cursor Visibility:**
   - In Windows Mouse Settings, enable "Show location of pointer when I press the CTRL key" or use an OBS cursor highlight plugin.
4. **Browser Cleanliness:**
   - Use Google Chrome or Microsoft Edge in full-screen (`F11`).
   - Zoom level: 100% or 110% for crisp typography.
   - Close all unrelated browser tabs, bookmarks bar, and desktop notifications (`Focus Assist: On`).

---

## 3. Editing Checklist (DaVinci Resolve / CapCut / Premiere)

- [ ] **Intro Card (0–3s):** Title, OneAquaHealth Hackathon badge, and Laksh Panthi's name.
- [ ] **Smooth Zooms (Punch-ins):** Cut 1.2x zoom into the 3 stat cards during Segment 3 to focus viewer attention.
- [ ] **Tooltip Callouts:** Highlight mouse hover interactions over the Recharts bars.
- [ ] **Audio Normalization:** Normalize voiceover to -14 LUFS (YouTube standard).
- [ ] **Background Music:** Subtle, upbeat ambient electronic or lo-fi track set to **-26 dB** (never overpowering the speech).
- [ ] **Outro (5s):** GitHub repo link, IEEE/OneAquaHealth acknowledgment.

---

## 4. Screenshot Capture Checklist (For Slides & Submission)

Capture these 5 key screenshots at 1920x1080 PNG:
1. `screenshot-01-dashboard-overview.png`: Full dashboard viewport showing top header, 3 stat cards, and community challenge progress.
2. `screenshot-02-stat-cards.png`: Close-up of the 3 stat cards (Coverage %, Never-Checked Sites, Avg Days Since Check).
3. `screenshot-03-recharts-barchart.png`: Focused view of the Recharts 5-city bar chart with interactive tooltip active.
4. `screenshot-04-community-challenge.png`: Close-up of the community goal progress bar, milestone tiers, and badge.
5. `screenshot-05-priority-sites-table.png`: Never-checked sites alert queue with priority tags and city filters.

---

## 5. YouTube Upload Metadata (Copy & Paste)

### Video Title:
```
OneAquaHealth Citizen Science Dashboard | Data & Monitoring Hub | Laksh Panthi
```

### Video Description:
```markdown
Interactive Citizen Science Monitoring Dashboard for the OneAquaHealth Horizon Europe Initiative / IEEE Global Hackathon.

Developed by: Laksh Panthi
Role: Data, Dashboard & Demo Video

📌 Chapters:
0:00 - Introduction & One Health Vision
0:35 - Multi-City Data Architecture (100 Sites, 5 Pilot Cities)
1:15 - Core Surveillance Metrics (Coverage %, Stale Sites, Avg Days)
2:05 - Recharts City Analytics & Environmental Indicators
2:50 - Community Challenge & Priority Target Queue
3:30 - Conclusion & Hackathon Submission

🌐 Pilot Cities Monitored:
- Coimbra, Portugal (Mondego Basin)
- Benevento, Italy (Calore & Sabato Rivers)
- Ghent, Belgium (Leie & Schelde Canals)
- Oslo, Norway (Akerselva & Urban Streams)
- Toulouse, France (Garonne & Canal du Midi)

💻 Tech Stack:
React, Vite, Recharts, Tailwind CSS, Zenodo Harmonized Protocols, JSON Data Pipeline.

All synthetic datasets are strictly labeled with source: 'synthetic' in compliance with open science guidelines.

#OneAquaHealth #CitizenScience #DataVisualization #React #Recharts #OneHealth #Hackathon
```

### Video Tags:
`OneAquaHealth, Citizen Science, Water Quality, Recharts, React Dashboard, Open Data, IEEE Hackathon, Environmental Monitoring, Coimbra, Ghent, Oslo, Toulouse, Benevento, Horizon Europe`
