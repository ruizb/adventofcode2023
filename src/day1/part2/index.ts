import { Chunk, Effect, Number, Trie, pipe } from 'effect'
import { InputProvider } from '../../common/index.js'

const trie = Trie.empty<number>().pipe(
  Trie.insert('1', 1),
  Trie.insert('2', 2),
  Trie.insert('3', 3),
  Trie.insert('4', 4),
  Trie.insert('5', 5),
  Trie.insert('6', 6),
  Trie.insert('7', 7),
  Trie.insert('8', 8),
  Trie.insert('9', 9),
  Trie.insert('one', 1),
  Trie.insert('two', 2),
  Trie.insert('three', 3),
  Trie.insert('four', 4),
  Trie.insert('five', 5),
  Trie.insert('six', 6),
  Trie.insert('seven', 7),
  Trie.insert('eight', 8),
  Trie.insert('nine', 9)
)

const findDigitsInLine = (line: string): readonly number[] => {
  const loop = (
    cursor: number,
    offset: number,
    foundDigits: readonly number[]
  ): readonly number[] => {
    if (cursor >= line.length) {
      return foundDigits
    }

    const word = line.substring(cursor, cursor + offset + 1)

    if (Trie.has(trie, word)) {
      return loop(cursor + 1, 0, [...foundDigits, Trie.unsafeGet(trie, word)])
    }

    const matchingDigits = [...Trie.keysWithPrefix(trie, word)].length > 0
    if (matchingDigits && offset < line.length - 1) {
      return loop(cursor, offset + 1, foundDigits)
    }

    return loop(cursor + 1, 0, foundDigits)
  }

  return loop(0, 0, [])
}

const validateFoundDigits = (
  digits: readonly number[]
): Effect.Effect<never, string, readonly number[]> => {
  if (digits.length > 0) {
    return Effect.succeed(digits)
  }

  return Effect.fail('No digit found')
}

const parseTwoDigits = (lines: string[]) => {
  return Chunk.fromIterable(lines).pipe(
    Chunk.map(line =>
      pipe(
        findDigitsInLine(line),
        validateFoundDigits,
        Effect.map(digits => parseInt(`${digits.at(0)}${digits.at(-1)}`, 10))
      )
    )
  )
}

export const program = InputProvider.pipe(
  Effect.flatMap(inputProvider =>
    inputProvider.get(new URL('./input.txt', import.meta.url))
  ),
  Effect.map(parseTwoDigits),
  Effect.flatMap(Effect.all),
  Effect.map(Number.sumAll)
)
