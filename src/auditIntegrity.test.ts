import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { createElement } from "react";
import { buildAuditReleaseSummary } from "./auditData";
import AuditPage from "./AuditPage";

describe("jury evidence walk-through", () => {
  it("derives scope and confidence counts from the release instead of display constants", () => {
    const audit = buildAuditReleaseSummary();

    expect(audit.cities).toHaveLength(118);
    expect(audit.status.certified + audit.status.promotion + audit.status.registered).toBe(audit.cities.length);
    expect(audit.confidence.high + audit.confidence.medium + audit.confidence.low).toBe(audit.cities.length);
    expect(audit.fullDossiers + audit.registeredOnly).toBe(audit.cities.length);
  });

  it("keeps every exported baseline row linked to a source institution", () => {
    const audit = buildAuditReleaseSummary();

    expect(audit.metricRows).toBeGreaterThan(0);
    expect(audit.sourceLinkedMetricRows).toBe(audit.metricRows);
  });

  it("reproduces the published example composite from its seven weighted terms", () => {
    const audit = buildAuditReleaseSummary();
    const contributionTotal = audit.breakdown.terms.reduce((sum, term) => sum + term.contribution, 0);

    expect(audit.breakdown.terms).toHaveLength(7);
    expect(audit.breakdown.totalWeight).toBe(100);
    expect(audit.breakdown.composite).toBe(audit.example.compositeScore);
    expect(audit.breakdown.composite).toBeCloseTo(contributionTotal, 1);
  });

  it("shows only source-linked official claims in the verified strip", () => {
    const audit = buildAuditReleaseSummary();

    expect(audit.verifiedClaims.length).toBeGreaterThan(0);
    audit.verifiedClaims.forEach(claim => {
      expect(claim.confidence).toBe("verified");
      expect(claim.sourceUrl).toMatch(/^https:\/\//);
    });
  });

  it("reports Needs Ladder coverage as an overlay that never pads missing traffic", () => {
    const audit = buildAuditReleaseSummary();

    expect(audit.needsLadder.rungs).toBe(8);
    expect(audit.needsLadder.dossierCities).toBe(audit.fullDossiers);
    expect(audit.needsLadder.meanCoverage).toBeGreaterThan(0);
    expect(audit.needsLadder.meanCoverage).toBeLessThanOrEqual(8);
    expect(audit.needsLadder.meanObservedCoverage).toBeGreaterThan(0);
    expect(audit.needsLadder.meanObservedCoverage).toBeLessThanOrEqual(audit.needsLadder.meanCoverage);
    expect(audit.needsLadder.sourceEndpoints).toBeGreaterThan(0);
    expect(audit.needsLadder.calmTrafficBacked).toBeGreaterThan(0);
    expect(audit.needsLadder.calmTrafficBacked).toBeLessThan(audit.needsLadder.dossierCities);
  });

  it("renders the jury route without the former simulated audit verdicts", async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();
    render(createElement(AuditPage, { locale: "en", onNavigate }));

    expect(screen.getByRole("heading", { name: "Follow the evidence, not the pitch." })).toBeInTheDocument();
    expect(screen.queryByText("System integrity compromised.")).not.toBeInTheDocument();
    expect(screen.queryByText("68%")).not.toBeInTheDocument();
    expect(screen.getByText("Needs Ladder")).toBeInTheDocument();
    expect(screen.getByText("OVERLAY")).toBeInTheDocument();

    const rankingButton = screen.getByRole("button", { name: /Test the ranking/ });
    await user.click(rankingButton);
    expect(onNavigate).toHaveBeenCalledWith("/rankings");
  });
});
