import fs from 'node:fs'
import express, { Router } from 'express'
import { createSchema, createYoga } from 'graphql-yoga'
import { createResolvers } from './resolvers'
import { GraphQLSchema, buildSchema, printSchema } from 'graphql'

interface Argv {
    mocks: string
    port: number
    schema: string | GraphQLSchema
    endpoint: string
    watch?: boolean
}

const getSchema = (schema: string | GraphQLSchema): GraphQLSchema => {
    if (typeof schema === 'string') {
        const schemaSource = fs.readFileSync(schema, 'utf-8')
        return buildSchema(schemaSource)
    }

    return schema
}

export const createRouter = (argv: Argv): Router => {
    const app = express.Router()
    const { mocks, schema, endpoint } = argv

    const noneExecutableSchema = getSchema(schema)
    const yoga = createYoga({
        graphqlEndpoint: endpoint,
        schema: createSchema({
            typeDefs: printSchema(noneExecutableSchema),
            resolvers: createResolvers(noneExecutableSchema, mocks)
        })
    })

    app.use(endpoint, yoga)
    return app
}