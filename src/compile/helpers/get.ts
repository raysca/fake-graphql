/* eslint-disable */
import Handlebars from 'handlebars'
import objPath from 'object-path'

/**
 * Get a value from an object using its path.
 */
Handlebars.registerHelper('get', function (options) {
  if (!options.hash) {
    throw new Error('Handlebars Helper "get" needs a path')
  }
  const { hash } = options
  if (!hash.path) {
    throw new Error('Handlebars Helper "get" needs a path')
  }

  return objPath.get(hash.context ?? options.data.root ?? {}, hash.path, hash.default)
})
