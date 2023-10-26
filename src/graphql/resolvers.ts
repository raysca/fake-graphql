import path from 'node:path'
import fs from 'node:fs'
import { GraphQLSchema } from "graphql";
import { compile } from '../compile';

const makeResolvers = (fields: any, mocksDir: string) => {
    const operations: Record<string, any> = {}

    for (const fieldName in fields) {
        operations[fieldName] = async (_: any, args: any, context: any): Promise<any> => {

            const hbsFile = path.join(path.resolve(mocksDir), `${fieldName}.hbs`)
            const jsonFile = path.join(path.resolve(mocksDir), `${fieldName}.json`)

            if (!fs.existsSync(hbsFile) && !fs.existsSync(jsonFile)) {
                throw new Error(`No mock definition found for ${fieldName} in ${path.resolve(mocksDir)}`)
            }

            if (fs.existsSync(jsonFile)) {
                const jsonContent = JSON.parse(fs.readFileSync(jsonFile).toString('utf-8'))
                return jsonContent
            }

            const content = compile({ template: fs.readFileSync(hbsFile).toString('utf-8') })
            return JSON.parse(content)
        }
    }

    return operations
}

export const createResolvers = (schema: GraphQLSchema, mocksDir: string) => {
    const resolvers: Record<string, any> = {}
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