import { motion } from "framer-motion";
import { C, stagger, fadeUp, Tag, Pill, ResultBadge } from "../components/shared";

const sections = [
  { title:"Error + ErrorType",    color:C.rose,    icon:"🗂", points:["sealed record Error(Type, Code, Description)","ErrorType enum → maps to HTTP status","Static error catalogues per domain aggregate","Error.NotFound / Validation / Conflict / Unauthorized"] },
  { title:"Result<T>",            color:C.amber,   icon:"📦", points:["Success state: IsSuccess=true, .Value safe to read","Failure state: IsFailure=true, .Errors populated","Implicit conversions: T → Result<T>, Error → Result<T>","Constructor guards: can't have success + error simultaneously"] },
  { title:"ValidationResult<T>",  color:C.emerald, icon:"✅", points:["Extends Result<T> for multi-error validation","ValidationBehavior returns it — no throw","Collects ALL FluentValidation failures in one pass","Client gets all broken fields in one 400 response"] },
  { title:"Match / Tap / Bind",   color:C.sky,     icon:"🎯", points:[".Match(onSuccess, onFailure) — consume at boundaries",".Tap(action) — side effect on success only",".Bind(fn) — chain fallible operations","Railway: first failure short-circuits the chain"] },
  { title:"MediatR Integration",  color:C.violet,  icon:"⚡", points:["IRequest<Result<T>> — honest handler signatures","ValidationBehavior: where TResponse : Result","No exceptions escape the pipeline","Handler: early return on IsFailure, value on success"] },
  { title:"API Translation",      color:C.indigo,  icon:"🌐", points:["error.ToProblem() extension method","ErrorType switch → correct IActionResult","RFC 7807 Problem Details body","result.Match(ok => ..., err => err.ToProblem())"] },
];

const comparisons = [
  { label:"Exception-driven",  color:C.red,     props:["Hidden failure modes","Expensive stack capture","Caller must know what to catch","Not composable","500 errors on missed catch"] },
  { label:"Result-driven",     color:C.emerald, props:["Honest signatures","Zero allocation overhead","Compiler enforces handling","Railway chaining","Automatic HTTP translation"] },
];

const cheat = [
  { action:"New error type",      code:"Error.Validation(\"X.Rule\", \"message\")",   color:C.rose },
  { action:"Return success",      code:"return value;  // implicit → Result<T>",       color:C.emerald },
  { action:"Return failure",      code:"return ErrorCatalogue.NotFound(id);",         color:C.rose },
  { action:"Consume in handler",  code:"if (r.IsFailure) return r.Error;",            color:C.amber },
  { action:"Consume in controller",code:"result.Match(ok => Ok(ok), err => err.ToProblem())", color:C.sky },
  { action:"Chain operations",    code:".BindAsync(x => NextFallibleOp(x))",          color:C.violet },
];

