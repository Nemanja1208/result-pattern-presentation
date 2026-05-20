import { motion } from "framer-motion";
import { Wrap, Head, Code, C, stagger, fadeUp, Pill, Card } from "../components/shared";

const errorTypesCode = `<span style="color:#6b7280">// Error catalogue — define errors close to the domain that owns them</span>

<span style="color:#6b7280">// Orders/Errors/OrderErrors.cs</span>
<span style="color:#f472b6">public static class</span> <span style="color:#fbbf24">OrderErrors</span>
{
    <span style="color:#f472b6">public static</span> <span style="color:#fb7185">Error</span> NotFound(Guid id)
        => <span style="color:#fb7185">Error</span>.NotFound(
            <span style="color:#34d399">"Order.NotFound"</span>,
            <span style="color:#34d399">$"Order with ID {id} was not found."</span>);

    <span style="color:#f472b6">public static readonly</span> <span style="color:#fb7185">Error</span> CannotModifyConfirmed
        = <span style="color:#fb7185">Error</span>.Conflict(
            <span style="color:#34d399">"Order.CannotModifyConfirmed"</span>,
            <span style="color:#34d399">"A confirmed order cannot be modified."</span>);

    <span style="color:#f472b6">public static readonly</span> <span style="color:#fb7185">Error</span> EmptyItems
        = <span style="color:#fb7185">Error</span>.Validation(
            <span style="color:#34d399">"Order.EmptyItems"</span>,
            <span style="color:#34d399">"An order must contain at least one item."</span>);
}

<span style="color:#6b7280">// Customers/Errors/CustomerErrors.cs</span>
<span style="color:#f472b6">public static class</span> <span style="color:#fbbf24">CustomerErrors</span>
{
    <span style="color:#f472b6">public static</span> <span style="color:#fb7185">Error</span> NotFound(Guid id)
        => <span style="color:#fb7185">Error</span>.NotFound(
            <span style="color:#34d399">"Customer.NotFound"</span>,
            <span style="color:#34d399">$"Customer {id} does not exist."</span>);

    <span style="color:#f472b6">public static readonly</span> <span style="color:#fb7185">Error</span> InsufficientCredit
        = <span style="color:#fb7185">Error</span>.Failure(
            <span style="color:#34d399">"Customer.InsufficientCredit"</span>,
            <span style="color:#34d399">"Customer has insufficient credit for this order."</span>);

    <span style="color:#f472b6">public static readonly</span> <span style="color:#fb7185">Error</span> Suspended
        = <span style="color:#fb7185">Error</span>.Unauthorized(
            <span style="color:#34d399">"Customer.Suspended"</span>,
            <span style="color:#34d399">"This customer account has been suspended."</span>);
}`;

const errorTypes = [
  {
    type:"None",          color:C.slate,   icon:"·",  httpStatus:"(not an error)",
    desc:"The sentinel value used internally when there is no error. Never returned to callers.",
    example:"Error.None"
  },
  {
    type:"Failure",       color:C.rose,    icon:"💥", httpStatus:"500",
    desc:"An unexpected or unclassified failure. Use sparingly — prefer specific types. Maps to 500 Internal Server Error.",
    example:"Error.Failure(\"Order.Save\", \"Failed to persist order\")"
  },
  {
    type:"NotFound",      color:C.amber,   icon:"🔍", httpStatus:"404",
    desc:"The requested resource does not exist. Common for GetById queries. Maps to 404 Not Found.",
    example:"Error.NotFound(\"Order.NotFound\", $\"Order {id} not found\")"
  },
  {
    type:"Validation",    color:C.emerald, icon:"⚠️", httpStatus:"400",
    desc:"Input failed business rule validation. One or more fields are invalid. Maps to 400 Bad Request.",
    example:"Error.Validation(\"Order.EmptyItems\", \"Must have at least one item\")"
  },
  {
    type:"Conflict",      color:C.violet,  icon:"⚡", httpStatus:"409",
    desc:"The operation conflicts with the current state. E.g., can't modify a confirmed order. Maps to 409 Conflict.",
    example:"Error.Conflict(\"Order.AlreadyConfirmed\", \"Order is already confirmed\")"
  },
  {
    type:"Unauthorized",  color:C.sky,     icon:"🔒", httpStatus:"403",
    desc:"The caller lacks permission to perform this operation. Maps to 401 or 403 depending on context.",
    example:"Error.Unauthorized(\"Order.AccessDenied\", \"Not your order\")"
  },
];

export default function ErrorTypes() {
  return (
    <Wrap>
      <motion.div variants={stagger} initial="hidden" animate="show">
        <Head
          tag="🗂 Error Types"
          title="Typed errors — every failure has a category"
          sub="ErrorType is an enum that tells the API layer exactly what HTTP status to return. No more guessing. Define static error catalogues next to the domain that owns them."
          color={C.violet}
        />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:22 }}>
          <motion.div variants={fadeUp} style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Code src={errorTypesCode} label="OrderErrors.cs + CustomerErrors.cs" color={C.violet}/>
            <div style={{ padding:"13px 16px", borderRadius:10, background:"rgba(167,139,250,0.06)", border:"1px dashed rgba(167,139,250,0.25)" }}>
              <div style={{ color:C.violet, fontWeight:700, fontSize:12, marginBottom:6 }}>💡 Why static error classes?</div>
              <div style={{ color:C.muted, fontSize:12, lineHeight:1.7 }}>
                Centralises error codes. Prevents typos in magic strings. Makes errors discoverable by IDE autocomplete.<br/><br/>
                <code style={{color:C.emerald}}>OrderErrors.NotFound(id)</code> is far better than<br/>
                <code style={{color:C.rose}}>Error.NotFound("Order.NotFound", $"Order...")</code> scattered everywhere.
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} style={{ display:"flex", flexDirection:"column", gap:9 }}>
            <p style={{ color:C.muted, fontSize:11, marginBottom:4, letterSpacing:"0.1em" }}>ERROR TYPE CATALOGUE → HTTP STATUS MAPPING</p>
            {errorTypes.map(e=>(
              <motion.div key={e.type} whileHover={{ x:4 }}
                style={{
                  display:"flex", gap:12, padding:"11px 14px", borderRadius:9,
                  background:`${e.color}07`, border:`1px solid ${e.color}22`,
                  alignItems:"flex-start"
                }}>
                <span style={{ fontSize:18, lineHeight:1, flexShrink:0, width:24, textAlign:"center" }}>{e.icon}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:3 }}>
                    <span style={{ color:e.color, fontWeight:700, fontSize:13, fontFamily:"Fira Code, monospace" }}>ErrorType.{e.type}</span>
                    <span style={{
                      padding:"1px 7px", borderRadius:3, fontSize:10, fontWeight:700,
                      background:`${e.color}15`, border:`1px solid ${e.color}30`, color:e.color
                    }}>HTTP {e.httpStatus}</span>
                  </div>
                  <div style={{ color:C.muted, fontSize:11, lineHeight:1.5, marginBottom:4 }}>{e.desc}</div>
                  <code style={{ color:"rgba(255,255,255,0.3)", fontSize:10 }}>{e.example}</code>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </Wrap>
  );
}
