import { test, expect } from 'bun:test'
import Handlebars from 'handlebars'
import './get'

test('get helper', () => {
  const result = Handlebars.compile(`{{get path="person.firstName" context=profile }}`)({
    profile: { person: { firstName: 'John' } }
  })
  expect(result).toEqual(`John`)
})

test('get helper default value', () => {
  const result = Handlebars.compile(
    `{{get path="person.lastName" default="no-body" context=profile}}`
  )({
    profile: { person: { firstName: 'John' } }
  })
  expect(result).toEqual(`no-body`)
})

test('get helper No default value', () => {
  const result = Handlebars.compile(`{{get path="person.lastName" context=profile}}`)({
    profile: { person: { firstName: 'John' } }
  })
  expect(result).toEqual(``)
})
