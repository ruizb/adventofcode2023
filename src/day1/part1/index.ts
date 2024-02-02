import { Chunk, Effect, Number, Option, Tuple, pipe } from 'effect'
import { InputProvider } from '../../common/index.js'

export const isDigitChar = (char: string): boolean => {
  return char >= '0' && char <= '9'
}

const findFirstDigit = (
  line: Chunk.Chunk<string>
): Effect.Effect<never, string, string> => {
  return Chunk.findFirst(line, isDigitChar).pipe(
    Option.match({
      onNone: () => Effect.fail('No digit found'),
      onSome: Effect.succeed,
    })
  )
}

const parseTwoDigits = (lines: string[]) => {
  return Chunk.fromIterable(lines).pipe(
    Chunk.map(line =>
      pipe(
        Chunk.fromIterable(line),
        chunk => Tuple.make(chunk, chunk),
        Tuple.mapBoth({
          onFirst: findFirstDigit,
          onSecond: line => Chunk.reverse(line).pipe(findFirstDigit),
        }),
        Effect.all,
        Effect.map(([first, last]) => parseInt(first + last, 10))
      )
    )
  )
}

export const program = InputProvider.pipe(
  Effect.flatMap(inputProvider =>
    inputProvider.get(new URL('input.txt', import.meta.url))
  ),
  Effect.map(parseTwoDigits),
  Effect.flatMap(Effect.all),
  Effect.map(Number.sumAll)
)
