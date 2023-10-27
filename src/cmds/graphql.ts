import fs from 'node:fs'
import express from 'express'
import { createSchema, createYoga } from 'graphql-yoga'
import { createResolvers } from '../graphql/resolvers'
import { buildSchema } from 'graphql'
import { registerFilePartials } from '../graphql/partials'

export const handler = async (argv: any) => {
    const app = express()

    const { dir, port, schema: schemaFile } = argv

    if (schemaFile === undefined) {
        throw new Error(`A Schema file is required to run the GraphQL server`)
    }

    if (fs.existsSync(schemaFile) === false) {
        throw new Error(`Schema file ${schemaFile} does not exist`)
    }

    registerFilePartials(dir)
    const schemaSource = fs.readFileSync(schemaFile).toString('utf-8')

    const yoga = createYoga({
        schema: createSchema({
            typeDefs: schemaSource,
            resolvers: createResolvers(buildSchema(schemaSource), dir)
        })
    })

    app.use(yoga.graphqlEndpoint, yoga)
    app.listen(port, () => {
        console.log(`Running a GraphQL API server at http://localhost:${port}/graphql`)
    })
}