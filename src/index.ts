#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import * as generate from './cmds/generate'
import * as serve from './cmds/serve'

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
    .command('serve', 'Serve mocks', {
        dir: {
            alias: 'd',
            describe: 'Directory where the mocks are stored',
            demandOption: false,
        },
        port: {
            alias: 'p',
            describe: 'Port to serve on',
            demandOption: false,
        },
    }, serve.handler)
    .demandCommand()
    .help()
    .argv
