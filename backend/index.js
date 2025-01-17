const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const neo4j = require('neo4j-driver');

const app = express();
const port = 3000;

// Neo4j конфигурация
const driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', 'test') // логин и пароль
);
const session = driver.session();

app.use(cors());
app.use(bodyParser.json());

// Получение списка задач
app.get('/tasks', async (req, res) => {
    try {
        const result = await session.run('MATCH (t:Task) RETURN t');
        const tasks = result.records.map(record => ({
            id: record.get('t').identity.low,
            ...record.get('t').properties,
        }));
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Добавление новой задачи
app.post('/tasks', async (req, res) => {
    const { title } = req.body;

    try {
        const result = await session.run(
            'CREATE (t:Task {title: $title, completed: false}) RETURN id(t) AS id, t',
            { title }
        );

        const task = result.records[0].get('t').properties;
        const id = result.records[0].get('id').toNumber();

        res.status(201).json({ id, ...task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при создании задачи' });
    }
});

// Изменение статуса задачи
app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    try {
        await session.run(
            'MATCH (t:Task) WHERE ID(t) = $id SET t.completed = $completed RETURN t',
            { id: parseInt(id), completed }
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Удаление задачи
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await session.run('MATCH (t:Task) WHERE ID(t) = $id DELETE t', {
            id: parseInt(id),
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
