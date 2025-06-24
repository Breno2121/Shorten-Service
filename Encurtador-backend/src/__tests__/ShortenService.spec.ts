import { prisma } from "../prisma/client"
import { shortenService } from "../Services/ShortenService"
import QrCode from "qrcode"

jest.mock('nanoid', () => {
    return {
        customAlphabet: jest.fn().mockReturnValue(() => 'ABCDE')
    }
})
jest.mock('../prisma/client', () => {
    return {
        prisma: {
            link: {
                create: jest.fn(),
                findUnique: jest.fn()
            }
        }
    }
})

jest.mock('qrcode', () => ({
    toDataURL: jest.fn()
}))

describe("Shorten Service Test", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    it("Deve receber uma url e retornar um shortId", async () => {
        const resultado = await shortenService.register({ url: "www.teste.com/essa-url-e-longa", shortId: null });

        expect(resultado).toHaveProperty('shortId');
        expect(resultado.shortId.length).toBe(5);
        expect(resultado).toEqual({ shortId: 'ABCDE' });
        expect(prisma.link.create).toHaveBeenCalledTimes(1)
        expect(prisma.link.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                originalUrl: "www.teste.com/essa-url-e-longa",
                shortId: expect.any(String)
            })
        }))
    })

    it("Deve receber uma url e retornar um shortId", async () => {
        const resultado = await shortenService.register({ url: "www.teste.com/essa-url-e-longa", shortId: "teste" });

        expect(resultado).toHaveProperty('shortId');
        expect(resultado).toEqual({ shortId: 'teste' });
        expect(prisma.link.create).toHaveBeenCalledTimes(1)
        expect(prisma.link.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                originalUrl: "www.teste.com/essa-url-e-longa",
                shortId: expect.any(String)
            })
        }))
    })

    it("Deve buscar um link pelo short id existente", async () => {
        const mockShortId = "teste";
        const mockOriginalUrl = "www.teste.com.br/teste/teste2/teste3";



        (prisma.link.findUnique as jest.Mock).mockResolvedValue({
            shortId: mockShortId,
            originalUrl: mockOriginalUrl
        });

        const resultado = await shortenService.findByIdentifier(mockShortId);

        expect(resultado).toEqual({ originalUrl: mockOriginalUrl })
        expect(prisma.link.findUnique).toHaveBeenCalledTimes(1);
        expect(prisma.link.findUnique).toHaveBeenCalledWith({ where: { shortId: mockShortId } })
    })

    it("Deve buscar um link por um shortId inexistente", async () => {
        const mockShortId = "teste";

        (prisma.link.findUnique as jest.Mock).mockRejectedValue(null);

        await expect(shortenService.findByIdentifier(mockShortId))
            .rejects
            .toThrow('NOT FOUND..');
    })

    it("Deve gerar um base64 de um link informado", async () => {
        const mockUrl = "https://exemplo.teste.com";
        const mockBase64 = "data:image/png;base64,exemple";

        (QrCode.toDataURL as jest.Mock).mockResolvedValue(mockBase64)

        const resultado = await shortenService.generateQrCode({ url: mockUrl });

        expect(resultado).toEqual({ base64: mockBase64 })
        expect(QrCode.toDataURL).toHaveBeenCalledTimes(1)
        expect(QrCode.toDataURL).toHaveBeenCalledWith(mockUrl)
    })

    it("Deve retornar um erro quando for passado um shortId ja utilizado", async () => {
        const mockShortId = "teste";

        (prisma.link.findUnique as jest.Mock).mockResolvedValue({
            shortId: mockShortId,
            originalUrl: "www.teste.com"
        })

        await expect(shortenService.register({ url: 'www.teste.com', shortId: mockShortId }))
            .rejects
            .toThrow("ShortId ja existe...")
    })

    it("Deve dar Problema porque o URL é null", async () => {
        await expect(shortenService.generateQrCode({ url: null as any }))
        .rejects
        .toThrow("Erro ao gerar o QRCode")
    })
})