import fs from 'node:fs'
import express from 'express'
import { registerFilePartials, watchPartials } from '../compile/partials'
import { createRouter } from '../graphql/router'

interface HandlerParams {
    mocks: string
    port: number
    schema: string
    endpoint: string
    watch?: boolean
}

export const handler = async (argv: HandlerParams): Promise<() => void> => {
    const { mocks, port, schema: schemaFile, endpoint, watch = true } = argv

    if (fs.existsSync(schemaFile) === false) {
        fs.writeFileSync(schemaFile, 
            `
                type Query {
                    hello: String!
                }
            `
        )
    }
    
    if(fs.existsSync(mocks) === false) {
        throw new Error(`mocks directory ${mocks} does not exist`)
    }

    registerFilePartials(mocks)
    watch && watchPartials(mocks)

    const router = createRouter(argv)
    const app = express()
    app.use(router)

    return () => {
        app.listen(port, () => {
            console.log(`Running a GraphQL API server at ${port}${endpoint}`)
        })
    }
}