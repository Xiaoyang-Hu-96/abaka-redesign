/** Duration tokens are strings ("120ms"); timers need numbers. */
export const ms = (token: string) => parseFloat(token);
