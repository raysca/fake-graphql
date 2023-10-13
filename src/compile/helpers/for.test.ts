import { test, expect } from 'bun:test'
import Handlebars from 'handlebars'
import './for'

test('for helper', () => {
  const result = Handlebars.compile('{{#for 0 3}}true{{/for}}')({})
  expect(result).toEqual(`truetruetruetrue`)
})
