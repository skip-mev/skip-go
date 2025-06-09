export const ANIMATION_TIMINGS = {
  fast: "70ms",
  medium: "250ms",
  slow: "500ms",
  extraSlow: "800ms",
} as const;

export const EASINGS = {
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
} as const;

export const transition = (
  properties: string[] = ["all"],
  duration: keyof typeof ANIMATION_TIMINGS = "medium",
  easing: keyof typeof EASINGS = "easeInOut",
) => `
  transition: ${properties.join(", ")} ${ANIMATION_TIMINGS[duration]} ${EASINGS[easing]};
`;
