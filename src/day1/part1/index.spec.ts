import { describe, expect, it } from 'vitest'
import { program } from './index.js'
import { Effect } from 'effect'
import { InputProvider } from '../../common/index.js'

describe('Day 1 part 1', () => {
  it('should solve example puzzle', () => {
    const runnable = Effect.provideService(
      program,
      InputProvider,
      InputProvider.of({
        get: () =>
          Effect.succeed(['1abc2', 'pqr3stu8vwx', 'a1b2c3d4e5f', 'treb7uchet']),
      })
    )

    expect(Effect.runSync(runnable)).toEqual(142)
  })

  it('should detect when a line is missing a digit', () => {
    const runnable = Effect.provideService(
      program,
      InputProvider,
      InputProvider.of({
        get: () => Effect.succeed(['1abc2', 'abcdef', 'treb7uchet']),
      })
    )

    expect(() => Effect.runSync(runnable)).toThrow('No digit found')
  })
})
