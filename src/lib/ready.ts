/**
 * Resolves once everything below the desk has mounted and ScrollTrigger has measured it.
 * The intro waits for this before its camera move, so the heavy one-off work (building the
 * sections, measuring the pins) happens while the "Hey, it's Vartika." screen is still,
 * never during an animation.
 */
let resolve: () => void = () => {};
export const restReady = new Promise<void>((r) => (resolve = r));
export const markRestReady = () => resolve();
