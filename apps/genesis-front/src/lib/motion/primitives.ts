export type MotionPrimitive =
  | "fadeIn"
  | "fadeInUp"
  | "revealStagger"
  | "floatSlow"
  | "parallaxY"

export function motionClass(name: MotionPrimitive): string {
  // Classes canônicas (DevTools-legíveis). CSS vive em globals.css.
  return `m-${name}`
}
