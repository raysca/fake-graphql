import { test, expect } from 'bun:test'

import Handlebars from 'handlebars'
import './repeat'

test('repeat helper', () => {
  const result = Handlebars.compile('{{#repeat 3}}true{{/repeat}}')({})
  expect(result).toEqual(`true,true,true`)
})
