import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import DossierTabs from "./DossierTabs";

afterEach(cleanup);

/**
 * The contract changed on purpose. The panels used to be mounted by a
 * `beforeprint` handler, and Chromium's print-to-PDF snapshot then landed
 * before the freshly mounted DOM had painted — 11 of 24 pages came out
 * blank. The panels now live in the DOM from the start and the print
 * stylesheet reveals them, so the test asserts THAT: everything present,
 * one panel active on screen.
 */
it("keeps every panel in the DOM and marks exactly one active", () => {
  render(
    <DossierTabs locale="en" labels={["Overview", "Evidence"]}>
      {[<p key="a">Overview content</p>, <p key="b">Evidence content</p>]}
    </DossierTabs>,
  );
  const slots = document.querySelectorAll(".dossier-panel-slot");
  expect(slots).toHaveLength(2);
  expect(screen.getByText("Overview content")).toBeTruthy();
  expect(screen.getByText("Evidence content")).toBeTruthy();
  expect(slots[0].getAttribute("data-active")).toBe("true");
  expect(slots[1].getAttribute("data-active")).toBe("false");
});

it("names each panel after its tab, so a printed page says what it is", () => {
  render(
    <DossierTabs locale="en" labels={["Overview", "Evidence"]}>
      {[<p key="a">Overview content</p>, <p key="b">Evidence content</p>]}
    </DossierTabs>,
  );
  const headings = [...document.querySelectorAll(".dossier-panel-heading")].map(h => h.textContent);
  expect(headings).toEqual(["Overview", "Evidence"]);
});

it("moves the active mark when another tab is chosen", () => {
  render(
    <DossierTabs locale="en" labels={["Overview", "Evidence"]}>
      {[<p key="a">Overview content</p>, <p key="b">Evidence content</p>]}
    </DossierTabs>,
  );
  fireEvent.click(screen.getByRole("tab", { name: "Evidence" }));
  const slots = document.querySelectorAll(".dossier-panel-slot");
  expect(slots[0].getAttribute("data-active")).toBe("false");
  expect(slots[1].getAttribute("data-active")).toBe("true");
});

it("supports arrow-key navigation with focus following the selected tab",()=>{
  render(<DossierTabs locale="en" labels={["Overview","Evidence"]}>{[<p key="a">A</p>,<p key="b">B</p>]}</DossierTabs>);
  fireEvent.keyDown(screen.getByRole("tab",{name:"Overview"}),{key:"ArrowRight"});
  expect(screen.getByRole("tab",{name:"Evidence"})).toHaveAttribute("aria-selected","true");
  expect(screen.getByRole("tab",{name:"Evidence"})).toHaveFocus();
});
