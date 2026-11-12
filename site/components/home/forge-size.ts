/**
 * The narrowest width the drawn Forge windows are laid out at. Wider columns let them grow; narrower ones
 * (phones) scale the whole window down to fit, like a product screenshot, instead of cropping or scrolling it.
 * Shared by ForgeWindows (server) and ForgeTour (client), so it lives in its own module.
 */
export const FORGE_WINDOW_W = 640;
