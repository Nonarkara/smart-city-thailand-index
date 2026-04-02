import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PartnershipsPage from "./PartnershipsPage";
import ShowcasePage from "./ShowcasePage";
import StoryPage from "./StoryPage";
import WhyPage from "./WhyPage";

describe("content page mechanics", () => {
  it("routes out of the story page through its primary CTA", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<StoryPage locale="en" onNavigate={onNavigate} />);

    expect(screen.getByRole("heading", { name: /from sensors.*to citizens/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "See the rankings" }));
    expect(onNavigate).toHaveBeenCalledWith("/rankings");
  });

  it("routes from the why page back into rankings", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<WhyPage locale="en" onNavigate={onNavigate} />);

    expect(screen.getByRole("heading", { name: /who benefits,.*and how/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Explore the rankings" }));
    expect(onNavigate).toHaveBeenCalledWith("/rankings");
  });

  it("routes from the showcase page into the city profile", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<ShowcasePage locale="en" onNavigate={onNavigate} />);

    expect(screen.getByRole("heading", { name: /nakhon si thammarat:.*the city that listened/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "View city profile" }));
    expect(onNavigate).toHaveBeenCalledWith("/city/nakhon-si-thammarat");
  });

  it("routes from the partnerships page back into rankings", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<PartnershipsPage locale="en" onNavigate={onNavigate} />);

    expect(screen.getByRole("heading", { name: /5 countries, 4 statuses:.*who actually delivered/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "See the city rankings" }));
    expect(onNavigate).toHaveBeenCalledWith("/rankings");
  });
});
