export const MAX_RED = 12
export const MAX_GREEN = 13
export const MAX_BLUE = 14

export type Round = readonly [red: number, green: number, blue: number]

export interface Game {
  readonly id: number
  readonly maxCounts: Round
}
