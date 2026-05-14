import { useState, useEffect } from "react";

const SUPPLEMENT_LIBRARY = [
  {
    id: "inositol",
    name: "Myo-Inositol",
    dose: "2g",
    timing: "Morning (fasted)",
    withFood: false,
    note: "Take 30 min before breakfast. Improves insulin sensitivity & ovarian function.",
    tags: ["PMOS"],
    color: "#e8a87c",
  },
  {
    id: "d3",
    name: "Vitamin D3 + K2",
    dose: "2000–4000 IU",
    timing: "With breakfast",
    withFood: true,
    note: "Take with fat-containing meal for absorption. Critical for PMOS & thyroid.",
    tags: ["PMOS", "Thyroid"],
    color: "#f9d56e",
  },
  {
    id: "magnesium",
    name: "Magnesium Glycinate",
    dose: "300–400mg",
    timing: "Evening (before bed)",
    withFood: false,
    note: "Reduces cortisol, improves sleep and insulin sensitivity.",
    tags: ["PMOS", "Thyroid"],
    color: "#a8d8ea",
  },
  {
    id: "omega3",
    name: "Omega-3 (EPA/DHA)",
    dose: "1–2g",
    timing: "With lunch",
    withFood: true,
    note: "Anti-inflammatory. Take with food to reduce fishy aftertaste.",
    tags: ["PMOS", "Thyroid"],
    color: "#89c4e1",
  },
  {
    id: "zinc",
    name: "Zinc",
    dose: "15–30mg",
    timing: "With dinner",
    withFood: true,
    note: "Do NOT take with iron. Space 2hrs from thyroid meds. Supports androgen balance.",
    tags: ["PMOS"],
    color: "#b8e0d2",
  },
  {
    id: "selenium",
    name: "Selenium",
    dose: "100–200mcg",
    timing: "Morning (with thyroid meds)",
    withFood: false,
    note: "Supports T4→T3 conversion. Do not exceed 200mcg/day.",
    tags: ["Thyroid"],
    color: "#d4a5c9",
  },
  {
    id: "iron",
    name: "Iron (if deficient)",
    dose: "As prescribed",
    timing: "Morning (fasted)",
    withFood: false,
    note: "Space 4hrs from levothyroxine. Take with Vit C. Do NOT take with zinc.",
    tags: ["Thyroid"],
    color: "#f28b82",
  },
  {
    id: "nac",
    name: "N-Acetyl Cysteine (NAC)",
    dose: "600mg",
    timing: "With breakfast",
    withFood: true,
    note: "Reduces androgens and inflammation. Strong evidence for PMOS.",
    tags: ["PMOS"],
    color: "#ccb4f5",
  },
  {
    id: "b_complex",
    name: "B-Complex (inc. Folate)",
    dose: "1 capsule",
    timing: "With breakfast",
    withFood: true,
    note: "Use methylfolate form if possible. Supports hormonal balance & methylation.",
    tags: ["PMOS", "Thyroid"],
    color: "#ffd6a5",
  },
];

