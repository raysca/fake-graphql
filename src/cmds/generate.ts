import path from 'path'
import fs from 'fs'
import { compile } from '../compile'

export const handler = async (argv: any) => {
    const { file, output = argv.file } = argv

    if (!fs.existsSync(file)) {
        throw new Error(`File ${file} does not exist`)
    }

    const template = fs.readFileSync(file).toString()
    const result = await compile({ template })
    const dir = path.dirname(output)
    const outputFile = path.join(dir, `${path.basename(output, '.hbs')}`)
    fs.writeFileSync(outputFile, result)
    console.log(`Generated ${outputFile}`)
}