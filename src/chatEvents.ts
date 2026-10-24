/**
 * The event the navigation uses to open the assistant.
 *
 * It lives in its own module so the navigation can dispatch it without
 * importing the lazily-loaded chat component — importing GeminiChat for
 * one constant would pull the whole chat bundle into the entry chunk.
 */
export const OPEN_CHAT_EVENT = "sciti:open-chat";

/** Open the assistant from anywhere in the shell. */
export function openChat(): void {
  window.dispatchEvent(new CustomEvent(OPEN_CHAT_EVENT));
}
