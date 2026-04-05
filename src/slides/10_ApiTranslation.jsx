import { motion } from "framer-motion";
import { Wrap, Head, Code, C, stagger, fadeUp, Pill } from "../components/shared";

const translatorCode = `<span style="color:#6b7280">// API/Common/ResultExtensions.cs — translate Result → IActionResult</span>

<span style="color:#f472b6">public static class</span> <span style="color:#fbbf24">ResultExtensions</span>
{
    <span style="color:#6b7280">// Map ErrorType → correct HTTP problem response</span>
    <span style="color:#f472b6">public static</span> IActionResult ToProblem(<span style="color:#f472b6">this</span> <span style="color:#fb7185">Error</span> error)
        => error.Type <span style="color:#f472b6">switch</span>
        {
            <span style="color:#fbbf24">ErrorType</span>.NotFound    => <span style="color:#f472b6">new</span> NotFoundObjectResult(
                                       CreateProblem(StatusCodes.Status404NotFound, error)),
            <span style="color:#fbbf24">ErrorType</span>.Validation  => <span style="color:#f472b6">new</span> BadRequestObjectResult(
                                       CreateProblem(StatusCodes.Status400BadRequest, error)),
            <span style="color:#fbbf24">ErrorType</span>.Conflict    => <span style="color:#f472b6">new</span> ConflictObjectResult(
                                       CreateProblem(StatusCodes.Status409Conflict, error)),
            <span style="color:#fbbf24">ErrorType</span>.Unauthorized=> <span style="color:#f472b6">new</span> ObjectResult(
                                       CreateProblem(StatusCodes.Status403Forbidden, error))
                                       { StatusCode = <span style="color:#34d399">403</span> },
            _                       => <span style="color:#f472b6">new</span> ObjectResult(
                                       CreateProblem(StatusCodes.Status500InternalServerError, error))
                                       { StatusCode = <span style="color:#34d399">500</span> }
        };

    <span style="color:#f472b6">private static</span> ProblemDetails CreateProblem(<span style="color:#f472b6">int</span> status, <span style="color:#fb7185">Error</span> error)
        => <span style="color:#f472b6">new</span>()
        {
            Status = status,
            Title  = error.Code,
            Detail = error.Description,
            Type   = <span style="color:#34d399">$"https://tools.ietf.org/html/rfc7231#{status}"</span>
        };
}`;

const controllerCode = `<span style="color:#6b7280">// API/Controllers/OrdersController.cs — clean controllers</span>

[ApiController, Route(<span style="color:#34d399">"api/[controller]"</span>)]
<span style="color:#f472b6">public class</span> <span style="color:#fbbf24">OrdersController</span> : ControllerBase
{
    <span style="color:#f472b6">private readonly</span> ISender _sender;

    [HttpPost]
    <span style="color:#f472b6">public async</span> Task&lt;IActionResult&gt; Create(
        [FromBody] <span style="color:#fbbf24">CreateOrderRequest</span> req)
    {
        <span style="color:#f472b6">var</span> result = <span style="color:#f472b6">await</span> _sender.Send(
            <span style="color:#f472b6">new</span> <span style="color:#fbbf24">CreateOrderCommand</span>(req.CustomerId, req.Items));

        <span style="color:#f472b6">return</span> result.Match(
            onSuccess: id   => CreatedAtAction(<span style="color:#f472b6">nameof</span>(GetById), <span style="color:#f472b6">new</span> { id }, <span style="color:#f472b6">null</span>),
            onFailure: error => error.ToProblem()  <span style="color:#6b7280">// ← one line, typed dispatch</span>
        );
    }

    [HttpGet(<span style="color:#34d399">"{id:guid}"</span>)]
    <span style="color:#f472b6">public async</span> Task&lt;IActionResult&gt; GetById(Guid id)
    {
        <span style="color:#f472b6">return await</span> _sender.Send(<span style="color:#f472b6">new</span> <span style="color:#fbbf24">GetOrderByIdQuery</span>(id))
            .MatchAsync(
                onSuccess: async dto   => Ok(dto),
                onFailure: async error => error.ToProblem()
            );
    }

    [HttpDelete(<span style="color:#34d399">"{id:guid}"</span>)]
    <span style="color:#f472b6">public async</span> Task&lt;IActionResult&gt; Cancel(Guid id)
    {
        <span style="color:#f472b6">var</span> result = <span style="color:#f472b6">await</span> _sender.Send(<span style="color:#f472b6">new</span> <span style="color:#fbbf24">CancelOrderCommand</span>(id));

        <span style="color:#f472b6">return</span> result.IsSuccess
            ? NoContent()
            : result.Error.ToProblem();
    }
}`;

