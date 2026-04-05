import { motion } from "framer-motion";
import { Wrap, Head, Code, C, stagger, fadeUp, Pill } from "../components/shared";

const multiErrorCode = `<span style="color:#6b7280">// Extending Result to support multiple validation errors</span>
<span style="color:#6b7280">// Domain/Common/ValidationResult.cs</span>

<span style="color:#6b7280">// Marker interface — lets the API layer detect multi-error results</span>
<span style="color:#f472b6">public interface</span> <span style="color:#fbbf24">IValidationResult</span>
{
    <span style="color:#f472b6">public static readonly</span> <span style="color:#fb7185">Error</span> ValidationError
        = <span style="color:#fb7185">Error</span>.Validation(<span style="color:#34d399">"Validation.General"</span>, <span style="color:#34d399">"Validation problem occurred"</span>);

    <span style="color:#fb7185">Error</span>[] Errors { <span style="color:#f472b6">get</span>; }
}

<span style="color:#f472b6">public sealed class</span> <span style="color:#34d399">ValidationResult</span>&lt;TValue&gt; : <span style="color:#34d399">Result</span>&lt;TValue&gt;, <span style="color:#fbbf24">IValidationResult</span>
{
    <span style="color:#6b7280">// Pass the sentinel ValidationError to satisfy the base guard
    // (base requires an Error when isSuccess = false)</span>
    <span style="color:#f472b6">private</span> ValidationResult(<span style="color:#fb7185">Error</span>[] errors)
        : <span style="color:#f472b6">base</span>(<span style="color:#f472b6">default</span>!, <span style="color:#f472b6">false</span>, <span style="color:#fbbf24">IValidationResult</span>.ValidationError)
        => Errors = errors;

    <span style="color:#6b7280">// Returns ALL validation errors — not just the first</span>
    <span style="color:#f472b6">public</span> <span style="color:#fb7185">Error</span>[] Errors { <span style="color:#f472b6">get</span>; }

    <span style="color:#f472b6">public static</span> <span style="color:#34d399">ValidationResult</span>&lt;TValue&gt; WithErrors(<span style="color:#fb7185">Error</span>[] errors)
        => <span style="color:#f472b6">new</span>(errors);
}

<span style="color:#6b7280">// Factory helper</span>
<span style="color:#f472b6">public static partial class</span> <span style="color:#34d399">Result</span>
{
    <span style="color:#f472b6">public static</span> <span style="color:#34d399">ValidationResult</span>&lt;TValue&gt; ValidationFailure&lt;TValue&gt;(
        <span style="color:#fb7185">Error</span>[] errors)
        => <span style="color:#34d399">ValidationResult</span>&lt;TValue&gt;.WithErrors(errors);
}`;

const behaviourCode = `<span style="color:#6b7280">// Updated ValidationBehavior — collects ALL errors, returns Result</span>

<span style="color:#f472b6">public class</span> <span style="color:#fbbf24">ValidationBehavior</span>&lt;TRequest, TResponse&gt;
    : IPipelineBehavior&lt;TRequest, TResponse&gt;
    <span style="color:#f472b6">where</span> TRequest : IRequest&lt;TResponse&gt;
    <span style="color:#f472b6">where</span> TResponse : <span style="color:#34d399">Result</span>
{
    <span style="color:#f472b6">public async</span> Task&lt;TResponse&gt; Handle(
        TRequest request, RequestHandlerDelegate&lt;TResponse&gt; next, CancellationToken ct)
    {
        <span style="color:#f472b6">if</span> (!_validators.Any()) <span style="color:#f472b6">return await</span> next();

        <span style="color:#6b7280">// Run all validators, collect ALL errors</span>
        <span style="color:#f472b6">var</span> ctx = <span style="color:#f472b6">new</span> ValidationContext&lt;TRequest&gt;(request);
        <span style="color:#f472b6">var</span> validationResults = <span style="color:#f472b6">await</span> Task.WhenAll(
            _validators.Select(v => v.ValidateAsync(ctx, ct)));

        <span style="color:#f472b6">var</span> errors = validationResults
            .Where(r => r.Errors.Any())
            .SelectMany(r => r.Errors)
            .Select(f => <span style="color:#fb7185">Error</span>.Validation(f.PropertyName, f.ErrorMessage))
            .Distinct()
            .ToArray();

        <span style="color:#f472b6">if</span> (errors.Length > <span style="color:#34d399">0</span>)
        {
            <span style="color:#6b7280">// Return ValidationResult with ALL errors — no throwing!</span>
            <span style="color:#f472b6">return</span> (TResponse)(object)<span style="color:#34d399">Result</span>.ValidationFailure&lt;<span style="color:#f472b6">dynamic</span>&gt;(errors);
        }

        <span style="color:#f472b6">return await</span> next();
    }
}`;

