import confetti from 'canvas-confetti'

const BRAND_COLORS = ['#38bdf8', '#0ea5e9', '#a855f7', '#8b5cf6', '#c084fc']

// A small burst for a single task completion.
export function celebrateTask() {
  confetti({
    particleCount: 60,
    spread: 60,
    startVelocity: 35,
    origin: { y: 0.7 },
    colors: BRAND_COLORS,
    scalar: 0.9,
  })
}

// A bigger, fuller celebration when the whole daily goal is complete.
export function celebrateGoal() {
  const end = Date.now() + 800
  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.8 },
      colors: BRAND_COLORS,
    })
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.8 },
      colors: BRAND_COLORS,
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}
