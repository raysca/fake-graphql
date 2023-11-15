import path from 'node:path'
import fs from 'node:fs'
import { GraphQLFieldMap, GraphQLSchema } from "graphql";
import { compile } from '../compile';

const makeResolvers = (fields: GraphQLFieldMap<unknown, unknown>, mocksDir: string) => {
    const operations: Record<string, unknown> = {}

    for (const fieldName in fields) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        operations[fieldName] = async (_: Record<string, unknown>, args: Record<string, unknown>, context: Record<string, unknown>): Promise<Record<string, unknown>> => {

            const file = [
                path.join(path.resolve(mocksDir), `${fieldName}.hbs`),
                path.join(path.resolve(mocksDir), `${fieldName}.json`)
            ].find(fs.existsSync)

            if (!file) {
                throw new Error(`No mock definition found for ${fieldName} in ${path.resolve(mocksDir)}`)
            }

            const template = fs.readFileSync(file, 'utf-8')
            const content = compile({ template })
            return JSON.parse(content)
        }
    }

    return operations
}

export const createResolvers = (schema: GraphQLSchema, mocksDir: string) => {
    const resolvers: Record<string, unknown> = {}
    const queryType = schema.getQueryType()
    const mutationType = schema.getMutationType()

    if (queryType != null) {
        resolvers[queryType.name] = makeResolvers(
            queryType.getFields(),
            mocksDir
        )
    }

    if (mutationType != null) {
        resolvers[mutationType.name] = makeResolvers(
            mutationType.getFields(),
            mocksDir
        )
    }

    return resolvers
}