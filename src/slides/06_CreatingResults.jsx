import { motion } from "framer-motion";
import { Wrap, Head, Code, C, stagger, fadeUp, ResultBadge, ArrowDown } from "../components/shared";

const handlerCode = `<span style="color:#6b7280">// Application/Orders/Commands/CreateOrder/CreateOrderCommandHandler.cs</span>

<span style="color:#f472b6">public class</span> <span style="color:#fbbf24">CreateOrderCommandHandler</span>
    : IRequestHandler&lt;<span style="color:#fbbf24">CreateOrderCommand</span>, <span style="color:#34d399">Result</span>&lt;<span style="color:#fbbf24">Guid</span>&gt;&gt;
{
    <span style="color:#f472b6">public async</span> Task&lt;<span style="color:#34d399">Result</span>&lt;<span style="color:#fbbf24">Guid</span>&gt;&gt; Handle(
        <span style="color:#fbbf24">CreateOrderCommand</span> cmd, CancellationToken ct)
    {
        <span style="color:#6b7280">// 1. Guard: does the customer exist?</span>
        <span style="color:#f472b6">var</span> customer = <span style="color:#f472b6">await</span> _customers.GetByIdAsync(cmd.CustomerId, ct);
        <span style="color:#f472b6">if</span> (customer <span style="color:#f472b6">is null</span>)
            <span style="color:#f472b6">return</span> <span style="color:#fb7185">CustomerErrors</span>.NotFound(cmd.CustomerId); <span style="color:#6b7280">// implicit Error → Result</span>

        <span style="color:#6b7280">// 2. Guard: is the customer suspended?</span>
        <span style="color:#f472b6">if</span> (customer.IsSuspended)
            <span style="color:#f472b6">return</span> <span style="color:#fb7185">CustomerErrors</span>.Suspended;

        <span style="color:#6b7280">// 3. Guard: sufficient credit?</span>
        <span style="color:#f472b6">if</span> (customer.CreditLimit &lt; cmd.TotalAmount)
            <span style="color:#f472b6">return</span> <span style="color:#fb7185">CustomerErrors</span>.InsufficientCredit;

        <span style="color:#6b7280">// 4. Domain: create the order (domain method returns Result too!)</span>
        <span style="color:#f472b6">var</span> orderResult = Order.Create(customer, cmd.Items);
        <span style="color:#f472b6">if</span> (orderResult.IsFailure)
            <span style="color:#f472b6">return</span> orderResult.Error;  <span style="color:#6b7280">// propagate domain error</span>

        <span style="color:#6b7280">// 5. Happy path — persist and return the ID</span>
        <span style="color:#f472b6">await</span> _orders.AddAsync(orderResult.Value, ct);
        <span style="color:#f472b6">await</span> _uow.SaveChangesAsync(ct);

        <span style="color:#f472b6">return</span> orderResult.Value.Id;  <span style="color:#6b7280">// implicit Guid → Result&lt;Guid&gt;</span>
    }
}`;

const domainCode = `<span style="color:#6b7280">// Domain/Orders/Order.cs — domain methods return Result too</span>

<span style="color:#f472b6">public class</span> <span style="color:#fbbf24">Order</span> : Entity
{
    <span style="color:#f472b6">public static</span> <span style="color:#34d399">Result</span>&lt;<span style="color:#fbbf24">Order</span>&gt; Create(<span style="color:#fbbf24">Customer</span> customer, List&lt;<span style="color:#fbbf24">OrderItem</span>&gt; items)
    {
        <span style="color:#f472b6">if</span> (items <span style="color:#f472b6">is null</span> || !items.Any())
            <span style="color:#f472b6">return</span> <span style="color:#fb7185">OrderErrors</span>.EmptyItems;  <span style="color:#6b7280">// explicit Error → Result</span>

        <span style="color:#f472b6">if</span> (items.Count > <span style="color:#34d399">50</span>)
            <span style="color:#f472b6">return</span> <span style="color:#fb7185">Error</span>.Validation(
                <span style="color:#34d399">"Order.TooManyItems"</span>,
                <span style="color:#34d399">"Orders cannot exceed 50 items"</span>);

        <span style="color:#f472b6">var</span> order = <span style="color:#f472b6">new</span> Order { CustomerId = customer.Id };
        <span style="color:#f472b6">foreach</span> (<span style="color:#f472b6">var</span> item <span style="color:#f472b6">in</span> items)
            order._items.Add(item);

        order.AddDomainEvent(<span style="color:#f472b6">new</span> OrderCreatedEvent(order.Id));
        <span style="color:#f472b6">return</span> order;  <span style="color:#6b7280">// implicit Order → Result&lt;Order&gt;</span>
    }

    <span style="color:#f472b6">public</span> <span style="color:#34d399">Result</span> Confirm()
    {
        <span style="color:#f472b6">if</span> (Status != OrderStatus.Draft)
            <span style="color:#f472b6">return</span> <span style="color:#fb7185">OrderErrors</span>.CannotModifyConfirmed;

        Status = OrderStatus.Confirmed;
        <span style="color:#f472b6">return</span> Result.Success();
    }
}`;

