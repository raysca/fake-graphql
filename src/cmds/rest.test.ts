import request from 'supertest'
import fs from 'node:fs'
import { handler } from './rest'

jest.mock('node:fs')
jest.spyOn(fs, 'statSync').mockReturnValue({ isDirectory: () => false } as fs.Stats)

const mocks = {
    basic: {
        request: {
            path: '/api/hello',
        },
        response: {
            headers: {
                'content-type': 'application/json'
            },
            body: {
                hello: 'world'
            }
        }
    },
    withStatus: {
        request: {
            path: '/api/hello',
        },
        response: {
            headers: {
                'content-type': 'application/json'
            },
            body: {
                hello: 'world'
            },
            status: 201
        }
    },
    withPriority: [{
        request: {
            path: '/api/hello',
        },
        response: {
            headers: {
                'content-type': 'application/json'
            },
            body: {
                hello: 'world'
            },
        },
        priority: 1
    }, {
        request: {
            path: '/api/hello',
        },
        response: {
            headers: {
                'content-type': 'application/json'
            },
            body: {
                hello: 'world2'
            }
        },
        priority: 2
    }],
    withMethod: {
        request: {
            path: '/api/hello',
            method: 'POST'
        },
        response: {
            headers: {
                'content-type': 'application/json'
            },
            body: {
                hello: 'world'
            }
        }
    },
    withQuery: {
        request: {
            path: '/api/hello',
            query: {
                name: 'world'
            }
        },
        response: {
            headers: {
                'content-type': 'application/json'
            },
            body: {
                hello: '{{context.query.name}}'
            }
        }
    },
    withParams: {
        request: {
            path: '/api/hello/:name',
        },
        response: {
            headers: {
                'content-type': 'application/json'
            },
            body: {
                hello: '{{context.params.name}}'
            }
        }
    },
    withHeader: {
        request: {
            path: '/api/hello',
        },
        response: {
            headers: {
                'content-type': 'application/json',
                'x-test': 'hello'
            },
            body: {
                hello: 'world'
            }
        }
    },
    withNotFound: {
        request: {
            path: '/api/hello',
        },
        response: {
            headers: {
                'content-type': 'application/json'
            },
            body: {
                hello: 'world'
            }
        }
    }
}

describe('Rest', () => {
    describe('Error', () => {
        it('should throw an error if the directory does not exist', async () => {
            jest.spyOn(fs, 'existsSync').mockReturnValueOnce(false)
            await expect(handler({ dir: 'mocks', port: 8080 })).rejects.toThrow('mocks directory mocks does not exist')
        })
    })

    describe('Success', () => {
        it('should serve basic files from the directory', async () => {
            jest.spyOn(fs, 'existsSync').mockReturnValueOnce(true)
            // @ts-expect-error misc type mismatch
            jest.spyOn(fs, 'readdirSync').mockReturnValueOnce(['mock.json'])
            jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(JSON.stringify(mocks.basic))
            const app = await handler({ dir: 'mocks', port: 8080 })
            await request(app).get('/api/hello').expect(200, { hello: 'world' })
        })

        it('should serve files from the directory with a priority', async () => {
            jest.spyOn(fs, 'existsSync').mockReturnValueOnce(true)
            // @ts-expect-error misc type mismatch
            jest.spyOn(fs, 'readdirSync').mockReturnValueOnce(['mock.json'])
            jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(JSON.stringify(mocks.withPriority))
            const app = await handler({ dir: 'mocks', port: 8080 })
            await request(app).get('/api/hello').expect(200, { hello: 'world2' })
        })

        it('should serve files from the directory with a status', async () => {
            jest.spyOn(fs, 'existsSync').mockReturnValueOnce(true)
            // @ts-expect-error misc type mismatch
            jest.spyOn(fs, 'readdirSync').mockReturnValueOnce(['mock.json'])
            jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(JSON.stringify(mocks.withStatus))
            const app = await handler({ dir: 'mocks', port: 8080 })
            await request(app).get('/api/hello').expect(201, { hello: 'world' })
        })

        it('should serve files from the directory with a method', async () => {
            jest.spyOn(fs, 'existsSync').mockReturnValueOnce(true)
            // @ts-expect-error misc type mismatch
            jest.spyOn(fs, 'readdirSync').mockReturnValueOnce(['mock.json'])
            jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(JSON.stringify(mocks.withMethod))
            const app = await handler({ dir: 'mocks', port: 8080 })
            await request(app).post('/api/hello').expect(200, { hello: 'world' })
        })

        it('should serve files from the directory with a query', async () => {
            jest.spyOn(fs, 'existsSync').mockReturnValueOnce(true)
            // @ts-expect-error misc type mismatch
            jest.spyOn(fs, 'readdirSync').mockReturnValueOnce(['mock.json'])
            jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(JSON.stringify(mocks.withQuery))
            const app = await handler({ dir: 'mocks', port: 8080 })
            await request(app).get('/api/hello?name=world').expect(200, { hello: 'world' })
        })

        it.skip('should serve files from the directory with a params', async () => {
            jest.spyOn(fs, 'existsSync').mockReturnValueOnce(true)
            // @ts-expect-error misc type mismatch
            jest.spyOn(fs, 'readdirSync').mockReturnValueOnce(['mock.json'])
            jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(JSON.stringify(mocks.withParams))
            const app = await handler({ dir: 'mocks', port: 8080 })
            await request(app).get('/api/hello/world').expect(200, { hello: 'world' })
        })

        it('should serve files from the directory with a header', async () => {
            jest.spyOn(fs, 'existsSync').mockReturnValueOnce(true)
            // @ts-expect-error misc type mismatch
            jest.spyOn(fs, 'readdirSync').mockReturnValueOnce(['mock.json'])
            jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(JSON.stringify(mocks.withHeader))
            const app = await handler({ dir: 'mocks', port: 8080 })
            await request(app).get('/api/hello').expect('x-test', 'hello')
        })

        it('returns a 404 if a mock is not found', async () => {
            jest.spyOn(fs, 'existsSync').mockReturnValueOnce(true)
            // @ts-expect-error misc type mismatch
            jest.spyOn(fs, 'readdirSync').mockReturnValueOnce(['mock.json'])
            jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(JSON.stringify(mocks.withNotFound))
            const app = await handler({ dir: 'mocks', port: 8080 })
            await request(app).get('/api/unknown').expect(404)
        })

    })
})