const MEAL_PLANS: Record<string, Record<string, { name: string; desc: string; kcal: number }>> = {
  Monday: {
    breakfast: { name: "Warm Cinnamon Oat Bowl", desc: "Oats with cinnamon, flaxseed, blueberries & almond butter.", kcal: 390 },
    lunch: { name: "Salmon & Roasted Veg Salad", desc: "Baked salmon, rocket, cucumber, cherry tomatoes, olive oil & lemon.", kcal: 520 },
    dinner: { name: "Turkey & Cauliflower Rice Stir-Fry", desc: "Lean turkey mince, mixed peppers, broccoli, tamari & ginger.", kcal: 480 },
    snack: { name: "Greek Yoghurt & Walnuts", desc: "Full-fat Greek yoghurt with walnuts & a drizzle of honey.", kcal: 250 },
  },
  Tuesday: {
    breakfast: { name: "Egg & Spinach Scramble", desc: "3 eggs scrambled with spinach, turmeric, and sourdough.", kcal: 420 },
    lunch: { name: "Lentil Soup with Rye Bread", desc: "Red lentil & tomato soup with cumin, garlic & rye bread.", kcal: 450 },
    dinner: { name: "Baked Cod with Sweet Potato Mash", desc: "Herbed cod fillet, sweet potato mash, steamed green beans.", kcal: 510 },
    snack: { name: "Apple & Almond Butter", desc: "1 medium apple sliced with 2 tbsp natural almond butter.", kcal: 210 },
  },
  Wednesday: {
    breakfast: { name: "Smoothie Bowl", desc: "Frozen spinach, banana, berries, chia seeds, hemp protein.", kcal: 370 },
    lunch: { name: "Chicken Caesar Wrap", desc: "Grilled chicken, romaine, avocado in a wholegrain wrap.", kcal: 490 },
    dinner: { name: "Grass-Fed Beef Stew", desc: "Slow-cooked beef with root veg, bone broth & quinoa.", kcal: 560 },
    snack: { name: "Seaweed Crackers & Hummus", desc: "Iodine source for thyroid with anti-inflammatory hummus.", kcal: 180 },
  },
  Thursday: {
    breakfast: { name: "Chia Pudding with Mango", desc: "Overnight chia with coconut milk, mango & pumpkin seeds.", kcal: 400 },
    lunch: { name: "Tuna Nicoise Bowl", desc: "Canned tuna, boiled egg, green beans, olives, capers.", kcal: 480 },
    dinner: { name: "Stuffed Peppers", desc: "Bell peppers filled with brown rice, lean mince & herbs.", kcal: 530 },
    snack: { name: "Mixed Seeds & Dates", desc: "Sunflower, pumpkin & sesame seeds with 2 Medjool dates.", kcal: 220 },
  },
  Friday: {
    breakfast: { name: "Savoury Avocado Eggs", desc: "Poached eggs on rye toast with smashed avocado & hemp seeds.", kcal: 450 },
    lunch: { name: "Roasted Chickpea Grain Bowl", desc: "Spiced chickpeas, quinoa, roasted courgette, tahini.", kcal: 510 },
    dinner: { name: "Mackerel with Asian Greens", desc: "Pan-cooked mackerel, pak choi, edamame, miso glaze.", kcal: 540 },
    snack: { name: "Kefir & Berries", desc: "Plain kefir blended with a handful of frozen berries.", kcal: 160 },
  },
  Saturday: {
    breakfast: { name: "Weekend Protein Pancakes", desc: "Oat & egg pancakes with banana, yoghurt & cinnamon.", kcal: 490 },
    lunch: { name: "Butternut Squash Soup", desc: "Roasted squash with ginger, coconut milk & seeded crackers.", kcal: 420 },
    dinner: { name: "Slow-Cooked Lamb with Roasted Roots", desc: "Slow-cooked lamb, parsnips, carrots, thyme & rosemary.", kcal: 620 },
    snack: { name: "Dark Chocolate & Almonds", desc: "2 squares 85%+ dark chocolate with a handful of almonds.", kcal: 190 },
  },
  Sunday: {
    breakfast: { name: "Full Anti-Inflammatory Breakfast", desc: "Poached eggs, smoked salmon, sautéed mushrooms & spinach.", kcal: 530 },
    lunch: { name: "Warming Turmeric Chicken Soup", desc: "Chicken broth, sweet potato, turmeric, ginger, kale.", kcal: 460 },
    dinner: { name: "Baked Salmon & Asparagus", desc: "Herb-crusted salmon, asparagus, roasted cherry tomatoes.", kcal: 510 },
    snack: { name: "Brazil Nuts & Raspberries", desc: "3 Brazil nuts (selenium boost) with fresh raspberries.", kcal: 140 },
  },
};

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

