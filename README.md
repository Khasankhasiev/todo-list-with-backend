# todo-list-with-backend

## Project Setup
Установить зависимости в папках backend и frontend
```sh
npm install
```

### Compile and Hot-Reload for Development
Запустить frontend командой
```sh
npm run dev
```
Запустить backend командой 
```sh
node index.js
```

### Neo4j
Установить Docker или скачать Neo4j dekstop
В случае с Docker, запустить его 
Затем командой
```sh
docker run --name neo4j -p7474:7474 -p7687:7687 -d -e NEO4J_AUTH=neo4j/test neo4j:4.4
```
Запустить локальный контейнер Neo4j

Отлично, все работает!
