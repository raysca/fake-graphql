import Handlebars from 'handlebars'
import './nl'

test('nlbr', () => {
  const result = Handlebars.compile(`
        {
          "message": {{{nlbr "This is a paragraph.\nThis is another paragraph.\nThis is a third paragraph."}}}
        }
    `)({})

  expect(JSON.parse(result).message).toEqual("This is a paragraph\nThis is another paragraph\nThis is a third paragraph.")
})
