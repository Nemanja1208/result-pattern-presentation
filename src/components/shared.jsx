import { motion } from "framer-motion";

export const C = {
  bg:      "#060912",
  rose:    "#fb7185",
  red:     "#f43f5e",
  emerald: "#34d399",
  green:   "#22c55e",
  amber:   "#fbbf24",
  sky:     "#38bdf8",
  violet:  "#a78bfa",
  indigo:  "#818cf8",
  orange:  "#fb923c",
  slate:   "#94a3b8",
  text:    "#e2e8f0",
  muted:   "rgba(226,232,240,0.42)",
  card:    "rgba(255,255,255,0.025)",
  ok:      "#34d399",   // success green
  err:     "#fb7185",   // error rose
};

export const spring = { type:"spring", stiffness:300, damping:28 };

export const stagger = {
  hidden:{},
  show:{ transition:{ staggerChildren:0.09 } },
};
export const fadeUp = {
  hidden:{ opacity:0, y:22 },
  show:{ opacity:1, y:0, transition:{ duration:0.48, ease:[0.22,1,0.36,1] } },
};
export const fadeIn = {
  hidden:{ opacity:0 },
  show:{ opacity:1, transition:{ duration:0.4 } },
};
export const scaleIn = {
  hidden:{ opacity:0, scale:0.88 },
  show:{ opacity:1, scale:1, transition:{ duration:0.45, ease:[0.22,1,0.36,1] } },
};

export function Wrap({ children, pad="78px 54px 36px" }) {
  return (
    <div style={{ minHeight:"100vh", padding:pad, boxSizing:"border-box", position:"relative", zIndex:2 }}>
      {children}
    </div>
  );
}

export function Tag({ children, color=C.rose }) {
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      padding:"3px 11px", borderRadius:4,
      background:`${color}16`, border:`1px solid ${color}42`,
      color, fontSize:10, letterSpacing:"0.2em", fontWeight:700,
      textTransform:"uppercase", fontFamily:"Fira Code, monospace"
    }}>{children}</span>
  );
}

export function Head({ tag, title, sub, color=C.rose }) {
  return (
    <motion.div variants={fadeUp} style={{ marginBottom:26 }}>
      <Tag color={color}>{tag}</Tag>
      <h2 style={{
        margin:"10px 0 7px",
        fontSize:"clamp(22px,3.6vw,44px)",
        fontFamily:"Bricolage Grotesque, sans-serif",
        fontWeight:800, color:"#fff",
        lineHeight:1.06, letterSpacing:"-0.03em"
      }}>{title}</h2>
      {sub && <p style={{ color:C.muted, fontSize:13.5, lineHeight:1.7, maxWidth:680 }}>{sub}</p>}
    </motion.div>
  );
}

export function Code({ src, label, color=C.rose }) {
  return (
    <div style={{
      borderRadius:10, overflow:"hidden",
      border:`1px solid ${color}1e`,
      background:"rgba(0,0,0,0.55)", fontSize:12, lineHeight:1.78
    }}>
      <div style={{
        background:`${color}0e`, padding:"5px 14px",
        borderBottom:`1px solid ${color}14`,
        display:"flex", alignItems:"center", gap:7
      }}>
        {["#ef4444","#f59e0b","#10b981"].map((c,i)=>(
          <div key={i} style={{ width:9, height:9, borderRadius:"50%", background:c }}/>
        ))}
        <span style={{ color:`${color}70`, fontSize:10, marginLeft:3, letterSpacing:"0.07em" }}>{label}</span>
      </div>
      <pre style={{ margin:0, padding:"13px 18px", overflowX:"auto", color:"#e2e8f0" }}>
        <code dangerouslySetInnerHTML={{ __html:src }}/>
      </pre>
    </div>
  );
}

export function Pill({ children, color=C.rose }) {
  return (
    <span style={{
      display:"inline-block", padding:"2px 9px", borderRadius:4,
      background:`${color}12`, border:`1px solid ${color}28`,
      color, fontSize:11, fontFamily:"Fira Code, monospace"
    }}>{children}</span>
  );
}

export function Card({ children, color=C.rose, style={} }) {
  return (
    <div style={{
      padding:"16px 18px", borderRadius:11,
      background:`${color}07`, border:`1px solid ${color}20`,
      ...style
    }}>{children}</div>
  );
}

export function ResultBadge({ ok=true, label, sub }) {
  const color = ok ? C.ok : C.err;
  return (
    <motion.div whileHover={{ scale:1.03 }} style={{
      display:"inline-flex", alignItems:"center", gap:10,
      padding:"10px 16px", borderRadius:10,
      background:`${color}0e`, border:`1px solid ${color}35`,
      boxShadow:`0 0 20px ${color}12`
    }}>
      <div style={{
        width:28, height:28, borderRadius:"50%",
        background:`${color}20`, border:`1px solid ${color}40`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:14
      }}>{ok ? "✓" : "✕"}</div>
      <div>
        <div style={{ color, fontWeight:700, fontSize:13 }}>{label}</div>
        {sub && <div style={{ color:C.muted, fontSize:11 }}>{sub}</div>}
      </div>
    </motion.div>
  );
}

export function ArrowDown({ color=C.muted }) {
  return (
    <motion.div
      animate={{ y:[0,4,0] }}
      transition={{ duration:1.4, repeat:Infinity, ease:"easeInOut" }}
      style={{ color, fontSize:14, textAlign:"center", lineHeight:1, padding:"2px 0" }}>↓</motion.div>
  );
}
