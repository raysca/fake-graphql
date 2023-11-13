import fs from 'node:fs'
import request from 'supertest'
import express from 'express'
import { createRouter } from './router'

jest.mock('node:fs')

const fsExistSync = fs.existsSync as jest.Mock
const fsReadFileSync = fs.readFileSync as jest.Mock

describe('createRouter', () => {
    let consoleLogSpy: jest.SpyInstance
    beforeEach(() => {
        jest.clearAllMocks()
        consoleLogSpy = jest.spyOn(console, 'error').mockImplementation();
    })

    afterEach(() => {
        consoleLogSpy.mockRestore();
    });

    it('throws error when the mock file is missing', (done) => {
        fsReadFileSync.mockReturnValueOnce(`type Query { hello: String! }`)

        const router = createRouter({
            mocks: './',
            port: 4000,
            schema: 'schema.graphql',
            endpoint: '/graphql',
            watch: true
        })

        const app = express()
        app.use(router)

        request(app)
            .post('/graphql')
            .send({ query: '{ hello }' })
            .expect(200)
            .end((err) => {
                if (err) return done(err)
                const args = consoleLogSpy.mock.calls[0]
                expect(args.toString()).toContain('No mock definition found for hello in')
                done()
            })
    })

    it('returns the mock file content', (done) => {
        fsExistSync.mockReturnValue(true)
        fsReadFileSync.mockReturnValueOnce(`type Query { hello: String }`)
        fsReadFileSync.mockReturnValue(JSON.stringify('world'))

        const router = createRouter({
            mocks: './',
            port: 4000,
            schema: 'schema.graphql',
            endpoint: '/graphql',
            watch: true
        })

        const app = express()
        app.use(router)

        request(app)
            .post('/graphql')
            .send({ query: `{ hello }` })
            .set('Accept', 'application/json')
            .expect(200, {
                data: { hello: 'world'}
            })
            .expect('Content-Type', /json/)
            .end((err) => {
                if (err) return done(err)
                done()
            })
    })

})