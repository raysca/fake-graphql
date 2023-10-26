import fs from 'node:fs'
import { createSchema, createYoga } from 'graphql-yoga'
import { createResolvers } from '../graphql/resolvers'
import { buildSchema } from 'graphql'
import { registerFilePartials } from '../graphql/partials'

export const handler = async (argv: any) => {
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

    Bun.serve({
        port,
        error: (error: any) => {
            console.error(error)
            return new Response(error.toString(), { status: 500 })
        },
        async fetch(req: Request): Promise<Response> {
            return yoga(req)
        }
    })

    console.log(`Serving GraphQL mocks from ${dir} on port ${port} using schema ${schemaFile}`)

}