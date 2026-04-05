import { motion } from "framer-motion";
import { Wrap, Head, Code, C, stagger, fadeUp, Card, Pill } from "../components/shared";

const badCode = `<span style="color:#6b7280">// ❌ THE PROBLEM — exceptions as control flow</span>
<span style="color:#f472b6">public async</span> Task&lt;Order&gt; CreateOrderAsync(<span style="color:#fbbf24">CreateOrderCommand</span> cmd)
{
    <span style="color:#6b7280">// Can throw CustomerNotFoundException — but callers won't know unless they read the code</span>
    <span style="color:#f472b6">var</span> customer = <span style="color:#f472b6">await</span> _customers.GetByIdAsync(cmd.CustomerId)
        ?? <span style="color:#f472b6">throw new</span> <span style="color:#fb7185">CustomerNotFoundException</span>(cmd.CustomerId);

    <span style="color:#6b7280">// Can throw InsufficientCreditException — invisible from the signature</span>
    <span style="color:#f472b6">if</span> (customer.CreditLimit &lt; cmd.TotalAmount)
        <span style="color:#f472b6">throw new</span> <span style="color:#fb7185">InsufficientCreditException</span>(customer.CreditLimit, cmd.TotalAmount);

    <span style="color:#6b7280">// Returns Order on success — but the failure paths are completely hidden</span>
    <span style="color:#f472b6">return</span> Order.Create(customer, cmd.Items);
}

<span style="color:#6b7280">// ❌ The caller — guessing what might throw</span>
<span style="color:#f472b6">try</span>
{
    <span style="color:#f472b6">var</span> order = <span style="color:#f472b6">await</span> CreateOrderAsync(cmd);
    <span style="color:#f472b6">return</span> Ok(order);
}
<span style="color:#f472b6">catch</span> (<span style="color:#fb7185">CustomerNotFoundException</span> ex) { <span style="color:#f472b6">return</span> NotFound(ex.Message); }
<span style="color:#f472b6">catch</span> (<span style="color:#fb7185">InsufficientCreditException</span> ex) { <span style="color:#f472b6">return</span> UnprocessableEntity(ex.Message); }
<span style="color:#f472b6">catch</span> (<span style="color:#fb7185">ValidationException</span> ex) { <span style="color:#f472b6">return</span> BadRequest(ex.Errors); }
<span style="color:#f472b6">catch</span> (Exception ex) { <span style="color:#f472b6">return</span> StatusCode(<span style="color:#34d399">500</span>, ex.Message); } <span style="color:#6b7280">// catch-all despair</span>`;

const problems = [
  {
    icon:"🙈", color:C.red,
    title:"Invisible failure paths",
    desc:"The method signature says Task<Order>. It lies. It can actually throw 4 different exception types. The compiler won't warn you if you forget to catch one."
  },
  {
    icon:"💸", color:C.amber,
    title:"Exceptions are expensive",
    desc:"Stack unwinding and capture is orders of magnitude slower than returning a value. Using exceptions for expected business failures (NotFound, Validation) is a performance trap."
  },
  {
    icon:"🕸️", color:C.violet,
    title:"Catch blocks everywhere",
    desc:"Every caller needs its own try/catch tower. Miss one layer and an uncaught exception becomes a 500 error. The same failure paths are coded over and over."
  },
  {
    icon:"😱", color:C.rose,
    title:"Not composable",
    desc:"You can't easily chain operations that might fail without nesting try/catch. Code becomes deeply indented, error-prone and impossible to reason about."
  },
];

export default function Problem() {
  return (
    <Wrap>
      <motion.div variants={stagger} initial="hidden" animate="show">
        <Head
          tag="⚠ The Problem"
          title="Exceptions are the wrong tool for expected failures"
          sub="Exceptions should signal unexpected, exceptional situations — not business rules like 'customer not found' or 'insufficient credit'. When you use them for control flow, your code becomes a minefield."
          color={C.red}
        />
        <div style={{ display:"grid", gridTemplateColumns:"1.1fr 1fr", gap:22 }}>
          <motion.div variants={fadeUp} style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Code src={badCode} label="OrderService.cs — exception-driven control flow" color={C.red}/>
          </motion.div>

          <motion.div variants={fadeUp} style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {problems.map(p=>(
              <motion.div key={p.title} whileHover={{ x:4 }}
                style={{
                  display:"flex", gap:14, padding:"13px 16px", borderRadius:10,
                  background:`${p.color}07`, border:`1px solid ${p.color}22`
                }}>
                <span style={{ fontSize:22, lineHeight:1, flexShrink:0 }}>{p.icon}</span>
                <div>
                  <div style={{ color:p.color, fontWeight:700, fontSize:13, marginBottom:3 }}>{p.title}</div>
                  <div style={{ color:C.muted, fontSize:12, lineHeight:1.6 }}>{p.desc}</div>
                </div>
              </motion.div>
            ))}

            <motion.div
              animate={{ borderColor:[`${C.rose}18`,`${C.rose}45`,`${C.rose}18`] }}
              transition={{ duration:3, repeat:Infinity }}
              style={{ padding:"14px 18px", borderRadius:10, background:"rgba(251,113,133,0.06)", border:"1px solid rgba(251,113,133,0.2)", marginTop:4 }}>
              <div style={{ color:C.rose, fontWeight:700, fontSize:14, marginBottom:6 }}>The core question</div>
              <div style={{ color:"rgba(255,255,255,0.75)", fontSize:13, lineHeight:1.75 }}>
                Is a customer not being found <em>exceptional</em>?<br/>
                No — it's a <strong style={{color:C.emerald}}>perfectly expected outcome</strong> that belongs in your method's type signature.<br/>
                <strong style={{color:C.rose}}>Result&lt;T&gt;</strong> makes it explicit, typed, and impossible to ignore.
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </Wrap>
  );
}
