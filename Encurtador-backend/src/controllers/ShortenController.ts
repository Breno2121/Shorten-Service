import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { shortenService } from "../Services/ShortenService";

export async function shortController(app: FastifyInstance) {
    app.post("/shorten", async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const body = request.body as { url: string, shortId: string | null }
            const identifier = await shortenService.register(body)
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

    app.post("/qr-code", async (request: FastifyRequest, reply: FastifyReply) =>{
        try {
            const body = request.body as { url: string }
        const base64 = await shortenService.generateQrCode(body)
        return base64;

        } catch (error: any) {
            return reply.status(404).send({ error: "Not Fondue" })
        }
    })
}