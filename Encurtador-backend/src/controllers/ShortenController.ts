import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { shortenService } from "../Services/ShortenService";

export async function shortController(app: FastifyInstance) {
    app.post("/shorten", async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const body = request.body as { url: string }
            const identifier = await shortenService.register(body.url)
            return identifier
        } catch (error: any) {
            return reply.status(404).send({ error: "Not Fondue" })
        }

    })

    app.get("/shorten", async (request: FastifyRequest, reply: FastifyReply) => {
        const query = request.query as { identifier: string }
        const url = await shortenService.findByIdentifier(query.identifier)

        return url;
    })
}