const Tag = ({ label, color }: { label: string; color: string }) => (
  <span style={{
    background: color + "30", color, border: `1px solid ${color}60`,
    borderRadius: 20, padding: "1px 9px", fontSize: 11, fontWeight: 600, letterSpacing: 0.4,
  }}>{label}</span>
);

const ProgressRing = ({ done, total, size = 54, stroke = 5, color = "#7ec8a4" }: { done: number; total: number; size?: number; stroke?: number; color?: string }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = total === 0 ? 0 : Math.min(done / total, 1);
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#ffffff18" strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`} style={{ transition: "stroke-dashoffset 0.5s ease" }}
      />
      <text x={size/2} y={size/2 + 5} textAnchor="middle" fill={color} fontSize={13} fontWeight={700} fontFamily="inherit">
        {done}/{total}
      </text>
    </svg>
  );
};

export default function App() {
  const [screen, setScreen] = useState("loading");
  const [profile, setProfile] = useState<any>(null);
  const [logs, setLogs] = useState<any>({});
  const [tab, setTab] = useState("today");
  const [form, setForm] = useState({ name: "", weight: "", calTarget: "1700", thyroidMeds: false, medTime: "07:00" });
  const currentDay = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const [mealDay, setMealDay] = useState(currentDay);

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("wellness_profile") || "null");
      const l = JSON.parse(localStorage.getItem("wellness_logs") || "{}");
      setLogs(l);
      if (p) { setProfile(p); setScreen("home"); }
      else setScreen("onboard");
    } catch { setScreen("onboard"); }
  }, []);

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    const p = { ...form, createdAt: new Date().toISOString() };
    localStorage.setItem("wellness_profile", JSON.stringify(p));
    setProfile(p);
    setScreen("home");
  }

  function toggleSupplement(suppId: string) {
    const key = todayKey();
    const day = logs[key] || {};
    const taken = day.supplements || [];
    const updated = taken.includes(suppId) ? taken.filter((x: string) => x !== suppId) : [...taken, suppId];
    const newLogs = { ...logs, [key]: { ...day, supplements: updated } };
    setLogs(newLogs);
    localStorage.setItem("wellness_logs", JSON.stringify(newLogs));
  }

  function toggleMeal(mealType: string) {
    const key = todayKey();
    const day = logs[key] || {};
    const eaten = day.meals || [];
    const updated = eaten.includes(mealType) ? eaten.filter((x: string) => x !== mealType) : [...eaten, mealType];
    const newLogs = { ...logs, [key]: { ...day, meals: updated } };
    setLogs(newLogs);
    localStorage.setItem("wellness_logs", JSON.stringify(newLogs));
  }

  function logWater(delta: number) {
    const key = todayKey();
    const day = logs[key] || {};
    const w = Math.max(0, Math.min(12, (day.water || 0) + delta));
    const newLogs = { ...logs, [key]: { ...day, water: w } };
    setLogs(newLogs);
    localStorage.setItem("wellness_logs", JSON.stringify(newLogs));
  }

  function logMood(val: number) {
    const key = todayKey();
    const day = logs[key] || {};
    const newLogs = { ...logs, [key]: { ...day, mood: val } };
    setLogs(newLogs);
    localStorage.setItem("wellness_logs", JSON.stringify(newLogs));
  }

  function logSymptom(sym: string) {
    const key = todayKey();
    const day = logs[key] || {};
    const syms = day.symptoms || [];
    const updated = syms.includes(sym) ? syms.filter((x: string) => x !== sym) : [...syms, sym];
    const newLogs = { ...logs, [key]: { ...day, symptoms: updated } };
    setLogs(newLogs);
    localStorage.setItem("wellness_logs", JSON.stringify(newLogs));
  }

  const todayLog = logs[todayKey()] || {};
  const takenSupps = todayLog.supplements || [];
  const eatenMeals = todayLog.meals || [];
  const water = todayLog.water || 0;
  const mood = todayLog.mood || 0;
  const symptoms = todayLog.symptoms || [];
  const todayMeals = MEAL_PLANS[currentDay];
  const mealTypes = ["breakfast", "lunch", "dinner", "snack"];
  const totalKcal = mealTypes.filter(m => eatenMeals.includes(m)).reduce((acc: number, m: string) => acc + (todayMeals[m]?.kcal || 0), 0);

  const streak = (() => {
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today); d.setDate(d.getDate() - i);
      const k = d.toISOString().slice(0,10);
      const l = logs[k];
      if (l && (l.supplements?.length > 0 || l.meals?.length > 0)) count++;
      else if (i > 0) break;
    }
    return count;
  })();

  const s: any = {
    app: { minHeight: "100vh", background: "linear-gradient(135deg, #0f1923 0%, #1a2535 50%, #162231 100%)", color: "#e8f0e8", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", display: "flex", flexDirection: "column" as const, maxWidth: 480, margin: "0 auto" },
    header: { background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "16px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" },
    nav: { display: "flex", gap: 4, background: "rgba(255,255,255,0.04)", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "8px 12px", position: "sticky" as const, bottom: 0 },
    card: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 16, marginBottom: 12 },
    cardTitle: { fontSize: 13, fontWeight: 700, color: "#7ec8a4", marginBottom: 10, letterSpacing: 0.3 },
    body: { padding: "16px 16px 0", flex: 1, overflowY: "auto" as const },
    input: { width: "100%", boxSizing: "border-box" as const, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#e8f0e8", padding: "10px 14px", fontSize: 14, outline: "none" },
    label: { fontSize: 12, color: "#7ec8a4", marginBottom: 5, display: "block", fontWeight: 600, letterSpacing: 0.3 },
    btn: { background: "linear-gradient(135deg, #7ec8a4, #5aaf87)", color: "#0f1923", fontWeight: 800, fontSize: 15, border: "none", borderRadius: 12, padding: "13px 20px", cursor: "pointer", width: "100%", letterSpacing: 0.3 },
    waterBtn: { background: "rgba(137,196,225,0.15)", border: "1px solid rgba(137,196,225,0.3)", color: "#89c4e1", borderRadius: 8, padding: "4px 14px", cursor: "pointer", fontSize: 18, fontWeight: 700 },
  };

  const navBtn = (active: boolean) => ({ flex: 1, padding: "8px 4px", background: active ? "rgba(126,200,164,0.15)" : "transparent", border: active ? "1px solid rgba(126,200,164,0.3)" : "1px solid transparent", borderRadius: 10, color: active ? "#7ec8a4" : "#5a7a6a", fontSize: 11, fontWeight: 600, cursor: "pointer" });
  const suppRow = (taken: boolean) => ({ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 12px", borderRadius: 12, marginBottom: 8, background: taken ? "rgba(126,200,164,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${taken ? "rgba(126,200,164,0.3)" : "rgba(255,255,255,0.06)"}`, cursor: "pointer" });
  const check = (taken: boolean, color = "#7ec8a4") => ({ width: 20, height: 20, borderRadius: 6, flexShrink: 0, border: `2px solid ${taken ? color : "#3a5a4a"}`, background: taken ? color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 });
  const moodBtn = (selected: boolean) => ({ fontSize: 22, cursor: "pointer", filter: selected ? "none" : "grayscale(0.7) opacity(0.5)", transform: selected ? "scale(1.25)" : "scale(1)", transition: "all 0.2s", background: "none", border: "none", padding: 4 });
  const symptomChip = (active: boolean) => ({ padding: "5px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer", background: active ? "rgba(248,130,130,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${active ? "#f88282" : "rgba(255,255,255,0.08)"}`, color: active ? "#f88282" : "#8a9a8a", fontWeight: active ? 600 : 400 });

  const SYMPTOMS_LIST = ["Fatigue","Brain fog","Bloating","Cramps","Hair loss","Mood swings","Cold hands/feet","Poor sleep","Acne","Irregular cycle"];

  if (screen === "onboard") return (
    <div style={s.app}>
      <div style={{ ...s.header, flexDirection: "column" as const, alignItems: "flex-start" }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#7ec8a4" }}>✦ HerBalance</div>
        <div style={{ fontSize: 11, color: "#5a8a70" }}>PMOS & Thyroid Wellness Tracker</div>
      </div>
      <div style={s.body}>
        <div style={{ ...s.card, marginTop: 12 }}>
          <p style={{ color: "#7ec8a4", fontWeight: 700, fontSize: 17, marginBottom: 6 }}>Welcome 🌿</p>
          <p style={{ color: "#8aaa9a", fontSize: 13, lineHeight: 1.5 }}>Let's set up your profile to personalise your supplement schedule and meal plan for PMOS (Polyendocrine Metabolic Ovarian Syndrome) and hypothyroidism.</p>
        </div>
        <form onSubmit={handleSaveProfile}>
          <div style={s.card}>
            <div style={s.cardTitle}>Your Details</div>
            <label style={s.label}>First Name</label>
            <input required style={{ ...s.input, marginBottom: 14 }} placeholder="e.g. Rebecca" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <label style={s.label}>Weight (kg) — optional</label>
            <input style={{ ...s.input, marginBottom: 14 }} placeholder="e.g. 68" type="number" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} />
            <label style={s.label}>Daily Calorie Target</label>
            <input style={{ ...s.input, marginBottom: 14 }} type="number" placeholder="1700" value={form.calTarget} onChange={e => setForm({ ...form, calTarget: e.target.value })} />
            <label style={{ ...s.label, marginBottom: 10 }}>Do you take Levothyroxine / thyroid medication?</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {["Yes","No"].map(opt => (
                <button type="button" key={opt} style={{ padding: "8px 22px", borderRadius: 10, cursor: "pointer", fontSize: 13, background: (form.thyroidMeds ? "Yes" : "No") === opt ? "rgba(126,200,164,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${(form.thyroidMeds ? "Yes" : "No") === opt ? "#7ec8a4" : "rgba(255,255,255,0.1)"}`, color: (form.thyroidMeds ? "Yes" : "No") === opt ? "#7ec8a4" : "#8aaa9a", fontWeight: 600 }} onClick={() => setForm({ ...form, thyroidMeds: opt === "Yes" })}>{opt}</button>
              ))}
            </div>
            {form.thyroidMeds && <>
              <label style={s.label}>Medication Time</label>
              <input style={{ ...s.input, marginBottom: 14 }} type="time" value={form.medTime} onChange={e => setForm({ ...form, medTime: e.target.value })} />
              <div style={{ background: "rgba(248,209,110,0.08)", border: "1px solid rgba(248,209,110,0.2)", borderRadius: 10, padding: "10px 12px", marginBottom: 12, fontSize: 12, color: "#f8d56e", lineHeight: 1.5 }}>
                ⚠️ Space all supplements <strong>at least 1 hour</strong> away from thyroid meds (iron & calcium need 4hrs).
              </div>
            </>}
          </div>
          <button type="submit" style={{ ...s.btn, marginBottom: 24 }}>Start My Wellness Journey →</button>
        </form>
      </div>
    </div>
  );

  if (screen !== "home") return <div style={s.app}><div style={{ padding: 40, textAlign: "center", color: "#7ec8a4" }}>Loading…</div></div>;

  return (
    <div style={s.app}>
      <div style={s.header}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#7ec8a4" }}>✦ HerBalance</div>
          <div style={{ fontSize: 11, color: "#5a8a70" }}>PMOS & Thyroid Wellness</div>
        </div>
        <div style={{ fontSize: 12, color: "#5a8a70" }}>{profile?.name} · {profile?.calTarget} kcal</div>
      </div>

      <div style={s.body}>
        {tab === "today" && (
          <div>
            <div style={{ ...s.card, background: "linear-gradient(135deg, rgba(126,200,164,0.12), rgba(90,175,135,0.06))", border: "1px solid rgba(126,200,164,0.2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#e8f0e8" }}>Hello, {profile?.name} 🌿</div>
                <div style={{ fontSize: 12, color: "#8aaa9a", marginTop: 3 }}>{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</div>
                <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
                  <div style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 800, color: "#f9d56e" }}>{streak}</div><div style={{ fontSize: 10, color: "#7a9a8a" }}>day streak</div></div>
                  <div style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 800, color: "#89c4e1" }}>{totalKcal}</div><div style={{ fontSize: 10, color: "#7a9a8a" }}>kcal logged</div></div>
                  <div style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 800, color: "#7ec8a4" }}>{takenSupps.length}/{SUPPLEMENT_LIBRARY.length}</div><div style={{ fontSize: 10, color: "#7a9a8a" }}>supps</div></div>
                </div>
              </div>
              <ProgressRing done={takenSupps.length} total={SUPPLEMENT_LIBRARY.length} size={60} />
            </div>

            {profile?.thyroidMeds && <div style={{ background: "rgba(248,209,110,0.07)", border: "1px solid rgba(248,209,110,0.2)", borderRadius: 12, padding: "10px 14px", marginBottom: 12, fontSize: 12, color: "#f8d56e" }}>💊 Thyroid med reminder at <strong>{profile.medTime}</strong> — take on empty stomach, 30–60 min before food.</div>}

            <div style={s.card}>
              <div style={s.cardTitle}>💧 Hydration <span style={{ color: "#5a8a70", fontWeight: 400 }}>(target: 8 glasses)</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button style={s.waterBtn} onClick={() => logWater(-1)}>−</button>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 4 }}>{Array.from({ length: 8 }).map((_, i) => <div key={i} style={{ flex: 1, height: 20, borderRadius: 4, background: i < water ? "#89c4e1" : "rgba(137,196,225,0.15)" }} />)}</div>
                  <div style={{ fontSize: 11, color: "#89c4e1", marginTop: 5, textAlign: "center" }}>{water} / 8 glasses today</div>
                </div>
                <button style={s.waterBtn} onClick={() => logWater(1)}>+</button>
              </div>
            </div>

            <div style={s.card}>
              <div style={s.cardTitle}>🧠 Today's Mood</div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                {[["😞",1],["😔",2],["😐",3],["🙂",4],["😄",5]].map(([em, v]) => <button key={v} style={moodBtn(mood === v)} onClick={() => logMood(v as number)}>{em}</button>)}
              </div>
            </div>

            <div style={s.card}>
              <div style={s.cardTitle}>📋 Symptoms Today</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {SYMPTOMS_LIST.map(sym => <button key={sym} style={symptomChip(symptoms.includes(sym))} onClick={() => logSymptom(sym)}>{sym}</button>)}
              </div>
            </div>

            <div style={s.card}>
              <div style={s.cardTitle}>🍽️ Today's Meals — {currentDay}</div>
              {mealTypes.map(type => {
                const m = todayMeals[type];
                const eaten = eatenMeals.includes(type);
                return (
                  <div key={type} style={suppRow(eaten)} onClick={() => toggleMeal(type)}>
                    <div style={check(eaten)}>{eaten && <span style={{ color: "#0f1923", fontSize: 12, fontWeight: 800 }}>✓</span>}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: eaten ? "#7ec8a4" : "#c8d8c8" }}>{type.charAt(0).toUpperCase() + type.slice(1)}: {m.name}</div>
                      <div style={{ fontSize: 11, color: "#6a8a7a", marginTop: 2 }}>{m.kcal} kcal · {m.desc.slice(0,60)}…</div>
                    </div>
                  </div>
                );
              })}
              <div style={{ fontSize: 11, color: "#7ec8a4", textAlign: "right", marginTop: 6 }}>Target: {profile?.calTarget || 1700} kcal · Logged: {totalKcal} kcal</div>
            </div>
          </div>
        )}

        {tab === "supplements" && (
          <div>
            <div style={s.card}>
              <div style={s.cardTitle}>💊 Supplement Schedule</div>
              <p style={{ fontSize: 12, color: "#6a8a7a", marginBottom: 12, lineHeight: 1.5 }}>Tailored for PMOS & hypothyroidism. Tap each to mark as taken. Always consult your GP before starting new supplements.</p>
              {["Morning (fasted)","Morning (with thyroid meds)","With breakfast","With lunch","With dinner","Evening (before bed)"].map(timing => {
                const group = SUPPLEMENT_LIBRARY.filter(s => s.timing === timing);
                if (group.length === 0) return null;
                return (
                  <div key={timing} style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#5a8a70", letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 6, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 4 }}>🕐 {timing}</div>
                    {group.map(supp => {
                      const taken = takenSupps.includes(supp.id);
                      return (
                        <div key={supp.id} style={suppRow(taken)} onClick={() => toggleSupplement(supp.id)}>
                          <div style={check(taken, supp.color)}>{taken && <span style={{ color: "#0f1923", fontSize: 11, fontWeight: 800 }}>✓</span>}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                              <span style={{ fontSize: 13, fontWeight: 700, color: taken ? supp.color : "#c8d8c8" }}>{supp.name}</span>
                              <span style={{ fontSize: 11, color: "#6a8a7a" }}>{supp.dose}</span>
                              {supp.tags.map(t => <Tag key={t} label={t} color={t === "PMOS" ? "#e8a87c" : "#a8d8ea"} />)}
                            </div>
                            <div style={{ fontSize: 11, color: "#5a7a6a", marginTop: 3, lineHeight: 1.4 }}>{supp.note}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            <div style={{ background: "rgba(248,130,130,0.07)", border: "1px solid rgba(248,130,130,0.2)", borderRadius: 12, padding: "12px 14px", marginBottom: 16, fontSize: 12, color: "#f88282", lineHeight: 1.6 }}>
              ⚠️ <strong>Key interactions:</strong><br/>• Space iron & calcium <strong>4 hrs</strong> from levothyroxine<br/>• Never take iron & zinc together<br/>• Selenium: max 200mcg/day<br/>• Thyroid meds 30–60 min before food
            </div>
          </div>
        )}

        {tab === "meals" && (
          <div>
            <div style={s.card}>
              <div style={s.cardTitle}>📅 Weekly Meal Plan</div>
              <p style={{ fontSize: 12, color: "#6a8a7a", marginBottom: 12 }}>Anti-inflammatory, low-GI meals supporting PMOS and thyroid health.</p>
              <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8 }}>
                {DAYS.map(d => <button key={d} style={{ flexShrink: 0, padding: "6px 12px", borderRadius: 20, cursor: "pointer", fontSize: 11, background: mealDay === d ? "rgba(126,200,164,0.2)" : "rgba(255,255,255,0.04)", border: `1px solid ${mealDay === d ? "#7ec8a4" : "rgba(255,255,255,0.08)"}`, color: mealDay === d ? "#7ec8a4" : "#6a8a7a", fontWeight: 600 }} onClick={() => setMealDay(d)}>{d.slice(0,3)}</button>)}
              </div>
            </div>
            {mealTypes.map(type => {
              const m = MEAL_PLANS[mealDay][type];
              const isToday = mealDay === currentDay;
              const eaten = isToday && eatenMeals.includes(type);
              return (
                <div key={type} style={{ ...s.card, borderColor: eaten ? "rgba(126,200,164,0.3)" : "rgba(255,255,255,0.08)" }} onClick={() => isToday && toggleMeal(type)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 11, color: "#7ec8a4", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 }}>{type === "breakfast" ? "🌅" : type === "lunch" ? "☀️" : type === "dinner" ? "🌙" : "🍎"} {type}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#e8f0e8", marginBottom: 5 }}>{m.name}</div>
                      <div style={{ fontSize: 12, color: "#6a8a7a", lineHeight: 1.5 }}>{m.desc}</div>
                    </div>
                    <div style={{ flexShrink: 0, marginLeft: 12, textAlign: "center" }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#f9d56e" }}>{m.kcal}</div>
                      <div style={{ fontSize: 10, color: "#6a7a6a" }}>kcal</div>
                      {isToday && <div style={{ ...check(eaten), margin: "6px auto 0" }}>{eaten && <span style={{ color: "#0f1923", fontSize: 11, fontWeight: 800 }}>✓</span>}</div>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "profile" && (
          <div>
            <div style={s.card}>
              <div style={s.cardTitle}>👤 Your Profile</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[["Name", profile?.name], ["Weight", profile?.weight ? `${profile.weight} kg` : "—"], ["Cal Target", `${profile?.calTarget || 1700} kcal`], ["Thyroid Meds", profile?.thyroidMeds ? `Yes (${profile.medTime})` : "No"]].map(([k, v]) => (
                  <div key={k} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "10px 12px" }}>
                    <div style={{ fontSize: 10, color: "#5a8a70", fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>{k}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#c8d8c8", marginTop: 3 }}>{v}</div>
                  </div>
                ))}
              </div>
              <button style={{ ...s.btn, marginTop: 14, background: "rgba(248,130,130,0.15)", color: "#f88282" }} onClick={() => { localStorage.clear(); setProfile(null); setForm({ name: "", weight: "", calTarget: "1700", thyroidMeds: false, medTime: "07:00" }); setScreen("onboard"); }}>Reset Profile</button>
            </div>
            <div style={s.card}>
              <div style={s.cardTitle}>📊 Log History (Last 7 Days)</div>
              {Array.from({ length: 7 }).map((_, i) => {
                const d = new Date(); d.setDate(d.getDate() - i);
                const k = d.toISOString().slice(0,10);
                const l = logs[k] || {};
                const label = i === 0 ? "Today" : i === 1 ? "Yesterday" : d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric" });
                return (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ width: 72, fontSize: 11, color: "#6a8a7a", fontWeight: i === 0 ? 700 : 400 }}>{label}</div>
                    <div style={{ flex: 1, display: "flex", gap: 8 }}>
                      <Tag label={`💊 ${l.supplements?.length || 0}`} color="#7ec8a4" />
                      <Tag label={`🍽 ${l.meals?.length || 0}`} color="#f9d56e" />
                      <Tag label={`💧 ${l.water || 0}`} color="#89c4e1" />
                      {l.mood ? <Tag label={["","😞","😔","😐","🙂","😄"][l.mood]} color="#ccb4f5" /> : null}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ ...s.card, marginBottom: 20 }}>
              <div style={s.cardTitle}>ℹ️ About</div>
              <p style={{ fontSize: 12, color: "#6a8a7a", lineHeight: 1.6 }}>Designed for women with PMOS (Polyendocrine Metabolic Ovarian Syndrome) and/or hypothyroidism. Supplement recommendations are evidence-based but <strong style={{ color: "#f8d56e" }}>not a substitute for medical advice</strong>. Always discuss with your GP or endocrinologist.</p>
            </div>
          </div>
        )}
      </div>

      <div style={s.nav}>
        {[["today","🌿","Today"],["supplements","💊","Supps"],["meals","🍽️","Meals"],["profile","👤","Profile"]].map(([id, icon, label]) => (
          <button key={id} style={navBtn(tab === id)} onClick={() => setTab(id)}>
            <div style={{ fontSize: 16 }}>{icon}</div>
            <div>{label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
