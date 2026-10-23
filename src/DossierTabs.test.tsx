import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import DossierTabs from "./DossierTabs";
afterEach(cleanup);
it("includes every tab for printing and restores the active screen panel afterward",()=>{
  render(<DossierTabs locale="en" labels={["Overview","Evidence"]}>{[<p key="a">Overview content</p>,<p key="b">Evidence content</p>]}</DossierTabs>);
  expect(screen.queryByText("Evidence content")).toBeNull();
  act(()=>window.dispatchEvent(new Event("beforeprint")));
  expect(screen.getByText("Evidence content")).toBeTruthy();
  expect(screen.getByText("Overview content")).toBeTruthy();
  act(()=>window.dispatchEvent(new Event("afterprint")));
  expect(screen.queryByText("Evidence content")).toBeNull();
});
