import { motion } from "framer-motion";
import { Wrap, Head, Code, C, stagger, fadeUp, Card, ResultBadge, ArrowDown, Tag } from "../components/shared";

const conceptCode = `<span style="color:#6b7280">// The idea — a union type: either a value OR an error</span>
<span style="color:#6b7280">// Think of it as a box that is either ✅ or ❌</span>

<span style="color:#6b7280">// Without Result — caller guesses failure modes</span>
<span style="color:#f472b6">public</span> Task&lt;<span style="color:#fbbf24">Order</span>&gt; CreateOrder(...)  <span style="color:#6b7280">// 😬 can throw anything</span>

<span style="color:#6b7280">// With Result — failure modes are part of the contract</span>
<span style="color:#f472b6">public</span> Task&lt;<span style="color:#34d399">Result</span>&lt;<span style="color:#fbbf24">Order</span>&gt;&gt; CreateOrder(...)  <span style="color:#6b7280">// ✅ honest signature</span>

<span style="color:#6b7280">// ─────────────────────────────────────────────────────
// Two states — only one can be true at a time
// ─────────────────────────────────────────────────────</span>

<span style="color:#6b7280">// State A: SUCCESS — has a value</span>
Result&lt;Order&gt; success = Result&lt;Order&gt;.Success(order);
success.IsSuccess   <span style="color:#6b7280">// true</span>
success.Value       <span style="color:#6b7280">// Order instance ✅</span>
success.Error       <span style="color:#6b7280">// Error.None (sentinel)</span>

<span style="color:#6b7280">// State B: FAILURE — carries a typed Error</span>
Result&lt;Order&gt; failure = Result&lt;Order&gt;.Failure(Error.NotFound(<span style="color:#34d399">"Order.NotFound"</span>, <span style="color:#34d399">"Order 123 not found"</span>));
failure.IsSuccess   <span style="color:#6b7280">// false</span>
failure.IsFailure   <span style="color:#6b7280">// true</span>
failure.Value       <span style="color:#6b7280">// ⛔ throws! Never access Value without checking IsSuccess</span>
failure.Error       <span style="color:#6b7280">// Error { Type: NotFound, Code: "Order.NotFound", ... }</span>`;

const analogies = [
  {
    title:"Like a Nullable<T>...",
    sub:"...but for failure, not null.",
    desc:"Nullable<T> is either a value or null. Result<T> is either a value or a typed error. Both make the absence of a value explicit in the type system.",
    icon:"🎁", color:C.amber
  },
  {
    title:"Like a Railway Switch",
    sub:"Success track or failure track.",
    desc:"Operations flow along the success track. Any failure diverts to the error track. Subsequent operations are skipped automatically. No try/catch tower needed.",
    icon:"🚂", color:C.violet
  },
  {
    title:"Like an HTTP Response",
    sub:"200 OK or 4xx/5xx.",
    desc:"HTTP already models this — every response has a status. Result<T> brings that same clarity to your domain and application layers, before you ever get to HTTP.",
    icon:"🌐", color:C.sky
  },
];

export default function WhatIsResult() {
  return (
    <Wrap>
      <motion.div variants={stagger} initial="hidden" animate="show">
        <Head
          tag="✦ What Is It"
          title={<>Result&lt;T&gt; — a discriminated union for success or failure</>}
          sub="A Result wraps either a success value OR a failure error. The caller is forced to deal with both possibilities at compile time. No hidden exceptions, no nulls, no surprises."
          color={C.orange}
        />

        <div style={{ display:"grid", gridTemplateColumns:"1.1fr 1fr", gap:22 }}>
          <motion.div variants={fadeUp} style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Code src={conceptCode} label="Result<T> — the core contract" color={C.orange}/>

            {/* Visual state diagram */}
            <div style={{ padding:"16px 20px", borderRadius:12, background:"rgba(251,146,60,0.06)", border:"1px solid rgba(251,146,60,0.2)" }}>
              <div style={{ color:C.orange, fontWeight:700, fontSize:12, marginBottom:12, letterSpacing:"0.08em" }}>TWO AND ONLY TWO STATES</div>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <div style={{ flex:1, padding:"12px", borderRadius:9, background:"rgba(52,211,153,0.1)", border:"1px solid rgba(52,211,153,0.3)", textAlign:"center" }}>
                  <div style={{ fontSize:22, marginBottom:4 }}>✅</div>
                  <div style={{ color:C.emerald, fontWeight:700, fontSize:12 }}>IsSuccess = true</div>
                  <div style={{ color:C.muted, fontSize:11, marginTop:3 }}>.Value is safe to read</div>
                </div>
                <div style={{ color:"rgba(255,255,255,0.2)", fontSize:20, fontWeight:300 }}>|</div>
                <div style={{ flex:1, padding:"12px", borderRadius:9, background:"rgba(251,113,133,0.1)", border:"1px solid rgba(251,113,133,0.3)", textAlign:"center" }}>
                  <div style={{ fontSize:22, marginBottom:4 }}>❌</div>
                  <div style={{ color:C.rose, fontWeight:700, fontSize:12 }}>IsFailure = true</div>
                  <div style={{ color:C.muted, fontSize:11, marginTop:3 }}>.Error holds a typed Error</div>
                </div>
              </div>
              <div style={{ marginTop:12, color:"rgba(255,255,255,0.28)", fontSize:11, textAlign:"center" }}>
                Accessing .Value when IsFailure throws InvalidOperationException — intentionally loud
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {analogies.map(a=>(
              <motion.div key={a.title} whileHover={{ y:-3, boxShadow:`0 10px 32px ${a.color}14` }}
                style={{ padding:"16px 18px", borderRadius:11, background:`${a.color}08`, border:`1px solid ${a.color}22` }}>
                <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                  <div style={{
                    width:40, height:40, borderRadius:10, flexShrink:0,
                    background:`${a.color}15`, border:`1px solid ${a.color}35`,
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:20
                  }}>{a.icon}</div>
                  <div>
                    <div style={{ color:a.color, fontWeight:700, fontSize:14 }}>{a.title}</div>
                    <div style={{ color:"rgba(255,255,255,0.55)", fontSize:12, fontStyle:"italic", marginBottom:5 }}>{a.sub}</div>
                    <div style={{ color:C.muted, fontSize:12, lineHeight:1.6 }}>{a.desc}</div>
                  </div>
                </div>
              </motion.div>
            ))}

            <div style={{ padding:"14px 18px", borderRadius:10, background:"rgba(0,0,0,0.3)", border:"1px dashed rgba(52,211,153,0.25)", marginTop:4 }}>
              <div style={{ color:C.emerald, fontWeight:700, fontSize:12, marginBottom:6 }}>📦 Ready-made libraries (or roll your own)</div>
              {[
                { name:"ErrorOr",         desc:"Jimmy Bogard — lightweight, widely used" },
                { name:"FluentResults",   desc:"altmann-p — Result + Reasons pattern" },
                { name:"CSharpFunctionalExtensions", desc:"Vladimir Khorikov — full railway" },
                { name:"Custom Result<T>",desc:"This presentation builds it from scratch ✨" },
              ].map(l=>(
                <div key={l.name} style={{ display:"flex", gap:8, padding:"5px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ color:C.emerald, fontSize:11, fontFamily:"Fira Code, monospace", minWidth:200 }}>{l.name}</span>
                  <span style={{ color:C.muted, fontSize:11 }}>{l.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Wrap>
  );
}