const apiCode = `<span style="color:#6b7280">// API — handle multiple validation errors in the response</span>

<span style="color:#f472b6">public static</span> IActionResult ToProblem(<span style="color:#f472b6">this</span> <span style="color:#34d399">Result</span> result)
{
    <span style="color:#f472b6">if</span> (!result.IsFailure)
        <span style="color:#f472b6">throw new</span> InvalidOperationException(<span style="color:#34d399">"Cannot convert success to problem"</span>);

    <span style="color:#6b7280">// Multiple validation errors — include all in response</span>
    <span style="color:#f472b6">if</span> (result <span style="color:#f472b6">is</span> IValidationResult validationResult)
    {
        <span style="color:#f472b6">return new</span> BadRequestObjectResult(<span style="color:#f472b6">new</span> ValidationProblemDetails
        {
            Status = <span style="color:#34d399">400</span>,
            Title  = <span style="color:#34d399">"Validation failed"</span>,
            Errors = validationResult.Errors
                .GroupBy(e => e.Code)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(e => e.Description).ToArray())
        });
    }

    <span style="color:#f472b6">return</span> result.Error.ToProblem();
}`;

const validatorSample = `<span style="color:#6b7280">// Application/Orders/Commands/CreateOrder/CreateOrderCommandValidator.cs</span>

<span style="color:#f472b6">public class</span> <span style="color:#fbbf24">CreateOrderCommandValidator</span>
    : AbstractValidator&lt;<span style="color:#fbbf24">CreateOrderCommand</span>&gt;
{
    <span style="color:#f472b6">public</span> CreateOrderCommandValidator()
    {
        RuleFor(x => x.CustomerId).NotEmpty();
        RuleFor(x => x.Items)
            .NotEmpty().WithMessage(<span style="color:#34d399">"At least one item required"</span>)
            .Must(i => i.Count &lt;= <span style="color:#34d399">50</span>).WithMessage(<span style="color:#34d399">"Max 50 items"</span>);
        RuleForEach(x => x.Items).ChildRules(i => {
            i.RuleFor(x => x.Quantity).GreaterThan(<span style="color:#34d399">0</span>);
            i.RuleFor(x => x.UnitPrice).GreaterThan(<span style="color:#34d399">0</span>);
        });
    }
}`;

export default function ValidationResult() {
  return (
    <Wrap pad="78px 54px 28px">
      <motion.div variants={stagger} initial="hidden" animate="show">
        <Head
          tag="✅ Validation + Result"
          title="FluentValidation that returns Results, not exceptions"
          sub="Collect ALL validation errors in one pass. Return a ValidationResult with every broken rule. The client gets a structured 400 with all fields at once — not one error per request."
          color={C.emerald}
        />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
          <motion.div variants={fadeUp} style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <Code src={multiErrorCode} label="ValidationResult<T> — holds multiple errors" color={C.emerald}/>
            <Code src={validatorSample} label="CreateOrderCommandValidator.cs" color={C.violet}/>
          </motion.div>
          <motion.div variants={fadeUp} style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <Code src={behaviourCode} label="ValidationBehavior — collects ALL errors" color={C.amber}/>
            <Code src={apiCode} label="ToProblem() — handles ValidationResult" color={C.sky}/>

            {/* Example response */}
            <div style={{ padding:"13px 16px", borderRadius:10, background:"rgba(0,0,0,0.4)", border:"1px solid rgba(52,211,153,0.15)" }}>
              <div style={{ color:C.emerald, fontWeight:700, fontSize:12, marginBottom:6 }}>📤 Response: 400 with all errors at once</div>
              <pre style={{ color:C.muted, fontSize:11, lineHeight:1.7, margin:0 }}>{`{
  "title": "Validation failed",
  "status": 400,
  "errors": {
    "CustomerId": ["'Customer Id' must not be empty."],
    "Items": ["At least one item required"],
    "Items[0].Quantity": ["Must be greater than 0"],
    "Items[0].UnitPrice": ["Must be greater than 0"]
  }
}`}</pre>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Wrap>
  );
}
