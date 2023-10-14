import { compile } from '../compile'

export const handler = async (argv: any) => {
    const { dir = 'mocks', port = 8080 } = argv

    const router = new Bun.FileSystemRouter({
        style: "nextjs",
        dir,
        fileExtensions: [".hbs", ".json"],
    });

    Bun.serve({
        port,
        async fetch(req: Request) {
            const route = router.match(req)
            if (!route) {
                return new Response('Not found', { status: 404 })
            }

            try {
                const context = { params: route.params, method: req.method, url: req.url }
                const mockDefinition = await Bun.file(route.filePath).text()
                const mockContent = JSON.parse(compile({ template: mockDefinition, context }))
                const { status = 200, body = '', headers = { 'content-type': 'application/json' } } = mockContent
                return new Response(JSON.stringify(body), { status, headers })
            } catch (error: any) {
                console.error(error)
                return new Response(error.toString(), { status: 500 })
            }
        }
    })

    console.log(`Serving ${dir} on port ${port}`)
}