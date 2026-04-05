import { motion } from "framer-motion";
import { Wrap, Head, Code, C, stagger, fadeUp, Pill } from "../components/shared";

const matchCode = `<span style="color:#6b7280">// Add Match() and MatchAsync() extension methods</span>
<span style="color:#6b7280">// Domain/Common/ResultExtensions.cs</span>

<span style="color:#f472b6">public static class</span> <span style="color:#fbbf24">ResultExtensions</span>
{
    <span style="color:#6b7280">// Match — choose a branch based on success or failure</span>
    <span style="color:#f472b6">public static</span> TOut Match&lt;TIn, TOut&gt;(
        <span style="color:#f472b6">this</span> <span style="color:#34d399">Result</span>&lt;TIn&gt; result,
        Func&lt;TIn, TOut&gt; onSuccess,
        Func&lt;<span style="color:#fb7185">Error</span>, TOut&gt; onFailure)
        => result.IsSuccess
            ? onSuccess(result.Value)
            : onFailure(result.Error);

    <span style="color:#f472b6">public static async</span> Task&lt;TOut&gt; MatchAsync&lt;TIn, TOut&gt;(
        <span style="color:#f472b6">this</span> Task&lt;<span style="color:#34d399">Result</span>&lt;TIn&gt;&gt; resultTask,
        Func&lt;TIn, Task&lt;TOut&gt;&gt; onSuccess,
        Func&lt;<span style="color:#fb7185">Error</span>, Task&lt;TOut&gt;&gt; onFailure)
    {
        <span style="color:#f472b6">var</span> result = <span style="color:#f472b6">await</span> resultTask;
        <span style="color:#f472b6">return</span> result.IsSuccess
            ? <span style="color:#f472b6">await</span> onSuccess(result.Value)
            : <span style="color:#f472b6">await</span> onFailure(result.Error);
    }

    <span style="color:#6b7280">// Tap — side-effect on success only (logging, events)</span>
    <span style="color:#f472b6">public static</span> <span style="color:#34d399">Result</span>&lt;T&gt; Tap&lt;T&gt;(
        <span style="color:#f472b6">this</span> <span style="color:#34d399">Result</span>&lt;T&gt; result,
        Action&lt;T&gt; action)
    {
        <span style="color:#f472b6">if</span> (result.IsSuccess) action(result.Value);
        <span style="color:#f472b6">return</span> result;  <span style="color:#6b7280">// return same result for chaining</span>
    }
}`;

const usageCode = `<span style="color:#6b7280">// ── Checking manually ──────────────────────────────────</span>
<span style="color:#f472b6">var</span> result = <span style="color:#f472b6">await</span> _sender.Send(<span style="color:#f472b6">new</span> GetOrderByIdQuery(id));

<span style="color:#f472b6">if</span> (result.IsFailure)
    <span style="color:#f472b6">return</span> Problem(result.Error.Description); <span style="color:#6b7280">// handle failure</span>

<span style="color:#f472b6">var</span> order = result.Value;  <span style="color:#6b7280">// safe to access after IsFailure check</span>

<span style="color:#6b7280">// ── Using Match() — no explicit check needed ─────────</span>
<span style="color:#f472b6">return</span> result.Match(
    onSuccess: order => Ok(order),
    onFailure: error  => Problem(error)
);

<span style="color:#6b7280">// ── Using MatchAsync() — async version ───────────────</span>
<span style="color:#f472b6">return await</span> _sender.Send(<span style="color:#f472b6">new</span> GetOrderByIdQuery(id))
    .MatchAsync(
        onSuccess: async order => {
            <span style="color:#f472b6">await</span> _cache.SetAsync(<span style="color:#34d399">$"order:{order.Id}"</span>, order);
            <span style="color:#f472b6">return</span> Ok(order);
        },
        onFailure: async error =>
            <span style="color:#f472b6">await</span> Task.FromResult(Problem(error))
    );

<span style="color:#6b7280">// ── Using Tap() — side effect without branching ────────</span>
<span style="color:#f472b6">var</span> result = <span style="color:#f472b6">await</span> CreateOrderAsync(cmd)
    .Tap(order => _logger.LogInformation(<span style="color:#34d399">"Order {Id} created"</span>, order.Id));
<span style="color:#6b7280">// result is unchanged; Tap only fires on success</span>`;

const patterns = [
  {
    name:".Match(onSuccess, onFailure)",
    color:C.sky,
    icon:"🎯",
    desc:"The primary consumption pattern. Forces you to handle both branches. Returns a value — use it at the edge (controller) to produce IActionResult.",
    when:"In controllers / at the API boundary"
  },
  {
    name:".Tap(action)",
    color:C.emerald,
    icon:"👆",
    desc:"Execute a side effect on success without changing the result. Perfect for logging, event dispatch, or analytics after a successful operation.",
    when:"Logging, metrics, side effects"
  },
  {
    name:"if (result.IsFailure) return early",
    color:C.amber,
    icon:"⏎",
    desc:"Classic guard pattern. Check IsFailure at the top of a method and return early with the error. Keeps the happy path linear and left-aligned.",
    when:"Inside handlers, domain services"
  },
  {
    name:".Value (after safety check)",
    color:C.violet,
    icon:"📤",
    desc:"Access the inner value only after verifying IsSuccess. The property guard throws intentionally if you forget — loud failure, easy to debug.",
    when:"Only after IsSuccess/IsFailure check"
  },
];

export default function MatchingResults() {
  return (
    <Wrap>
      <motion.div variants={stagger} initial="hidden" animate="show">
        <Head
          tag="🎯 Match & Unwrap"
          title="Consuming Results — Match, Tap, and Guards"
          sub="Match() is the gold standard. It forces you to handle both paths at compile time. The compiler won't let you forget the failure case."
          color={C.sky}
        />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:22 }}>
          <motion.div variants={fadeUp} style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Code src={matchCode} label="ResultExtensions.cs — Match, MatchAsync, Tap" color={C.sky}/>
          </motion.div>
          <motion.div variants={fadeUp} style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Code src={usageCode} label="Controller + Handler usage patterns" color={C.emerald}/>

            <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
              {patterns.map(p=>(
                <motion.div key={p.name} whileHover={{ x:4 }}
                  style={{ display:"flex", gap:12, padding:"11px 14px", borderRadius:9, background:`${p.color}07`, border:`1px solid ${p.color}20`, alignItems:"flex-start" }}>
                  <span style={{ fontSize:18, flexShrink:0 }}>{p.icon}</span>
                  <div>
                    <code style={{ color:p.color, fontSize:11, fontWeight:600 }}>{p.name}</code>
                    <div style={{ color:C.muted, fontSize:11, lineHeight:1.55, marginTop:3 }}>{p.desc}</div>
                    <div style={{ color:"rgba(255,255,255,0.28)", fontSize:10, marginTop:3 }}>Use when: {p.when}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Wrap>
  );
}
