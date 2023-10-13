import { test, expect, spyOn, mock, describe } from 'bun:test'
import * as allFaker from '@faker-js/faker'
import Handlebars from 'handlebars'
import './faker'

// @ts-ignore
spyOn(allFaker, () => {
  return {
    Faker: mock(() => {
      return {
        string: {
          alpha: () => 'string.alpha',
          word: (count: number): string => `string.word ${count}`
        },
        commerce: {
          price: ({ min, max }: { min: number, max: number }): string => `commerce.price min ${min} max ${max}`
        }
      }
    })
  }
})

describe.skip('faker', () => {

  test('faker', () => {
    const result = Handlebars.compile("{{faker 'string.alpha' 20}}")({})
    expect(result).toEqual(`[Function]`)
  })

  test('hash parameter passed to faker function', () => {
    const result = Handlebars.compile("{{faker 'commerce.price' min=20 max=50}}")(
      {}
    )
    expect(result).toEqual(`"commerce.price min 20 max 50"`)
  })

  test('single parameter passed to faker function', () => {
    const result = Handlebars.compile("{{faker 'string.word' 20}}")({})
    expect(result).toEqual(`string.word 20`)
  })

})
