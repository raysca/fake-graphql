import fs from 'node:fs'
import path from 'node:path'
import { registerFilePartials } from './compile/partials'
import { createSchema, createYoga } from 'graphql-yoga'
import { createResolvers } from './graphql/resolvers'
import { buildSchema } from 'graphql'

export interface GraphqlMiddlewareOptions {
    dir: string
    schema: string
    watch?: boolean
    graphqlEndpoint?: string
}

export const createGraphqlMiddleware = (argv: GraphqlMiddlewareOptions) => {
    const { dir, schema: schemaFile, graphqlEndpoint = '/api/graphql' } = argv

    if (schemaFile === undefined) {
        throw new Error(`A Schema file is required to run the GraphQL server`)
    }

    if (fs.existsSync(path.resolve(schemaFile)) === false) {
        throw new Error(`Schema file ${schemaFile} does not exist`)
    }

    // TODO: Watch the partials directory for changes
    registerFilePartials(path.resolve(dir))

    const schemaSource = fs.readFileSync(path.resolve(schemaFile)).toString('utf-8')

    const yoga = createYoga({
        graphqlEndpoint,
        schema: createSchema({
            typeDefs: schemaSource,
            resolvers: createResolvers(buildSchema(schemaSource), dir),
        })
    })

    const middlewareHandler = yoga.handleRequest

    const GET = middlewareHandler
    const POST = middlewareHandler
    const OPTIONS = middlewareHandler

    return { middlewareHandler: middlewareHandler, middleware: yoga, GET, POST, OPTIONS }
}