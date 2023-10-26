#!/usr/bin/env node
import yargs from 'yargs'
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
        dir: {
            alias: 'd',
            describe: 'Directory where the mocks are stored',
            default: 'mocks',
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
            describe: 'Schema file',
            demandOption: true
        }
    }, graphql.handler)
    .demandCommand()
    .help()
    .argv
