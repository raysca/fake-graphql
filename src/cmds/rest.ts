import express from 'express'
import { pathToRegexp } from 'path-to-regexp'
import fs from 'node:fs'
import path from 'node:path'
import { compile } from '../compile'

interface RestOptions {
    dir: string
    port: number
}

interface Mock {
    request: {
        path: string
        method?: string
        body?: unknown
    },
    response: {
        status?: number
        headers?: Record<string, unknown>
        body?: unknown
    }
    priority?: number
}

const collectMocks = (dir: string, req: express.Request,): Mock[] => {
    let mocks = []
    fs.readdirSync(dir).forEach(file => {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            mocks = mocks.concat(collectMocks(path.join(dir, file), req))
        }
        const content = compile({template: fs.readFileSync(path.join(dir, file), 'utf-8'), context: { params: req.params, query: req.query }})
        const mock = JSON.parse(content)
        mocks = mocks.concat(Array.isArray(mock) ? normalizeMocks(mock) : normalizeMocks([mock]))
    })

    return mocks.flat()
}

const fetchMockForRequest = (req: express.Request, mocks: Mock[]): Mock | undefined => {
    const [mock] = mocks.
        filter(mock => {
            return !mock.request.method || mock.request.method === req.method
        }).
        filter(mock => {
            const regexp = pathToRegexp(mock.request.path, [])
            const match = regexp.exec(req.path)
            if (match) {
                req.params = match.groups
                return true
            }
            return false
        }).sort((a, b) => {
            return (b.priority || 0) - (a.priority || 0)
        })

    return mock
}

const mockMiddleware = ({ dir }: { dir: string }) => (req: express.Request, res: express.Response) => {
    const mocks = collectMocks(dir, req)
    const mock = fetchMockForRequest(req, mocks)
    if (mock) {
        Object.entries(mock.response.headers).forEach(([key, value]: [string, string]) => res.setHeader(key, value))
        res.status(mock.response.status || 200).send(mock.response.body)
    } else {
        res.status(404).send('Not found')
    }
}

const normalizeMocks = (mocks: Mock[]): Mock[] => {
    return mocks.map(mock => {
        mock.response.status = mock.response.status ?? 200
        mock.response.headers = mock.response.headers ?? {}
        mock.response.body = mock.response.body ?? ''
        return mock
    })
}

export const handler = async (opts: RestOptions) => {
    if (!fs.existsSync(opts.dir)) {
        throw new Error(`mocks directory ${opts.dir} does not exist`)
    }

    const app = express()
    app.use(express.static(opts.dir))
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(mockMiddleware(opts))
    return app
}