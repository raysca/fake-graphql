import http, { IncomingMessage, ServerResponse } from 'node:http'
import fs from 'node:fs'
import express from 'express'
import { registerFilePartials, watchPartials } from '../compile/partials'
import { createRouter } from '../graphql/router'
import { GraphQLSchema } from 'graphql'

interface HandlerParams {
    mocks: string
    port: number
    schema: string | GraphQLSchema
    endpoint: string
    watch?: boolean
}

export const handler = async (argv: HandlerParams): Promise<() => http.Server<typeof IncomingMessage, typeof ServerResponse>> => {
    const { mocks, port, schema, endpoint, watch = true } = argv

    if (typeof schema !== 'string' && typeof schema !== 'object') {
        throw new Error(`schema must be a string or a GraphQLSchema object`)
    }

    if (fs.existsSync(mocks) === false) {
        throw new Error(`mocks directory ${mocks} does not exist`)
    }

    registerFilePartials(mocks)
    watch && watchPartials(mocks)

    const router = createRouter(argv)
    const app = express()
    app.use(router)

    return (): http.Server<typeof IncomingMessage, typeof ServerResponse> => {
        return app.listen(port, () => {
            console.log(`Running a GraphQL API server at ${port}${endpoint}`)
        })
    }
}