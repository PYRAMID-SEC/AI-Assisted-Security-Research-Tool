import { NextResponse } from "next/server";

function analyzeLocally(text: string) {
  const findings: string[] = [];
  const lowerText = text.toLowerCase();

  if (/authorization|access-control|role|admin|user_id|account_id/.test(lowerText)) {
    findings.push("Review authorization controls and object-level access checks.");
  }
  if (/password|token|secret|api[_-]?key|cookie|session/.test(lowerText)) {
    findings.push("Review how credentials, tokens, and session data are protected.");
  }
  if (/select |insert |update |delete |union |sql/.test(lowerText)) {
    findings.push("Review database input handling for injection risks.");
  }
  if (/<script|javascript:|innerhtml|eval\(/.test(lowerText)) {
    findings.push("Review output encoding and client-side input handling for script injection.");
  }
  if (/access-control-allow-origin:\s*\*/.test(lowerText)) {
    findings.push("Review whether the permissive CORS policy is appropriate for this resource.");
  }

  const issue = findings.length
    ? findings.join(" ")
    : "No obvious issue was identified by the local pattern checks.";

  return {
    potentialSecurityIssue: issue,
    reasoning: findings.length
      ? `The supplied text contains security-relevant terms or patterns: ${findings.join(" ")}`
      : "The local analyzer found no matching patterns in the supplied text. This is not proof that the information is secure.",
    whatToTest: "Using only authorized test data, verify authentication, authorization, input validation, output encoding, and security-header behavior relevant to the supplied evidence.",
    potentialImpact: findings.length
      ? "The impact depends on whether the observed behavior can be reached by an unauthorized user or with attacker-controlled input."
      : "No impact can be inferred from the supplied text alone.",
    suggestedNextSteps: "Review the relevant server-side code and compare expected behavior with responses from permitted test accounts. Treat these results as triage guidance, not a confirmed vulnerability.",
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { text?: unknown };

    if (typeof body.text !== "string" || !body.text.trim()) {
      return NextResponse.json(
        { error: "Please provide HTTP traffic, source code, or security notes to analyze." },
        { status: 400 },
      );
    }

    return NextResponse.json(analyzeLocally(body.text.trim()));
  } catch (error) {
    console.error("Analysis request failed", error);
    return NextResponse.json(
      { error: "The analysis could not be completed. Check the server logs and try again." },
      { status: 500 },
    );
  }
}
