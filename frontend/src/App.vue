<template>
    <div class="container">
        <h1>Список задач</h1>
        <form @submit.prevent="addTask">
            <input v-model="newTask" placeholder="Введите новую задачу" />
            <button type="submit">Добавить</button>
        </form>

        <ul>
            <li v-for="task in tasks" :key="task.id">
                <label>
                    <input
                        type="checkbox"
                        v-model="task.completed"
                        @change="updateTaskStatus(task)"
                    />
                    <span :class="{ completed: task.completed }">{{
                        task.title
                    }}</span>
                </label>
                <button @click="deleteTask(task.id)">Удалить</button>
            </li>
        </ul>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            tasks: [],
            newTask: '',
        };
    },
    async created() {
        await this.fetchTasks();
    },
    methods: {
        async fetchTasks() {
            try {
                const response = await axios.get('http://localhost:3000/tasks');
                this.tasks = response.data;
            } catch (error) {
                console.error('Ошибка при загрузке задач:', error);
            }
        },
        async addTask() {
            try {
                const response = await axios.post(
                    'http://localhost:3000/tasks',
                    { title: this.newTask }
                );
                const newTask = response.data;
                this.tasks.push(newTask);
                this.newTask = '';
            } catch (error) {
                console.error('Ошибка при добавлении задачи:', error);
            }
        },
        async updateTaskStatus(task) {
            await axios.put(`http://localhost:3000/tasks/${task.id}`, {
                completed: task.completed,
            });
        },
        async deleteTask(taskId) {
            try {
                await axios.delete(`http://localhost:3000/tasks/${taskId}`);
                await this.fetchTasks(); // Синхронизируем состояние
            } catch (error) {
                console.error('Ошибка при удалении задачи:', error);
            }
        },
    },
};
</script>

<style scoped>
.container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}
.completed {
    text-decoration: line-through;
}
</style>
