import fastify from 'fastify';
import { shortController } from './controllers/ShortenController';
import cors from '@fastify/cors'


const app = fastify();

app.register(cors, {
    origin: true,
    methods: ['GET', "POST"]
});// adiciona o cors.

app.register(shortController);


app.listen({ port: 3333 }).then(() => {
    console.log("backend rodando liso na porta 3333!!!")
})
