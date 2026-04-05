import { motion } from "framer-motion";
import { Wrap, Head, Code, C, stagger, fadeUp, Pill } from "../components/shared";

const errorCode = `<span style="color:#6b7280">// Domain/Common/Error.cs — the Error primitive</span>

<span style="color:#f472b6">public sealed record</span> <span style="color:#fb7185">Error</span>(
    <span style="color:#fbbf24">ErrorType</span> Type,
    <span style="color:#f472b6">string</span> Code,
    <span style="color:#f472b6">string</span> Description
) {
    <span style="color:#6b7280">// Static factory methods — one per error category</span>
    <span style="color:#f472b6">public static</span> <span style="color:#fb7185">Error</span> Failure(<span style="color:#f472b6">string</span> code, <span style="color:#f472b6">string</span> desc)
        => <span style="color:#f472b6">new</span>(<span style="color:#fbbf24">ErrorType</span>.Failure, code, desc);

    <span style="color:#f472b6">public static</span> <span style="color:#fb7185">Error</span> NotFound(<span style="color:#f472b6">string</span> code, <span style="color:#f472b6">string</span> desc)
        => <span style="color:#f472b6">new</span>(<span style="color:#fbbf24">ErrorType</span>.NotFound, code, desc);

    <span style="color:#f472b6">public static</span> <span style="color:#fb7185">Error</span> Validation(<span style="color:#f472b6">string</span> code, <span style="color:#f472b6">string</span> desc)
        => <span style="color:#f472b6">new</span>(<span style="color:#fbbf24">ErrorType</span>.Validation, code, desc);

    <span style="color:#f472b6">public static</span> <span style="color:#fb7185">Error</span> Conflict(<span style="color:#f472b6">string</span> code, <span style="color:#f472b6">string</span> desc)
        => <span style="color:#f472b6">new</span>(<span style="color:#fbbf24">ErrorType</span>.Conflict, code, desc);

    <span style="color:#f472b6">public static</span> <span style="color:#fb7185">Error</span> Unauthorized(<span style="color:#f472b6">string</span> code, <span style="color:#f472b6">string</span> desc)
        => <span style="color:#f472b6">new</span>(<span style="color:#fbbf24">ErrorType</span>.Unauthorized, code, desc);

    <span style="color:#6b7280">// Sentinel for non-error state</span>
    <span style="color:#f472b6">public static readonly</span> <span style="color:#fb7185">Error</span> None
        = <span style="color:#f472b6">new</span>(<span style="color:#fbbf24">ErrorType</span>.None, <span style="color:#34d399">string.Empty</span>, <span style="color:#34d399">string.Empty</span>);
}

<span style="color:#f472b6">public enum</span> <span style="color:#fbbf24">ErrorType</span>
{
    None, Failure, NotFound, Validation, Conflict, Unauthorized
}`;

