import { describe, it, expect, mock, beforeAll } from "bun:test";
import { handler } from './rest'

const matchFn = mock(() => {
    return {
        params: { foo: 'bar' },
        filePath: 'mocks/foo.json'
    }
})


// @ts-ignore
Bun.FileSystemRouter = mock(() => {
    return {
        match: matchFn
    }
})

// @ts-ignore
Bun.file = mock(() => {
    return {
        text: () => {
            return JSON.stringify({
                status: 200,
                body: { foo: 'bar' },
                headers: { 'content-type': 'application/json' }
            })
        }
    }
})


describe('server', () => {

    describe('mocked response', () => {
        let response: Response

        beforeAll(async () => {
            // @ts-ignore
            Bun.serve = mock(async ({ fetch, port }) => {
                response = await fetch(new Request('https://localhost:8080/foo/bar'))
            })
            await handler({ dir: 'mocksDir', port: 8080 })
        })

        it('should serve with params', () => {
            // @ts-ignore
            expect(Bun.serve.mock.calls).toEqual([[{ fetch: expect.any(Function), port: 8080 }]])
        })

        it('generates a response matching mocking content', () => {
            expect(response).toEqual(new Response('{"foo":"bar"}', { status: 200, headers: { 'content-type': 'application/json' } }))
        })
    })

    describe('not found', () => {
        let response: Response
        beforeAll(async () => {
            // @ts-ignore
            Bun.serve = mock(async ({ fetch, port }) => {
                response = await fetch(new Request('https://localhost:8080/foo/bar'))
            })
            await handler({ dir: 'mocksDir', port: 8080 })

            // @ts-ignore
            Bun.FileSystemRouter = mock(() => {
                return {
                    match: () => null
                }
            })
        })

        it('returns a 404', async () => {
            expect(response).toEqual(new Response('Not found', { status: 404 }))
        })
    })

})