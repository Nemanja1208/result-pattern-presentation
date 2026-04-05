import { motion } from "framer-motion";
import { C, ResultBadge } from "../components/shared";

const floaters = [
  "Result<T>", "Result.Success(value)", "Result.Failure(error)",
  "error.Match(onOk, onError)", ".Bind(fn)", ".Map(fn)",
  "ErrorType.Validation", "ErrorType.NotFound", "IActionResult",
  ".IsSuccess", ".IsFailure", "Error[]",
];

export default function Hero({ onNext }) {
  return (
    <div style={{
      minHeight:"100vh", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      textAlign:"center", padding:"80px 40px", position:"relative", overflow:"hidden"
    }}>
      {/* Ambient orbs */}
      {[
        { left:"8%",  top:"18%",  c:C.rose,    size:300 },
        { right:"6%", top:"22%",  c:C.violet,  size:260 },
        { left:"38%", bottom:"8%",c:C.emerald, size:280 },
        { right:"22%",bottom:"15%",c:C.amber,  size:200 },
      ].map((g,i)=>(
        <motion.div key={i}
          animate={{ scale:[1,1.4,1], opacity:[0.12,0.22,0.12] }}
          transition={{ duration:4.5+i*0.8, repeat:Infinity, ease:"easeInOut" }}
          style={{
            position:"absolute", width:g.size, height:g.size, borderRadius:"50%",
            background:`radial-gradient(circle,${g.c}30 0%,transparent 70%)`,
            filter:"blur(60px)", pointerEvents:"none", ...g
          }}/>
      ))}

      {/* Badge */}
      <motion.div initial={{opacity:0,y:-18}} animate={{opacity:1,y:0}} transition={{delay:0.15}}
        style={{
          display:"inline-flex", alignItems:"center", gap:8, marginBottom:28,
          padding:"5px 18px", borderRadius:99,
          background:"rgba(251,113,133,0.1)", border:"1px solid rgba(251,113,133,0.32)",
          color:C.rose, fontSize:11, letterSpacing:"0.14em", fontFamily:"Fira Code, monospace"
        }}>
        ✦ .NET · C# · Clean Architecture
      </motion.div>

      {/* Title */}
      {["Operation", "Result Pattern"].map((word,i)=>(
        <div key={word} style={{ overflow:"hidden", marginBottom: i===0 ? 4 : 22 }}>
          <motion.h1
            initial={{ y:100, opacity:0 }}
            animate={{ y:0, opacity:1 }}
            transition={{ duration:0.78, delay:0.1+i*0.12, ease:[0.16,1,0.3,1] }}
            style={{
              fontSize:"clamp(42px,8vw,96px)", margin:0, lineHeight:0.9,
              fontFamily:"Bricolage Grotesque, sans-serif",
              fontWeight:800, letterSpacing:"-0.04em",
              background: i===0
                ? "linear-gradient(135deg,#fff 0%,#fb7185 60%,#f43f5e 100%)"
                : "linear-gradient(135deg,#34d399 0%,#38bdf8 60%,#818cf8 100%)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text"
            }}>{word}</motion.h1>
        </div>
      ))}

      <motion.p
        initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.6}}
        style={{ color:"rgba(226,232,240,0.52)", fontSize:16, maxWidth:560, lineHeight:1.78, margin:"0 0 42px" }}>
        Stop throwing exceptions for expected failures. Encode success and failure
        as <strong style={{color:C.rose}}>first-class values</strong>. Make the
        compiler your ally. Make errors <strong style={{color:C.emerald}}>impossible to ignore</strong>.
      </motion.p>

      {/* Success / Failure preview */}
      <motion.div
        initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.72}}
        style={{ display:"flex", gap:16, flexWrap:"wrap", justifyContent:"center", marginBottom:46 }}>
        <ResultBadge ok={true}  label="Result.Success(order)" sub="Value is accessible, no exceptions" />
        <ResultBadge ok={false} label="Result.Failure(error)"  sub="Error is typed, propagates cleanly" />
      </motion.div>

      <motion.button
        initial={{opacity:0,scale:0.88}} animate={{opacity:1,scale:1}} transition={{delay:0.9}}
        onClick={onNext}
        whileHover={{ scale:1.06, boxShadow:"0 0 50px rgba(251,113,133,0.45)" }}
        whileTap={{ scale:0.96 }}
        style={{
          padding:"13px 40px", fontSize:13, fontWeight:700, letterSpacing:"0.12em",
          textTransform:"uppercase",
          background:"linear-gradient(135deg,#f43f5e,#fb923c)",
          border:"none", borderRadius:99, color:"#fff",
          boxShadow:"0 0 30px rgba(244,63,94,0.3)", fontFamily:"inherit"
        }}>
        Let's Build It ⟶
      </motion.button>

      {/* Floating fragments */}
      {floaters.map((t,i)=>(
        <motion.div key={i}
          initial={{opacity:0}}
          animate={{opacity:[0,0.16,0]}}
          transition={{ duration:5, delay:2.5+i*0.55, repeat:Infinity, repeatDelay:0.8 }}
          style={{
            position:"absolute",
            left:i%2===0?`${5+i*3}%`:"auto",
            right:i%2!==0?`${4+i*2}%`:"auto",
            top:`${10+i*7}%`,
            color:"rgba(251,113,133,0.45)", fontSize:11,
            fontFamily:"Fira Code, monospace", pointerEvents:"none", whiteSpace:"nowrap"
          }}>{t}</motion.div>
      ))}
    </div>
  );
}
