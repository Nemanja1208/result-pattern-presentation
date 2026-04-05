import { motion } from "framer-motion";
import { Wrap, Head, Code, C, stagger, fadeUp, Pill } from "../components/shared";

const commandCode = `<span style="color:#6b7280">// Commands return Result — handler signature tells the truth</span>

<span style="color:#6b7280">// The Command — IRequest wraps the Result</span>
<span style="color:#f472b6">public record</span> <span style="color:#fbbf24">CreateOrderCommand</span>(
    Guid CustomerId, List&lt;OrderItemDto&gt; Items
) : IRequest&lt;<span style="color:#34d399">Result</span>&lt;Guid&gt;&gt;;

<span style="color:#6b7280">// Query — same pattern, returns Result&lt;DTO&gt;</span>
<span style="color:#f472b6">public record</span> <span style="color:#fbbf24">GetOrderByIdQuery</span>(Guid OrderId)
    : IRequest&lt;<span style="color:#34d399">Result</span>&lt;<span style="color:#fbbf24">OrderDetailDto</span>&gt;&gt;;

<span style="color:#6b7280">// ───────────────────────────────────────────────────────────</span>

<span style="color:#6b7280">// Handler for the Command</span>
<span style="color:#f472b6">public class</span> <span style="color:#fbbf24">CreateOrderCommandHandler</span>
    : IRequestHandler&lt;<span style="color:#fbbf24">CreateOrderCommand</span>, <span style="color:#34d399">Result</span>&lt;Guid&gt;&gt;
{
    <span style="color:#f472b6">public async</span> Task&lt;<span style="color:#34d399">Result</span>&lt;Guid&gt;&gt; Handle(
        <span style="color:#fbbf24">CreateOrderCommand</span> cmd, CancellationToken ct)
    {
        <span style="color:#f472b6">var</span> customer = <span style="color:#f472b6">await</span> _customers.GetByIdAsync(cmd.CustomerId, ct);
        <span style="color:#f472b6">if</span> (customer <span style="color:#f472b6">is null</span>)
            <span style="color:#f472b6">return</span> <span style="color:#fb7185">CustomerErrors</span>.NotFound(cmd.CustomerId);

        <span style="color:#f472b6">var</span> orderResult = Order.Create(customer, cmd.Items);
        <span style="color:#f472b6">if</span> (orderResult.IsFailure) <span style="color:#f472b6">return</span> orderResult.Error;

        <span style="color:#f472b6">await</span> _orders.AddAsync(orderResult.Value, ct);
        <span style="color:#f472b6">await</span> _uow.SaveChangesAsync(ct);

        <span style="color:#f472b6">return</span> orderResult.Value.Id; <span style="color:#6b7280">// Guid → Result&lt;Guid&gt; implicit</span>
    }
}`;

const pipelineCode = `<span style="color:#6b7280">// ValidationBehavior — aware of Result, doesn't throw</span>

<span style="color:#f472b6">public class</span> <span style="color:#fbbf24">ValidationBehavior</span>&lt;TRequest, TResponse&gt;
    : IPipelineBehavior&lt;TRequest, TResponse&gt;
    <span style="color:#f472b6">where</span> TRequest : IRequest&lt;TResponse&gt;
    <span style="color:#f472b6">where</span> TResponse : <span style="color:#34d399">Result</span>   <span style="color:#6b7280">// ← constrain to Result types only</span>
{
    <span style="color:#f472b6">public async</span> Task&lt;TResponse&gt; Handle(
        TRequest request,
        RequestHandlerDelegate&lt;TResponse&gt; next,
        CancellationToken ct)
    {
        <span style="color:#f472b6">if</span> (!_validators.Any()) <span style="color:#f472b6">return await</span> next();

        <span style="color:#f472b6">var</span> errors = _validators
            .SelectMany(v => v.Validate(request).Errors)
            .Select(f => <span style="color:#fb7185">Error</span>.Validation(f.PropertyName, f.ErrorMessage))
            .ToList();

        <span style="color:#f472b6">if</span> (errors.Any())
        {
            <span style="color:#6b7280">// Return Result.Failure — no throw!</span>
            <span style="color:#f472b6">return</span> (TResponse)(object)<span style="color:#34d399">Result</span>.Failure&lt;<span style="color:#f472b6">dynamic</span>&gt;(errors.First());
        }

        <span style="color:#f472b6">return await</span> next();
    }
}`;

const flow = [
  { step:"1", label:"IRequest<Result<Guid>>",       desc:"Command type carries Result in signature", color:C.sky,     icon:"📝" },
  { step:"2", label:"ValidationBehavior (Result)",  desc:"Returns Result.Failure — no exception thrown", color:C.emerald, icon:"✅" },
  { step:"3", label:"Handler: returns Result",      desc:"Early return on failure, value on success", color:C.violet,  icon:"⬡" },
  { step:"4", label:"Result propagates to caller",  desc:"ISender.Send() returns Result<Guid>", color:C.amber,   icon:"📤" },
  { step:"5", label:"Controller: Match() → HTTP",   desc:"Translate Result to IActionResult", color:C.rose,    icon:"🌐" },
];

export default function MediatRResult() {
  return (
    <Wrap>
      <motion.div variants={stagger} initial="hidden" animate="show">
        <Head
          tag="⚡ MediatR + Result"
          title={<>MediatR handlers that return Result&lt;T&gt;</>}
          sub="Commands and Queries declare IRequest<Result<T>>. ValidationBehavior returns Result.Failure instead of throwing. No exceptions escape the pipeline — ever."
          color={C.violet}
        />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:22 }}>
          <motion.div variants={fadeUp} style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Code src={commandCode} label="CreateOrderCommand + Handler" color={C.violet}/>
          </motion.div>
          <motion.div variants={fadeUp} style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Code src={pipelineCode} label="ValidationBehavior — Result-aware pipeline" color={C.emerald}/>

            {/* Flow diagram */}
            <div style={{ padding:"14px 18px", borderRadius:11, background:"rgba(167,139,250,0.06)", border:"1px solid rgba(167,139,250,0.2)" }}>
              <p style={{ color:C.muted, fontSize:10, marginBottom:10, letterSpacing:"0.1em" }}>FULL PIPELINE WITH RESULT</p>
              {flow.map((s,i)=>(
                <div key={s.step}>
                  <div style={{ display:"flex", gap:10, alignItems:"center", padding:"8px 10px", borderRadius:7, background:`${s.color}0a`, border:`1px solid ${s.color}20` }}>
                    <div style={{ width:20, height:20, borderRadius:"50%", background:`${s.color}20`, border:`1px solid ${s.color}40`, display:"flex", alignItems:"center", justifyContent:"center", color:s.color, fontSize:10, fontWeight:800, flexShrink:0 }}>{s.step}</div>
                    <span style={{ fontSize:14 }}>{s.icon}</span>
                    <div>
                      <div style={{ color:s.color, fontWeight:700, fontSize:11 }}>{s.label}</div>
                      <div style={{ color:C.muted, fontSize:10 }}>{s.desc}</div>
                    </div>
                  </div>
                  {i<flow.length-1&&<motion.div animate={{opacity:[0.2,0.6,0.2]}} transition={{duration:1.5,repeat:Infinity,delay:i*0.25}} style={{paddingLeft:20,color:"rgba(255,255,255,0.2)",fontSize:12,lineHeight:"16px"}}>↓</motion.div>}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Wrap>
  );
}
