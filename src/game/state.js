const initialState = {
  isRunning: false,
  score: 0,
  balls: 3,
  currentPlayer: null,
  multiplier: 1,
  combo: 0,
  lastHitAt: null
}

let state = { ...initialState }

export const getState = () => state

export const resetState = () => {
  state = { ...initialState }
}

export const startGame = (playerName) => {
  state = {
    ...initialState,
    isRunning: true,
    currentPlayer: playerName
  }
  return state
}

export const registerHit = (points) => {
  if (!state.isRunning) return state
  const now = Date.now()
  const comboWindow = 2000
  
  if (now - state.lastHitAt < comboWindow) {
    state.combo += 1
  } else {
    state.combo = 1
  }

  state.lastHitAt = now
  state.multiplier = Math.min(state.combo, 5)
  state.score += points * state.multiplier

  return state
}

export const losesBall = () => {
  state.balls -= 1
  state.combo = 0
  state.multiplier = 1
  if (state.balls <= 0) {
    state.isRunning = false
  }
  return state
}

export const setMultiplier = (value) => {
  state.multiplier = value
  return state
}