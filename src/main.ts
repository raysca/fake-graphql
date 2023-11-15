#!/usr/bin/env node
import yargs from 'yargs'
import path from 'node:path'
import fs from 'node:fs'
import { hideBin } from 'yargs/helpers'
import http, { IncomingMessage, ServerResponse } from 'node:http'
import * as rest from './cmds/rest'
import * as graphql from './cmds/graphql'

yargs(hideBin(process.argv))
    .command('rest', 'RESTFul mocks', {
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
    }, rest.handler)
    .command('graphql', 'Start the mock graphql server', {
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
        }
    }, async (argv) => {
        let app: http.Server<typeof IncomingMessage, typeof ServerResponse>;
        let start;

        if (argv.watch) {
            if (fs.existsSync(path.resolve(argv.schema))) {
                fs.watchFile(path.resolve(argv.schema), async (event) => {
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

process.on('SIGINT', () => {
    process.exit(0)
})