import fs from 'node:fs'
import express, { Router } from 'express'
import { createSchema, createYoga } from 'graphql-yoga'
import { createResolvers } from './resolvers'
import { buildSchema } from 'graphql'

interface Argv {
    mocks: string
    port: number
    schema: string
    endpoint: string
    watch?: boolean
}

export const createRouter = (argv: Argv): Router => {
    const app = express.Router()
    const { mocks, schema: schemaFile, endpoint } = argv

    const schemaSource = fs.readFileSync(schemaFile, 'utf-8')
    const noneExecutableSchema = buildSchema(schemaSource)
    const yoga = createYoga({
        graphqlEndpoint: endpoint,
        schema: createSchema({
            typeDefs: schemaSource,
            resolvers: createResolvers(noneExecutableSchema, mocks)
        })
    })

    app.use(endpoint, yoga)
    return app
}