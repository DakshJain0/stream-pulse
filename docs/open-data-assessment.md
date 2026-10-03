# OneAquaHealth: Citizen Science App & Open Data Assessment Note

**Author:** Laksh Panthi  
**Role:** Data, Dashboard & Demo Video Lead  
**Date:** October 2026  
**Project:** OneAquaHealth (Horizon Europe Grant No. 101086521) / IEEE Global Hackathon  

---

## 1. App Installation & Onboarding Walkthrough

The **OneAquaHealth Citizen Science App** connects urban residents with freshwater ecosystem health, adopting a holistic "One Health" framework (ecosystem health $\leftrightarrow$ human well-being).

### Steps Followed:
1. **Community Registration:** Registered on the official [OneAquaHealth Community Hub](https://www.oneaquahealth.eu/) to access onboarding guidelines and pilot city networks.
2. **App Deployment:** Installed the mobile client (Android / iOS) and explored volunteer workflows across the 5 project pilot study cities:
   - **Coimbra** (Portugal) — Rio Mondego & urban tributaries
   - **Benevento** (Italy) — Calore Irpino & Sabato rivers
   - **Ghent** (Belgium) — Leie, Schelde & historical canals
   - **Oslo** (Norway) — Akerselva & urban fjord catchments
   - **Toulouse** (France) — Garonne river & Canal du Midi
3. **Session 5 Review ("Build with OneAquaHealth: Turning Data into Hackathon Innovation"):**
   - Examined the role of the **Digital Platform & Hub Tools** as a bridge between volunteers and municipal decision-makers.
   - Reviewed how citizen observations feed into the AI-based Environmental Surveillance System for early ecological warning signs.

---

## 2. Half-Page Note: Open Data Availability & Landscape

### Executive Summary & Availability Matrix
Urban aquatic ecosystem data in the OneAquaHealth ecosystem falls into three tiers: **Openly Available**, **Partially Open / Federated**, and **Restricted / In-Validation**.

| Data Category | Open Status | Source & Protocol | Formats | Hackathon Readiness |
| :--- | :--- | :--- | :--- | :--- |
| **Field Sampling Protocols** | ✅ Fully Open | Zenodo (FAIR open access) | PDF / Harmonized Standard | Ready for schema design |
| **Satellite Environmental Indices** | ✅ Fully Open | Copernicus Sentinel-2 / EU Earth Observation | GeoTIFF, NetCDF, GeoJSON | Freely queryable |
| **Stream Geography & Pilot Sites** | ✅ Open / Municipal | OpenStreetMap / European Water Data / INSPIRE | GeoJSON, Shapefiles, WFS | Open coordinate mapping |
| **Citizen Science Observations** | ⚠️ Semi-Open (Hub Gated) | OneAquaHealth Hub Tools | REST API (Auth), CSV/JSON exports | Requires community login |
| **High-Frequency In-Situ IoT Sensors**| 🔒 Restricted / Pilot-Only | Partner Research Institutes (CEAB, CNR, etc.) | Time-series DB (Influx/PostgreSQL) | Embargoed during validation |
| **Microbial / eDNA Biomonitoring** | 🔒 Restricted | Laboratory Benchmarks | FastQ / CSV summary reports | Post-study publication |

### What Data Is Openly Available:
1. **Harmonized Ecological Protocols (Zenodo):**
   Standardized observation variables are formally published. These define specific measurement metrics: water temperature ($^\circ\text{C}$), pH, dissolved oxygen ($\text{mg/L}$), water clarity/turbidity (Secchi depth / NTU), macroinvertebrate family biotic index (BMWP/ASPT), riparian canopy coverage, and trash accumulation scores (0–5).
2. **Citizen Science Perception Metrics:**
   A unique dimension of OneAquaHealth is the *perceptual well-being index* (scale 1–5): citizens record feelings of restoration, mental tranquility, and perceived olfactory/aesthetic quality when visiting stream sites.
3. **Geospatial Catchment Boundaries:**
   River corridors, weir locations, and urban stormwater discharge points across Coimbra, Benevento, Ghent, Oslo, and Toulouse are openly queryable through OpenStreetMap and the European Environment Agency (EEA) Water Information System for Europe (WISE).

### Limitations & Strategy for Dashboard Development:
Direct public API endpoints for real-time live citizen submissions are currently restricted behind user authentication in the OneAquaHealth Hub community portal, and real-time physical sensor nodes are reserved for scientific partners until publication.

**Hackathon Data Strategy:**
- We anchor our site registry (`data/sites.json`) to authentic geographic coordinates and hydrological names across all 5 pilot cities.
- In full compliance with Hackathon rules, all observation entries and expanded site checks are generated using authentic scientific distributions derived from the Zenodo protocols and explicitly tagged with `"source": "synthetic"`.
- This ensures reproducible local development, complete visual coverage for the dashboard, and zero dependency on gated API tokens.