export default function Summary() {
  return (
    <div style={{ minHeight:"100vh", padding:"72px 48px 32px", boxSizing:"border-box", position:"relative" }}>
      {[C.rose, C.emerald, C.violet].map((c,i)=>(
        <motion.div key={i} animate={{ scale:[1,1.25,1], opacity:[0.07,0.16,0.07] }} transition={{ duration:5+i, repeat:Infinity }}
          style={{ position:"absolute", width:340, height:340, borderRadius:"50%", background:`radial-gradient(circle,${c}22,transparent 70%)`, filter:"blur(75px)", left:i===0?"0":i===1?"38%":"70%", top:i===0?"0":i===1?"55%":"5%", pointerEvents:"none", zIndex:0 }}/>
      ))}

      <motion.div variants={stagger} initial="hidden" animate="show" style={{ position:"relative", zIndex:1 }}>
        {/* Header */}
        <motion.div variants={fadeUp} style={{ textAlign:"center", marginBottom:26 }}>
          <Tag color={C.rose}>✦ OPERATION RESULT PATTERN — COMPLETE</Tag>
          <h2 style={{
            fontSize:"clamp(24px,4vw,46px)", margin:"10px 0 4px",
            fontFamily:"Bricolage Grotesque, sans-serif", fontWeight:800, letterSpacing:"-0.03em",
            background:"linear-gradient(135deg,#fff 0%,#fb7185 45%,#34d399 100%)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text"
          }}>Errors as values. Failures as features.</h2>
          <div style={{ display:"flex", gap:14, justifyContent:"center", marginTop:10 }}>
            <ResultBadge ok={true}  label="Result.Success(order)" sub="Value is accessible" />
            <ResultBadge ok={false} label="Result.Failure(error)"  sub="Typed, propagates cleanly" />
          </div>
        </motion.div>

        {/* 6-grid overview */}
        <motion.div variants={fadeUp} style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:18 }}>
          {sections.map(s=>(
            <motion.div key={s.title} whileHover={{ y:-3 }} style={{ padding:"12px 14px", borderRadius:10, background:`${s.color}07`, border:`1px solid ${s.color}20` }}>
              <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:6 }}>
                <span style={{ fontSize:16 }}>{s.icon}</span>
                <strong style={{ color:s.color, fontSize:12 }}>{s.title}</strong>
              </div>
              {s.points.map(p=>(
                <div key={p} style={{ color:C.muted, fontSize:10, lineHeight:1.55, padding:"1px 0" }}>› {p}</div>
              ))}
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom row */}
        <motion.div variants={fadeUp} style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
          {/* Exception vs Result */}
          <div style={{ padding:"14px 16px", borderRadius:11, background:"rgba(0,0,0,0.35)", border:"1px solid rgba(255,255,255,0.07)", gridColumn:"span 1" }}>
            <div style={{ color:"#fff", fontWeight:700, fontSize:12, marginBottom:10 }}>⚖️ Exception vs Result</div>
            {comparisons.map(c=>(
              <div key={c.label} style={{ marginBottom:8 }}>
                <div style={{ color:c.color, fontWeight:700, fontSize:11, marginBottom:4 }}>{c.label}</div>
                {c.props.map(p=>(
                  <div key={p} style={{ color:C.muted, fontSize:10, lineHeight:1.5 }}>
                    <span style={{ color:c.color }}>›</span> {p}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Cheat sheet */}
          <div style={{ padding:"14px 16px", borderRadius:11, background:"rgba(0,0,0,0.35)", border:"1px solid rgba(255,255,255,0.07)", gridColumn:"span 1" }}>
            <div style={{ color:"#fff", fontWeight:700, fontSize:12, marginBottom:10 }}>⚡ Quick Reference</div>
            {cheat.map(c=>(
              <div key={c.action} style={{ padding:"5px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ color:"rgba(255,255,255,0.45)", fontSize:10 }}>{c.action}</div>
                <code style={{ color:c.color, fontSize:10 }}>{c.code}</code>
              </div>
            ))}
          </div>

          {/* Final quote */}
          <div style={{ padding:"14px 16px", borderRadius:11, background:"linear-gradient(135deg,rgba(251,113,133,0.08),rgba(52,211,153,0.08))", border:"1px solid rgba(251,113,133,0.18)", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
            <div>
              <div style={{ fontSize:28, color:C.rose, opacity:0.3, lineHeight:1 }}>"</div>
              <p style={{ color:"#fff", fontSize:13, lineHeight:1.8, fontStyle:"italic", margin:"0 0 8px" }}>
                Make illegal states unrepresentable. Make the failure path as explicit as the success path. Let the compiler enforce it.
              </p>
              <div style={{ color:C.muted, fontSize:11 }}>— Functional programming meets .NET</div>
            </div>
            <motion.div
              animate={{ boxShadow:["0 0 20px rgba(251,113,133,0.12)","0 0 40px rgba(251,113,133,0.32)","0 0 20px rgba(251,113,133,0.12)"] }}
              transition={{ duration:2.5, repeat:Infinity }}
              style={{ marginTop:14, padding:"12px 16px", borderRadius:9, background:"rgba(251,113,133,0.1)", border:"1px solid rgba(251,113,133,0.28)", textAlign:"center" }}>
              <span style={{ color:"#fff", fontWeight:800, fontSize:14, fontFamily:"Bricolage Grotesque, sans-serif" }}>
                🛡️ No exception escapes. No failure is silent.
              </span>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
