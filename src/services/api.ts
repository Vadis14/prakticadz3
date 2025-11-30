import type { Task } from '../components/Task/Task';

const API_URL = 'http://localhost:3000';

export async function getTasks(): Promise<Task[]> {
    try {
        const response = await fetch(`${API_URL}/tasks`);
        return response.json();
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }
}

export async function createTask(task: Omit<Task, 'id'>): Promise<Task> {
    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });
        
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }
        
        return response.json();
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    }
}

export async function updateTask(id: number | string, task: Partial<Task>): Promise<Task> {
    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });
        
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }
        
        return response.json();
    } catch (error) {
        console.error('Error updating task:', error);
        throw error;
    }
}

export async function deleteTask(id: number | string): Promise<void> {
    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
}