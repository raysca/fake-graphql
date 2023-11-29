#!/usr/bin/env node
import yargs from 'yargs'
import path from 'node:path'
import fs from 'node:fs'
import { hideBin } from 'yargs/helpers'
import http, { IncomingMessage, ServerResponse } from 'node:http'
import * as rest from './cmds/rest'
import * as graphql from './cmds/graphql'
import { fetchRemoteSchema } from './schema'

const isURL = (path: string): boolean => {
    return path.startsWith('http')
}

yargs(hideBin(process.argv))
    .command('rest', 'Start the server to mock REST APIs', {
        dir: {
            alias: 'd',
            describe: 'Directory where the mocks are stored',
            demandOption: false,
            default: 'mocks'
        },
        port: {
            alias: 'p',
            describe: 'Port to serve on',
            demandOption: false,
            default: 8080
        },
        watch: {
            alias: 'w',
            describe: 'Watch the mocks directory for changes',
            demandOption: false,
            default: false
        }
    }, async (argv) => {
        if (!fs.existsSync(path.resolve(argv.dir))) {
            throw new Error(`mocks directory ${argv.dir} does not exist`)
        }
        const app = await rest.handler(argv)
        app.listen(argv.port, () => {
            console.log(`Running a REST API server at ${argv.port}`)
        })
    })
    .command('graphql', 'Start the server to mock GraphQL APIs', {
        mocks: {
            alias: 'm',
            describe: 'Directory where the mocks are stored',
            default: process.cwd(),
            demandOption: false,
        },
        port: {
            alias: 'p',
            describe: 'Port to serve on',
            demandOption: false,
            default: 8080
        },
        schema: {
            alias: 's',
            describe: 'The Graphql Schema file',
            demandOption: false,
            default: path.resolve(process.cwd(), 'schema.graphql')
        },
        endpoint: {
            alias: 'e',
            describe: 'The endpoint to serve the graphql server on',
            demandOption: false,
            default: '/api/graphql'
        },
        header: {
            alias: 'H',
            describe: 'Authentication header to be sent with the request to the remote schema',
            multiple: true,
            demandOption: false,
            default: []
        }
    }, async (argv) => {
        let app: http.Server<typeof IncomingMessage, typeof ServerResponse>;
        let start;

        const { schema } = argv
        if (isURL(schema)) {
            try {
                const path = new URL(schema).pathname
                const schemaObject = await fetchRemoteSchema(schema, argv.header)
                Object.assign(argv, { schema: schemaObject, endpoint: path })
            } catch (error) {
                console.error(error)
                process.exit(1)
            }
        }

        if (argv.watch && !isURL(schema)) {
            if (fs.existsSync(path.resolve(argv.schema))) {
                fs.watchFile(path.resolve(argv.schema), async () => {
                    console.log('**** Schema file changed - Restarting Server ****')
                    app.close()
                    start = await graphql.handler(argv)
                    app = start()
                })
            }
        }

        start = await graphql.handler(argv)
        app = start()
    })
    .demandCommand()
    .help()
    .argv

process.on('SIGINT', () => process.exit(0))