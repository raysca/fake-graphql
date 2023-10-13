#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import * as generate from './cmds/generate'

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
    }, (argv) => {
        generate.handler(argv as any)
    })
    .demandCommand()
    .help()
    .argv
