#!/usr/bin/env node
import yargs from 'yargs'
import path from 'path'
import { hideBin } from 'yargs/helpers'
import * as generate from './cmds/generate'
import * as rest from './cmds/rest'
import * as graphql from './cmds/graphql'

yargs(hideBin(process.argv))
    .command('generate', 'Generate new data', {
        file: {
            alias: 'f',
            describe: 'File to use as template',
            demandOption: false,
        },
        output: {
            alias: 'o',
            describe: 'Output file',
            demandOption: false,
        },
    }, generate.handler)
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
        const proc =  await graphql.handler(argv)
        proc()
    })
    .demandCommand()
    .help()
    .argv

process.on('SIGINT', () => {
    process.exit(0)
})