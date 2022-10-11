import express from 'express'
import { z, ZodError } from 'zod'
import cors from 'cors'

import { PrismaClient } from '@prisma/client'
import { convertHourStringToMinutes } from './utils/convert-hour-string-to-minutes'
import { convertMinutesToHourString } from './utils/convert-minutes-to-hour-string'

const app = express()

const setGame = z.object({
  game: z.string().min(1, 'Informe o nome do game'),
  bannerUrl: z.string().min(1, 'Informe a foto de capa do game')
})

const setAdGame = z.object({
  gameId: z.string().uuid('Informe o game'),
  name: z.string().trim().min(1, "Informe um nome!"),
  yearsPlaying: z.number().min(1, 'Informe quantos anos que joga'),
  discord: z.string().min(1, 'Informe o discord'),
  weekDays: z.array(z.number()).min(1, 'Informe o dia que costuma jogar'),
  hourStart: z.string().min(1, 'Informe a hora início'),
  hourEnd: z.string().min(1, 'Informe a hora término'),
  useVoiceChannel: z.boolean(),
})

app.use(express.json())

app.use(cors({
  //origin: 'localhost:3333 exemplo' -> qual endereço eu permitir que faça request pro meu back end
}))

const prisma = new PrismaClient({
  log: ['query']
}) //Faz automaticamente a conexão com o banco de dados

/*
Tipos de parametros
* Query -> localhost:3333/ads?page=2
* Route -> localhost:3333/ads/5 usado para identificar um recurso na API (parametros não nomeados)
* Body  -> Quando envia varias informações na requisição, nao fica na URL é escondido na request
*/

app.get('/games', async (request, response) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true,
        }
      }
    }
  })

  return response.json(games);
});

app.post('/games', async (request, response) => {
  const body: any = request.body;

  try {
    setGame.parse(body);
  } catch (error) {
    if (error instanceof ZodError) {
      return response.status(400).json(error.issues.map(issue => ({ message: issue.message })))
    }
    return response.status(500).json({ message: 'Internal Server Error!' })
  }

  const game = await prisma.game.create({
    data: {
      title: body.game,
      bannerUrl: body.bannerUrl,
    }
  })

  return response.status(201).json(game);
})

app.post('/games/:id/ads', async (request, response) => {
  const gameId = request.params.id;
  const body: any = request.body;
  console.log({ gameId, ...body })

  try {
    setAdGame.parse({ ...body, gameId });
  } catch (error) {
    if (error instanceof ZodError) {
      //return response.status(400).json(error.issues)
      return response.status(400).json(error.issues.map(issue => ({ message: issue.message })))
    }
    return response.status(500).json({ message: 'Internal Server Error!' })
  }

  const ad = await prisma.ad.create({
    data: {
      gameId,
      name: body.name,
      yearsPlaying: body.yearsPlaying,
      discord: body.discord,
      weekDays: body.weekDays.join(','),
      hourStart: convertHourStringToMinutes(body.hourStart),
      hourEnd: convertHourStringToMinutes(body.hourEnd),
      useVoiceChannel: body.useVoiceChannel,
    }
  })

  return response.status(201).json(ad);
});

app.get('/games/:id/ads', async (request, response) => {
  const gameId = request.params.id;

  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      weekDays: true,
      useVoiceChannel: true,
      yearsPlaying: true,
      hourStart: true,
      hourEnd: true,
    },
    where: {
      gameId,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return response.json(ads.map(ad => {
    return {
      ...ad,
      weekDays: ad.weekDays.split(','),
      hourStart: convertMinutesToHourString(ad.hourStart),
      hourEnd: convertMinutesToHourString(ad.hourEnd)
    }
  }))
});

app.get('/ads/:id/discord', async (request, response) => {
  const adId = request.params.id;

  const ad = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true,
    },
    where: {
      id: adId,
    }
  })

  return response.json({
    discord: ad.discord
  });
});

app.listen(3333)