const implicitExamples = [
  { code:`return customer;`, note:"Customer → Result<Customer> ✅ (success)", color:C.emerald },
  { code:`return CustomerErrors.NotFound(id);`, note:"Error → Result<Customer> ❌ (failure)", color:C.rose },
  { code:`return Error.Validation(\"x\", \"y\");`, note:"Error → Result<Customer> ❌ (failure)", color:C.rose },
  { code:`return Result.Success(order.Id);`, note:"Explicit factory method ✅", color:C.emerald },
  { code:`return Result.Failure<Guid>(error);`, note:"Explicit factory method ❌", color:C.rose },
];

export default function CreatingResults() {
  return (
    <Wrap>
      <motion.div variants={stagger} initial="hidden" animate="show">
        <Head
          tag="✍ Creating Results"
          title="Returning Results from handlers and domain"
          sub="The implicit operator makes it natural. Return the value on success, return the Error on failure. No wrapper noise. The type system does the work."
          color={C.emerald}
        />
        <div style={{ display:"grid", gridTemplateColumns:"1.05fr 1fr", gap:22 }}>
          <motion.div variants={fadeUp} style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Code src={handlerCode} label="CreateOrderCommandHandler.cs" color={C.emerald}/>
          </motion.div>
          <motion.div variants={fadeUp} style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Code src={domainCode} label="Order.cs — domain methods return Result" color={C.rose}/>

            {/* Implicit conversions */}
            <div style={{ padding:"14px 18px", borderRadius:11, background:"rgba(52,211,153,0.06)", border:"1px solid rgba(52,211,153,0.2)" }}>
              <div style={{ color:C.emerald, fontWeight:700, fontSize:12, marginBottom:10 }}>⚡ Implicit Conversions — zero boilerplate</div>
              {implicitExamples.map((ex,i)=>(
                <div key={i} style={{ padding:"6px 0", borderBottom:i<implicitExamples.length-1?"1px solid rgba(255,255,255,0.05)":"none" }}>
                  <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                    <code style={{ color:ex.color, fontSize:11, flex:1 }}>{ex.code}</code>
                  </div>
                  <div style={{ color:"rgba(255,255,255,0.3)", fontSize:10, marginTop:2 }}>→ {ex.note}</div>
                </div>
              ))}
            </div>

            <div style={{ padding:"13px 16px", borderRadius:10, background:"rgba(0,0,0,0.3)", border:"1px dashed rgba(52,211,153,0.2)" }}>
              <div style={{ color:C.emerald, fontWeight:700, fontSize:12, marginBottom:6 }}>🏛️ Domain returns Result too</div>
              <div style={{ color:C.muted, fontSize:12, lineHeight:1.7 }}>
                Domain methods like <code style={{color:"#fff"}}>Order.Create()</code> and <code style={{color:"#fff"}}>order.Confirm()</code> return <code style={{color:C.emerald}}>Result&lt;T&gt;</code>.<br/>
                This pushes business rule validation into the domain where it belongs — not into Application layer guards.
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Wrap>
  );
}
