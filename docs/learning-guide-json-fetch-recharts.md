# 2-Hour Practical Learning Guide: JSON, Fetch API & Recharts Bar Chart

**Target Audience:** Laksh Panthi  
**Focus:** Environmental Data Engineering, Web Data Fetching & React Data Visualization  
**Time Commitment:** ~2 Hours (Self-Paced with Hands-on Code)  

---

## 🧭 Learning Roadmap Overview

| Module | Topic | Estimated Time | Core Skill Acquired |
| :--- | :--- | :--- | :--- |
| **Module 1** | JSON Data Modeling & Manipulation | 30 minutes | Schema design, serialization, validation |
| **Module 2** | The Modern `fetch()` API & Async React | 45 minutes | Promises, `async/await`, error boundaries |
| **Module 3** | Recharts: Building Interactive Bar Charts | 45 minutes | SVG rendering, responsive charts, custom tooltips |

---

# Module 1: JSON (JavaScript Object Notation) Mastery (~30 Mins)

### 1.1 What is JSON?
JSON is a language-independent, lightweight data-interchange format. It is plain text formatted using JavaScript object syntax conventions.

### 1.2 Strict Syntax Rules (Where Beginners Get Tripped Up)
1. **Keys MUST be wrapped in double quotes**: `"name": "Coimbra"` (Single quotes `'name'` or unquoted `name` will cause `SyntaxError`).
2. **String values MUST be wrapped in double quotes**: `"waterBody": "Rio Mondego"`.
3. **No Trailing Commas**: `[1, 2, 3,]` is illegal in JSON.
4. **Allowed Data Types**: `string`, `number`, `boolean` (`true`/`false`), `array`, `object`, `null`.
   *(Functions, `undefined`, and `Date` objects cannot be stored in JSON directly).*

### 1.3 Parsing & Stringifying with Error Handling

```javascript
// Example: Converting a raw JSON string into usable JavaScript objects
const rawJsonString = `{
  "siteId": "COI-001",
  "temperature": 18.4,
  "isMonitored": true
}`;

try {
  // 1. Parse string to Object
  const parsedData = JSON.parse(rawJsonString);
  console.log("Site ID:", parsedData.siteId); // Output: COI-001

  // 2. Modifying data
  parsedData.temperature = 19.1;

  // 3. Stringify back to JSON with 2-space indentation for readability
  const formattedJson = JSON.stringify(parsedData, null, 2);
  console.log(formattedJson);
} catch (error) {
  console.error("Invalid JSON format detected:", error.message);
}
```

### 1.4 Real-World Schema Design: OneAquaHealth
In environmental citizen science, schema design must support both site metadata and time-series observations:

```json
{
  "id": "BEN-002",
  "name": "Confluenza Calore-Sabato",
  "city": "Benevento",
  "coordinates": { "lat": 41.1307, "lng": 14.7825 },
  "measurements": {
    "waterTempC": 17.5,
    "pH": 7.4,
    "dissolvedOxygenMgL": 8.2
  },
  "source": "synthetic"
}
```

---

# Module 2: The Modern `fetch()` API & Async Patterns (~45 Mins)

### 2.1 Anatomy of `fetch()`
The browser-native `fetch()` function returns a **Promise** that resolves to the HTTP `Response` object.

```javascript
// Basic fetch pattern with async/await
async function loadSitesData() {
  try {
    const response = await fetch('/data/sites.json');

    // Crucial: fetch does NOT throw on HTTP 404 or 500!
    // You MUST check response.ok manually:
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status} ${response.statusText}`);
    }

    const sites = await response.json(); // Parses response stream as JSON
    console.log(`Successfully loaded ${sites.length} sites`);
    return sites;
  } catch (error) {
    console.error("Failed to fetch sites data:", error.message);
    throw error;
  }
}
```

### 2.2 React Data Fetching Hook Pattern
In a React dashboard, data fetching typically happens inside `useEffect` with three states:
1. `data` (the payload)
2. `isLoading` (boolean flag for spinner/skeleton)
3. `error` (capture failures gracefully)

```jsx
import React, { useState, useEffect } from 'react';

