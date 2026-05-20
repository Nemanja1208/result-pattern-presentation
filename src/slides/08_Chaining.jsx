import { motion } from "framer-motion";
import { Wrap, Head, Code, C, stagger, fadeUp } from "../components/shared";

const chainExtCode = `<span style="color:#6b7280">// Domain/Common/ResultExtensions.cs — add Bind and Map</span>

<span style="color:#6b7280">// Map: transform the Value if successful (no new failure possible)</span>
<span style="color:#f472b6">public static</span> <span style="color:#34d399">Result</span>&lt;TOut&gt; Map&lt;TIn, TOut&gt;(
    <span style="color:#f472b6">this</span> <span style="color:#34d399">Result</span>&lt;TIn&gt; result,
    Func&lt;TIn, TOut&gt; mapper)
    => result.IsSuccess
        ? <span style="color:#34d399">Result</span>.Success(mapper(result.Value))
        : <span style="color:#34d399">Result</span>.Failure&lt;TOut&gt;(result.Error);

<span style="color:#6b7280">// Bind: chain another operation that might fail</span>
<span style="color:#f472b6">public static</span> <span style="color:#34d399">Result</span>&lt;TOut&gt; Bind&lt;TIn, TOut&gt;(
    <span style="color:#f472b6">this</span> <span style="color:#34d399">Result</span>&lt;TIn&gt; result,
    Func&lt;TIn, <span style="color:#34d399">Result</span>&lt;TOut&gt;&gt; binder)
    => result.IsSuccess
        ? binder(result.Value)
        : <span style="color:#34d399">Result</span>.Failure&lt;TOut&gt;(result.Error);

<span style="color:#6b7280">// BindAsync: async version of Bind</span>
<span style="color:#f472b6">public static async</span> Task&lt;<span style="color:#34d399">Result</span>&lt;TOut&gt;&gt; BindAsync&lt;TIn, TOut&gt;(
    <span style="color:#f472b6">this</span> Task&lt;<span style="color:#34d399">Result</span>&lt;TIn&gt;&gt; resultTask,
    Func&lt;TIn, Task&lt;<span style="color:#34d399">Result</span>&lt;TOut&gt;&gt;&gt; binder)
{
    <span style="color:#f472b6">var</span> result = <span style="color:#f472b6">await</span> resultTask;
    <span style="color:#f472b6">return</span> result.IsSuccess
        ? <span style="color:#f472b6">await</span> binder(result.Value)
        : <span style="color:#34d399">Result</span>.Failure&lt;TOut&gt;(result.Error);
}`;

const railwayCode = `<span style="color:#6b7280">// ── BEFORE chaining — guard clauses everywhere ─────────</span>
<span style="color:#f472b6">var</span> customerResult = <span style="color:#f472b6">await</span> GetCustomerAsync(cmd.CustomerId);
<span style="color:#f472b6">if</span> (customerResult.IsFailure) <span style="color:#f472b6">return</span> customerResult.Error;

<span style="color:#f472b6">var</span> creditResult = ValidateCredit(customerResult.Value, cmd.Amount);
<span style="color:#f472b6">if</span> (creditResult.IsFailure) <span style="color:#f472b6">return</span> creditResult.Error;

<span style="color:#f472b6">var</span> orderResult = Order.Create(customerResult.Value, cmd.Items);
<span style="color:#f472b6">if</span> (orderResult.IsFailure) <span style="color:#f472b6">return</span> orderResult.Error;

<span style="color:#f472b6">return</span> orderResult.Value.Id;

<span style="color:#6b7280">// ── AFTER chaining — Railway Oriented Programming ──────</span>
<span style="color:#f472b6">return await</span> GetCustomerAsync(cmd.CustomerId)          <span style="color:#6b7280">// Result&lt;Customer&gt;</span>
    .BindAsync(c => ValidateCreditAsync(c, cmd.Amount)) <span style="color:#6b7280">// Result&lt;Customer&gt;</span>
    .BindAsync(c => Order.CreateAsync(c, cmd.Items))    <span style="color:#6b7280">// Result&lt;Order&gt;</span>
    .Map(order => order.Id);                            <span style="color:#6b7280">// Result&lt;Guid&gt;</span>

<span style="color:#6b7280">// If ANY step fails, the rest are SKIPPED automatically.
// The first Error propagates to the end of the chain.
// No explicit if/return needed.</span>`;

