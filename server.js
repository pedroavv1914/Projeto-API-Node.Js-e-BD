import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import pkg from './generated/prisma/index.js'

const { PrismaClient } = pkg
const prisma = new PrismaClient()
const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors())
app.use(express.json())

// === Rotas da API ===
app.post('/usuarios', async (req, res) => {
  const user = await prisma.user.create({ data: req.body })
  res.status(201).json(user)
})

app.get('/usuarios', async (req, res) => {
  const users = await prisma.user.findMany({
    where: req.query || undefined
  })
  res.status(200).json(users)
})

app.put('/usuarios/:id', async (req, res) => {
  await prisma.user.update({
    where: { id: req.params.id },
    data: req.body
  })
  res.status(201).json(req.body)
})

app.delete('/usuarios/:id', async (req, res) => {
  await prisma.user.delete({ where: { id: req.params.id } })
  res.status(200).json({ message: "Usuário deletado com sucesso!!!" })
})

// === Servir React (build) ===
app.use(express.static(path.join(__dirname, 'build')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

// === Exportar o app (sem .listen()) ===
export default app
