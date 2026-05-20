# Operation Result Pattern — .NET Visual Presentation

Interactive animated React + Framer Motion deep-dive into the Result pattern.

## 🚀 Quick Start
```bash
npm install
npm run dev
```
Open http://localhost:5173

## 🎮 Navigation
← → arrow keys · side arrow buttons · dot bar at top

## 📋 Slides (13 total)

| # | Slide | What It Covers |
|---|-------|----------------|
| 1 | Hero | Pattern overview, success/failure badges |
| 2 | The Problem | Exceptions as control flow — the antipattern |
| 3 | What Is Result | Discriminated union concept, 3 analogies |
| 4 | Result<T> Type | Building Error.cs + Result.cs from scratch |
| 5 | Error Types | ErrorType enum → HTTP status mapping |
| 6 | Creating Results | Handlers + domain returning Results, implicit operators |
| 7 | Match & Unwrap | Match(), Tap(), guard patterns |
| 8 | Chaining | Map, Bind, BindAsync — Railway Oriented Programming |
| 9 | MediatR + Result | IRequest<Result<T>>, ValidationBehavior with Result |
| 10 | API Translation | ErrorType → HTTP, error.ToProblem(), RFC 7807 |
| 11 | Validation + Result | ValidationResult<T>, collecting all errors |
| 12 | Full Example | Animated 8-step end-to-end walkthrough |
| 13 | Summary | Cheat sheet, exception vs result, quick reference |

## 🛠 Stack
- React 18 + Vite 5
- Framer Motion
- Space Grotesk + Bricolage Grotesque + Fira Code
