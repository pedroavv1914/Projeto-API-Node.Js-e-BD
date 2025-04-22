import express from 'express'
import pkg from './generated/prisma/index.js'
import cors from 'cors'
const { PrismaClient } = pkg
const PORT = process.env.PORT || 3000;

const prisma = new PrismaClient()

const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    return res.json("hello world!");
})

app.post('/usuarios', async (req, res) => {
    const user = await prisma.user.create({
        data: {
            email: req.body.email,
            name: req.body.name,
            age: req.body.age
        }
    })
    res.status(201).json(user)
})

app.get('/usuarios', async (req, res) => {
    try {
        const { name, email, age } = req.query;

        const where = {};
        if (name) where.name = name;
        if (email) where.email = email;
        if (age) where.age = Number(age);

        const users = await prisma.user.findMany({
            where
        });

        res.status(200).json(users);
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        res.status(500).json({ error: "Erro ao buscar usuários." });
    }
});

app.put('/usuarios/:id', async (req, res) => {

    await prisma.user.update({
        where: {
            id: req.params.id
        }, 

        data: {
            email: req.body.email,
            name: req.body.name,
            age: req.body.age
        }
    })
    res.status(201).json(req.body)
})

app.delete('/usuarios/:id', async (req, res) => {
    
    await prisma.user.delete({     
        where: {
            id: req.params.id
        }
    })
    res.status(200).json({ message: "Usuário deletado com sucesso!!!"})
})

app.listen(PORT, () => {
    console.log('Server on');  
})
