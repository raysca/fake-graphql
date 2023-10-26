import fs from 'node:fs'
import Handlebars from 'handlebars'
import path from 'node:path'

const registerPartial = (entry: string): void => {
    try {
        const { name } = path.parse(entry)
        const [, partialName] = name.split('_')
        Handlebars.registerPartial(partialName, fs.readFileSync(entry, 'utf-8'))
    } catch (error) {
        console.error(`Error registering ${entry} as partial`)
    }
}

export const registerFilePartials = (partialsPath: string): void => {
    try {
        const entries = fs.readdirSync(partialsPath)

        for (const entry of entries) {
            const fullPath = path.join(partialsPath, entry)
            if (fs.statSync(fullPath).isDirectory()) {
                registerFilePartials(fullPath)
            } else {
                if (entry.startsWith('_') && entry.endsWith('.hbs')) {
                    registerPartial(fullPath)
                }
            }
        }
    } catch (error: any) {
        console.warn(error.message)
    }
}
