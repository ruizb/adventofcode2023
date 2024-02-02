import { Chunk, Effect, Number as EffectNumber } from 'effect'
import { InputProvider } from '../../common/index.js'
import { parseGameLine } from '../part1/index.js'

export const program = InputProvider.pipe(
  Effect.flatMap(inputProvider =>
    inputProvider.get(new URL('../part1/input.txt', import.meta.url))
  ),
  Effect.map(lines => lines.map(parseGameLine)),
  Effect.flatMap(Effect.all),
  Effect.map(games =>
    Chunk.fromIterable(games).pipe(
      Chunk.map(game => EffectNumber.multiplyAll(game.maxCounts)),
      EffectNumber.sumAll
    )
  )
)
