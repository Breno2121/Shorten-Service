import { Link } from "@prisma/client"
import { prisma } from "../prisma/client";
import { customAlphabet } from "nanoid";

class ShortenService {
    public async register(url: string) {

        const shortId = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 5)

        const link = {
            id: crypto.randomUUID(),
            shortId: shortId(),
            originalUrl: url,
            createdAt: new Date()
        } as Link;

        await prisma.link.create({ data: link });

        return { shortId: link.shortId }
    }

    public async findByIdentifier(identifier: string) {
        const link = await prisma.link.findUnique({ where: { shortId: identifier } })
        if (!link) {
            throw new Error("NOT FONDUE..")
        }

        return { originalUrl: link?.originalUrl }
    }
}

export const shortenService = new ShortenService()