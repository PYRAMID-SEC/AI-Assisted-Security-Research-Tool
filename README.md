# AI-Assisted Security Research Tool

A small Next.js web application for analyzing HTTP requests, HTTP responses, source-code snippets, and vulnerability notes with local pattern-based checks.

The tool only analyzes information you provide. It does not scan, attack, or automatically exploit targets.

## Requirements

- Node.js 20 or newer

## Install

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Example input

```http
GET /account/profile HTTP/1.1
Host: example.test
Cookie: session=abc123

Response:
HTTP/1.1 200 OK
Content-Type: application/json

{"email":"researcher@example.test","role":"user"}
```

## Example output

```json
{
  "potentialSecurityIssue": "Review authorization controls and object-level access checks.",
  "reasoning": "The supplied text contains security-relevant terms or patterns: Review authorization controls and object-level access checks.",
  "whatToTest": "Using an authorized test account, verify that changing the requested account identifier cannot return another user's data.",
  "potentialImpact": "If authorization is missing, another user could access private profile information.",
  "suggestedNextSteps": "Review server-side authorization checks and compare responses for accounts the tester is permitted to use."
}
```
