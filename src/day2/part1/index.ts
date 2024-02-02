import { Chunk, Effect, Number as EffectNumber } from 'effect'
import { InputProvider } from '../../common/index.js'
import { Game, MAX_BLUE, MAX_GREEN, MAX_RED, Round } from '../domain.js'

export const parseGameLine = (
  line: string
): Effect.Effect<never, string, Game> => {
  const [rawId, rawRounds] = line.split(': ')
  const id = Number(rawId.split(' ')[1])

  const maxCounts = rawRounds.split('; ').reduce(
    (acc, round) => {
      const colors = round.split(', ')
      return colors.reduce((acc, color) => {
        if (color.includes('red')) {
          return [
            Math.max(acc[0], Number(color.split(' ')[0])),
            acc[1],
            acc[2],
          ] as Round
        } else if (color.includes('green')) {
          return [
            acc[0],
            Math.max(acc[1], Number(color.split(' ')[0])),
            acc[2],
          ] as Round
        } else {
          return [
            acc[0],
            acc[1],
            Math.max(acc[2], Number(color.split(' ')[0])),
          ] as Round
        }
      }, acc)
    },
    [0, 0, 0] as Round
  )

  if (!Number.isInteger(id)) {
    return Effect.fail('Invalid game ID')
  }

  if (
    maxCounts.length !== 3 ||
    maxCounts.some(value => !Number.isInteger(value))
  ) {
    return Effect.fail('Invalid round')
  }

  return Effect.succeed({ id, maxCounts })
}

const filterGame = (game: Game): boolean => {
  const [red, green, blue] = game.maxCounts
  return red <= MAX_RED && green <= MAX_GREEN && blue <= MAX_BLUE
}

export const program = InputProvider.pipe(
  Effect.flatMap(inputProvider =>
    inputProvider.get(new URL('input.txt', import.meta.url))
  ),
  Effect.map(lines => lines.map(parseGameLine)),
  Effect.flatMap(Effect.all),
  Effect.map(games =>
    Chunk.fromIterable(games).pipe(
      Chunk.filter(filterGame),
      Chunk.map(game => game.id),
      EffectNumber.sumAll
    )
  )
)