const railSteps = [
  { label:"GetCustomerAsync()", ok:true,  out:"Result<Customer>", color:C.emerald, note:"Customer exists ✓" },
  { label:"ValidateCredit()",   ok:true,  out:"Result<Customer>", color:C.emerald, note:"Credit OK ✓" },
  { label:"Order.Create()",     ok:false, out:"Result<Order>",    color:C.rose,    note:"EmptyItems ✕" },
  { label:".Map(o => o.Id)",    ok:false, out:"Result<Guid>",     color:C.rose,    note:"Skipped — carries error" },
];

export default function Chaining() {
  return (
    <Wrap>
      <motion.div variants={stagger} initial="hidden" animate="show">
        <Head
          tag="⛓ Chaining"
          title="Railway Oriented Programming — the happy track"
          sub="Bind() chains operations that might fail. Map() transforms a success value. If any step fails, the rest are skipped and the error propagates to the end automatically."
          color={C.indigo}
        />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:22 }}>
          <motion.div variants={fadeUp} style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Code src={chainExtCode} label="ResultExtensions.cs — Map, Bind, BindAsync" color={C.indigo}/>
          </motion.div>
          <motion.div variants={fadeUp} style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Code src={railwayCode} label="Before / After chaining" color={C.emerald}/>

            {/* Railway visual */}
            <div style={{ padding:"16px 20px", borderRadius:12, background:"rgba(129,140,248,0.06)", border:"1px solid rgba(129,140,248,0.2)" }}>
              <div style={{ color:C.indigo, fontWeight:700, fontSize:12, marginBottom:12, letterSpacing:"0.08em" }}>🚂 RAILWAY — FAILURE DIVERTS THE TRAIN</div>
              {railSteps.map((s,i)=>(
                <div key={s.label}>
                  <div style={{
                    display:"flex", gap:10, alignItems:"center",
                    padding:"9px 12px", borderRadius:8,
                    background:`${s.color}0d`, border:`1px solid ${s.color}28`
                  }}>
                    <div style={{
                      width:20, height:20, borderRadius:"50%", flexShrink:0,
                      background:`${s.color}20`, border:`1px solid ${s.color}40`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      color:s.color, fontSize:11, fontWeight:800
                    }}>{s.ok?"✓":"✕"}</div>
                    <code style={{ color:s.color, fontSize:11, flex:1 }}>{s.label}</code>
                    <span style={{ color:C.muted, fontSize:10 }}>{s.out}</span>
                    <span style={{ color:"rgba(255,255,255,0.3)", fontSize:10 }}>{s.note}</span>
                  </div>
                  {i<railSteps.length-1 && (
                    <motion.div
                      animate={{ opacity:[0.25,0.7,0.25] }}
                      transition={{ duration:1.5, repeat:Infinity, delay:i*0.3 }}
                      style={{ display:"flex", justifyContent:"flex-start", paddingLeft:20, color:s.ok?C.emerald:C.rose, fontSize:12, lineHeight:"18px" }}>↓</motion.div>
                  )}
                </div>
              ))}
              <div style={{ marginTop:10, padding:"9px 12px", borderRadius:7, background:"rgba(251,113,133,0.08)", border:"1px solid rgba(251,113,133,0.2)" }}>
                <span style={{ color:C.rose, fontSize:11, fontWeight:700 }}>Final result: </span>
                <code style={{ color:C.muted, fontSize:11 }}>Result&lt;Guid&gt; — IsFailure, Error: OrderErrors.EmptyItems</code>
              </div>
            </div>

            <div style={{ padding:"12px 16px", borderRadius:10, background:"rgba(0,0,0,0.3)", border:"1px dashed rgba(129,140,248,0.22)" }}>
              <div style={{ color:C.indigo, fontWeight:700, fontSize:12, marginBottom:5 }}>Map vs Bind</div>
              <div style={{ color:C.muted, fontSize:12, lineHeight:1.7 }}>
                <strong style={{color:"#fff"}}>Map</strong> — transforms a value, can't fail. <code style={{color:C.indigo}}>Order → Guid</code><br/>
                <strong style={{color:"#fff"}}>Bind</strong> — chains a fallible operation. <code style={{color:C.indigo}}>Customer → Result&lt;Order&gt;</code>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Wrap>
  );
}
