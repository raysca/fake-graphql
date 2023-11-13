import fs from 'node:fs'
import { handler } from './graphql'
import { registerFilePartials, watchPartials } from '../compile/partials'

jest.mock('node:fs')
jest.mock('../compile/partials')

const fsExistSync = fs.existsSync as jest.Mock
const fsReadFileSync = fs.readFileSync as jest.Mock

const handlerParams = {
    dir: 'dir',
    port: 8080,
    schema: 'schema.graphql',
    endpoint: '/api/graphql'
}

describe('graphql', () => {

    describe('handler', () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })

        it('should create a schema file if it does not exist', async () => {
            fsExistSync.mockReturnValueOnce(false)
            fsReadFileSync.mockReturnValueOnce(`type Query { hello: String! }`)
            await handler(handlerParams)
            expect(fs.writeFileSync).toHaveBeenCalledWith('schema.graphql', 
            `
                type Query {
                    hello: String!
                }
            `)
        })

        it('should throw an error if the directory does not exist', async () => {
            fsExistSync.mockReturnValueOnce(true)
            fsExistSync.mockReturnValueOnce(false)
            await expect(handler(handlerParams)).rejects.toThrow('Directory dir does not exist')
        })

        it('should register partials', async () => {
            fsExistSync.mockReturnValueOnce(true)
            fsExistSync.mockReturnValueOnce(true)
            fsReadFileSync.mockReturnValueOnce(`type Query { hello: String! }`)
            await handler(handlerParams)
            expect(registerFilePartials).toHaveBeenCalledWith('dir')
        })

        it('should watch partials', async () => {
            fsExistSync.mockReturnValueOnce(true)
            fsExistSync.mockReturnValueOnce(true)
            fsReadFileSync.mockReturnValueOnce(`type Query { hello: String! }`)
            await handler(handlerParams)
            expect(watchPartials).toHaveBeenCalledWith('dir')
        })
    })

})