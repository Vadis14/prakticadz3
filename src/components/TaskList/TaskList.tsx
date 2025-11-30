import type { Task } from '../Task/Task';
import { TaskItem } from '../TaskItem/TaskItem';
import { getTasks } from '../../services/api';
import { Loader } from '../Loader/Loader';

export class TaskList {
    public tasks: Task[] = [];
    private container: HTMLElement;
    private filteredTasks: Task[] = [];

    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'task-list';
    }

    async loadTasks(): Promise<void> {
        this.container.innerHTML = '';
        this.container.appendChild(Loader.create());
        
        try {
            this.tasks = await getTasks();
            this.filteredTasks = this.tasks;
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            this.container.innerHTML = '<p style="color: red;">Ошибка загрузки задач</p>';
        }
    }   

    render(tasksToShow?: Task[]): HTMLElement {
       this.container.innerHTML = '';

       const tasks = tasksToShow || this.filteredTasks;

       if (tasks.length === 0) {
           const empty = document.createElement('div');
           empty.className = 'empty-state';
           empty.style.textAlign = 'center';
           empty.style.padding = '40px';
           empty.style.color = '#999';
           empty.textContent = 'Нет задач';
           this.container.appendChild(empty);
           return this.container;
       }

       for (const task of tasks) {
        const taskItem = new TaskItem(task, async () => {
            await this.refresh();
        });
        const taskElement = taskItem.render();
        this.container.appendChild(taskElement);
       }
        return this.container;
    }

    setFilteredTasks(tasks: Task[]): void {
        this.filteredTasks = tasks;
        this.render(tasks);
    }
    
    async refresh(): Promise<void> {
        await this.loadTasks();
        this.render();
    }
}