const errorToHttp = [
  { errorType:"ErrorType.NotFound",     http:"404 Not Found",      body:"{title,detail}", color:C.amber },
  { errorType:"ErrorType.Validation",   http:"400 Bad Request",    body:"Problem Details",color:C.rose },
  { errorType:"ErrorType.Conflict",     http:"409 Conflict",       body:"{title,detail}", color:C.violet },
  { errorType:"ErrorType.Unauthorized", http:"403 Forbidden",      body:"{title,detail}", color:C.sky },
  { errorType:"ErrorType.Failure",      http:"500 Internal Error", body:"{title,detail}", color:C.red },
];

export default function ApiTranslation() {
  return (
    <Wrap>
      <motion.div variants={stagger} initial="hidden" animate="show">
        <Head
          tag="🌐 API Layer"
          title="Translating Result → HTTP at the boundary"
          sub="One extension method maps every ErrorType to the correct HTTP status and Problem Details body. Controllers stay thin. Error handling is automatic."
          color={C.sky}
        />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:22 }}>
          <motion.div variants={fadeUp} style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Code src={translatorCode} label="ResultExtensions.cs — Error → IActionResult" color={C.sky}/>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <p style={{ color:C.muted, fontSize:11, letterSpacing:"0.08em" }}>AUTOMATIC HTTP STATUS MAPPING</p>
              {errorToHttp.map(e=>(
                <div key={e.errorType} style={{ display:"flex", gap:10, padding:"7px 12px", borderRadius:7, background:`${e.color}08`, border:`1px solid ${e.color}22`, alignItems:"center" }}>
                  <code style={{ color:e.color, fontSize:10, flex:1 }}>{e.errorType}</code>
                  <div style={{ padding:"2px 8px", borderRadius:4, background:`${e.color}15`, border:`1px solid ${e.color}30`, color:e.color, fontSize:10, fontWeight:700, whiteSpace:"nowrap" }}>{e.http}</div>
                  <span style={{ color:C.muted, fontSize:10 }}>{e.body}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div variants={fadeUp} style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Code src={controllerCode} label="OrdersController.cs — every action uses Match()" color={C.emerald}/>
            <div style={{ padding:"14px 18px", borderRadius:10, background:"rgba(56,189,248,0.06)", border:"1px solid rgba(56,189,248,0.2)" }}>
              <div style={{ color:C.sky, fontWeight:700, fontSize:13, marginBottom:8 }}>📜 RFC 7807 Problem Details</div>
              <div style={{ background:"rgba(0,0,0,0.4)", borderRadius:8, padding:"12px 14px", fontFamily:"Fira Code, monospace", fontSize:11, color:C.muted, lineHeight:1.7 }}>
                {`{\n  "type": "https://tools.ietf.org/html/rfc7231#404",\n  "title": "Order.NotFound",\n  "status": 404,\n  "detail": "Order with ID abc-123 was not found."\n}`}
              </div>
              <div style={{ color:C.muted, fontSize:11, marginTop:8, lineHeight:1.6 }}>
                Structured, machine-readable error responses. Every consumer knows exactly what failed and why — no parsing error messages needed.
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Wrap>
  );
}
