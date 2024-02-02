import { describe, expect, it } from 'vitest'
import { program } from './index.js'
import { Effect } from 'effect'
import { InputProvider } from '../../common/index.js'

describe('Day 1 part 2', () => {
  it('should solve example puzzle', () => {
    const runnable = Effect.provideService(
      program,
      InputProvider,
      InputProvider.of({
        get: () =>
          Effect.succeed([
            'two1nine',
            'eightwothree',
            'abcone2threexyz',
            'xtwone3four',
            '4nineeightseven2',
            'zoneight234',
            '7pqrstsixteen',
          ]),
      })
    )

    expect(Effect.runSync(runnable)).toEqual(281)
  })

  it('should detect when a line is missing a digit', () => {
    const runnable = Effect.provideService(
      program,
      InputProvider,
      InputProvider.of({
        get: () => Effect.succeed(['oneight', 'abcfouldef', '1twotree']),
      })
    )

    expect(() => Effect.runSync(runnable)).toThrow('No digit found')
  })
})