const resultCode = `<span style="color:#6b7280">// Domain/Common/Result.cs — the Result type</span>

<span style="color:#f472b6">public class</span> <span style="color:#34d399">Result</span>
{
    <span style="color:#f472b6">protected</span> Result(<span style="color:#f472b6">bool</span> isSuccess, <span style="color:#fb7185">Error</span> error)
    {
        <span style="color:#f472b6">if</span> (isSuccess && error != <span style="color:#fb7185">Error</span>.None)
            <span style="color:#f472b6">throw new</span> InvalidOperationException();
        <span style="color:#f472b6">if</span> (!isSuccess && error == <span style="color:#fb7185">Error</span>.None)
            <span style="color:#f472b6">throw new</span> InvalidOperationException();
        IsSuccess = isSuccess;
        Error = error;
    }

    <span style="color:#f472b6">public bool</span> IsSuccess { <span style="color:#f472b6">get</span>; }
    <span style="color:#f472b6">public bool</span> IsFailure => !IsSuccess;
    <span style="color:#f472b6">public</span> <span style="color:#fb7185">Error</span> Error { <span style="color:#f472b6">get</span>; }

    <span style="color:#f472b6">public static</span> <span style="color:#34d399">Result</span> Success()
        => <span style="color:#f472b6">new</span>(<span style="color:#f472b6">true</span>, <span style="color:#fb7185">Error</span>.None);
    <span style="color:#f472b6">public static</span> <span style="color:#34d399">Result</span> Failure(<span style="color:#fb7185">Error</span> error)
        => <span style="color:#f472b6">new</span>(<span style="color:#f472b6">false</span>, error);
    <span style="color:#f472b6">public static</span> <span style="color:#34d399">Result</span>&lt;TValue&gt; Success&lt;TValue&gt;(TValue value)
        => <span style="color:#f472b6">new</span>(value, <span style="color:#f472b6">true</span>, <span style="color:#fb7185">Error</span>.None);
    <span style="color:#f472b6">public static</span> <span style="color:#34d399">Result</span>&lt;TValue&gt; Failure&lt;TValue&gt;(<span style="color:#fb7185">Error</span> error)
        => <span style="color:#f472b6">new</span>(<span style="color:#f472b6">default</span>!, <span style="color:#f472b6">false</span>, error);
}

<span style="color:#f472b6">public class</span> <span style="color:#34d399">Result</span>&lt;TValue&gt; : <span style="color:#34d399">Result</span>
{
    <span style="color:#f472b6">private readonly</span> TValue? _value;

    <span style="color:#f472b6">protected internal</span> Result(TValue? value, <span style="color:#f472b6">bool</span> isSuccess, <span style="color:#fb7185">Error</span> error)
        : <span style="color:#f472b6">base</span>(isSuccess, error) => _value = value;

    <span style="color:#6b7280">// Guard: can only read Value when successful</span>
    <span style="color:#f472b6">public</span> TValue Value => IsSuccess
        ? _value!
        : <span style="color:#f472b6">throw new</span> InvalidOperationException(<span style="color:#34d399">"Failure result has no value."</span>);

    <span style="color:#6b7280">// Implicit conversion: Order → Result&lt;Order&gt; (sugar!)</span>
    <span style="color:#f472b6">public static implicit operator</span> <span style="color:#34d399">Result</span>&lt;TValue&gt;(TValue value)
        => <span style="color:#34d399">Result</span>.Success(value);
    <span style="color:#f472b6">public static implicit operator</span> <span style="color:#34d399">Result</span>&lt;TValue&gt;(<span style="color:#fb7185">Error</span> error)
        => <span style="color:#34d399">Result</span>.Failure&lt;TValue&gt;(error);
}`;

export default function ResultType() {
  return (
    <Wrap pad="78px 54px 28px">
      <motion.div variants={stagger} initial="hidden" animate="show">
        <Head
          tag="🔨 The Implementation"
          title={<>Building Result&lt;T&gt; from scratch</>}
          sub="Two files. An Error record that captures what went wrong. A Result<T> class that is either a value or an Error. Immutable, safe, and impossible to misuse."
          color={C.amber}
        />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
          <motion.div variants={fadeUp} style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <Code src={errorCode} label="Error.cs + ErrorType.cs" color={C.rose}/>
            <div style={{ padding:"12px 16px", borderRadius:10, background:"rgba(251,191,36,0.06)", border:"1px dashed rgba(251,191,36,0.25)" }}>
              <div style={{ color:C.amber, fontWeight:700, fontSize:12, marginBottom:6 }}>📁 Project location</div>
              <div style={{ color:C.muted, fontSize:11, lineHeight:1.8 }}>
                <code style={{color:C.slate}}>Domain/Common/Error.cs</code><br/>
                <code style={{color:C.slate}}>Domain/Common/ErrorType.cs</code><br/>
                <code style={{color:C.slate}}>Domain/Common/Result.cs</code><br/>
                <code style={{color:C.slate}}>Domain/Common/Result&lt;T&gt;.cs</code>
              </div>
              <div style={{ marginTop:8, color:"rgba(255,255,255,0.3)", fontSize:11 }}>
                Tip: keep in Domain so every layer can reference Result without circular deps
              </div>
            </div>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Code src={resultCode} label="Result.cs + Result&lt;TValue&gt;.cs" color={C.emerald}/>
          </motion.div>
        </div>
      </motion.div>
    </Wrap>
  );
}