export function useAquaData() {
  const [data, setData] = useState({ sites: [], observations: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // AbortController allows canceling request if component unmounts
    const controller = new AbortController();

    async function fetchData() {
      try {
        setLoading(true);
        // Parallel fetching using Promise.all for high performance!
        const [sitesRes, obsRes] = await Promise.all([
          fetch('/data/sites.json', { signal: controller.signal }),
          fetch('/data/seed-observations.json', { signal: controller.signal })
        ]);

        if (!sitesRes.ok || !obsRes.ok) {
          throw new Error('One or more data resources failed to load.');
        }

        const sites = await sitesRes.json();
        const observations = await obsRes.json();

        setData({ sites, observations });
        setError(null);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    return () => controller.abort(); // Cleanup on unmount
  }, []);

  return { ...data, loading, error };
}
```

---

# Module 3: Recharts Bar Chart Deep-Dive (~45 Mins)

### 3.1 Why Recharts?
- **Declarative:** Built using standard React components (`<BarChart>`, `<Bar>`, `<XAxis>`).
- **SVG-Based:** Razor-sharp rendering on all displays without canvas blurriness.
- **Responsive:** Scales automatically with container size via `<ResponsiveContainer>`.

### 3.2 Transforming Flat JSON into Recharts-Ready Data
Recharts expects an array of objects where each object represents one entry on the X-axis:

```javascript
// Raw data transform: Aggregate sites by city
function buildCityChartData(sites, observations) {
  const checkedSiteIds = new Set(observations.map(obs => obs.siteId));
  
  const cityMap = {};
  
  sites.forEach(site => {
    if (!cityMap[site.city]) {
      cityMap[site.city] = { city: site.city, totalSites: 0, checkedSites: 0, neverChecked: 0 };
    }
    cityMap[site.city].totalSites += 1;
    if (checkedSiteIds.has(site.id)) {
      cityMap[site.city].checkedSites += 1;
    } else {
      cityMap[site.city].neverChecked += 1;
    }
  });

  return Object.values(cityMap);
}
/*
Resulting structure for Recharts:
[
  { city: "Coimbra", totalSites: 20, checkedSites: 15, neverChecked: 5 },
  { city: "Benevento", totalSites: 20, checkedSites: 12, neverChecked: 8 },
  ...
]
*/
```

### 3.3 Complete Runnable Recharts Bar Chart Component

```jsx
import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

// Custom Tooltip component with Tailwind styling
const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-lg shadow-lg border border-slate-700 text-xs">
        <p className="font-bold text-sm text-sky-400 mb-1">{label}</p>
        <p className="text-emerald-300">Checked: {payload[0]?.value} sites</p>
        <p className="text-amber-400">Never-Checked: {payload[1]?.value} sites</p>
        <div className="mt-1 pt-1 border-t border-slate-800 text-slate-400">
          Coverage: {Math.round((payload[0]?.value / (payload[0]?.value + payload[1]?.value)) * 100)}%
        </div>
      </div>
    );
  }
  return null;
};

export function CityBarChart({ data }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Monitoring Coverage by Pilot City
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Distribution of checked vs. pending sites across 5 European basins
          </p>
        </div>
      </div>

      {/* ResponsiveContainer must have a parent with a defined height or give it a fixed height */}
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
            <XAxis
              dataKey="city"
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#cbd5e1' }}
              domain={[0, 25]}
            />
            <Tooltip content={<CustomChartTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              iconType="circle"
            />
            {/* Bar 1: Monitored sites */}
            <Bar
              dataKey="checkedSites"
              name="Monitored Sites"
              fill="#0ea5e9"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            {/* Bar 2: Never checked sites */}
            <Bar
              dataKey="neverChecked"
              name="Never-Checked Sites"
              fill="#f59e0b"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
```

---

## 4. Hands-On Exercises & Knowledge Check

### Exercise 1: Computing "Avg Days Since Check"
Write a function that accepts an array of observations and calculates the average elapsed days.

**Solution:**
```javascript
function calculateAvgDaysSinceCheck(observations) {
  if (!observations || observations.length === 0) return 0;
  
  // Get most recent check per site
  const latestBySite = {};
  const now = new Date("2026-10-02T18:00:00Z").getTime();

  observations.forEach(obs => {
    const obsTime = new Date(obs.timestamp).getTime();
    if (!latestBySite[obs.siteId] || obsTime > latestBySite[obs.siteId]) {
      latestBySite[obs.siteId] = obsTime;
    }
  });

  const siteTimes = Object.values(latestBySite);
  const totalDays = siteTimes.reduce((acc, timestamp) => {
    const diffDays = (now - timestamp) / (1000 * 60 * 60 * 24);
    return acc + diffDays;
  }, 0);

  return (totalDays / siteTimes.length).toFixed(1);
}
```

### Exercise 2: Stacked Bar Chart Variation
In `<BarChart>`, to turn side-by-side bars into a **stacked bar**, add `stackId="a"` to both `<Bar>` tags:
```jsx
<Bar dataKey="checkedSites" stackId="a" fill="#0ea5e9" />
<Bar dataKey="neverChecked" stackId="a" fill="#f59e0b" />
```
Now each city column shows a combined 20-site height, with color segments indicating checked vs. never checked proportion!
