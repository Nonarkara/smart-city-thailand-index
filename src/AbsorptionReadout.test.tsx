import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import AbsorptionReadout from "./AbsorptionReadout";
import { allCities } from "./cityData";
afterEach(cleanup);
it("shows separate demand observations without a false population or electricity restatement",()=>{
  render(<AbsorptionReadout city={allCities[0]} locale="en"/>);
  expect(screen.getByText(/not a simultaneous daytime population/)).toBeTruthy();
  expect(screen.queryByText(/people actually present/)).toBeNull();
  expect(screen.queryByText(/kWh/)).toBeNull();
  expect(screen.queryByText(/no plan has accounted/)).toBeNull();
});
