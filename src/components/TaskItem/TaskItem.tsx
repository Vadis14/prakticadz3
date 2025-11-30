import type { Task } from '../Task/Task';
import { updateTask, deleteTask } from '../../services/api';

export class TaskItem {
    private task: Task;
    private onUpdate?: () => void;

    constructor(task: Task, onUpdate?: () => void) {
        this.task = task;
        this.onUpdate = onUpdate;
    }  
    
    public render(): HTMLElement {
        const div = document.createElement('div');
        div.className = 'task-item';
        
        if (this.task.completed) {
            div.classList.add('completed');
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = this.task.completed;
        checkbox.addEventListener('change', async () => {
            try {
                await updateTask(this.task.id, { 
                    completed: checkbox.checked,
                    updatedAt: new Date().toISOString(),
                    isUpdated: true
                });
                if (this.onUpdate) {
                    this.onUpdate();
                }
            } catch (error) {
                console.error('Ошибка:', error);
                checkbox.checked = !checkbox.checked;
            }
        });

        const content = document.createElement('div');
        content.className = 'task-content';

        const h3 = document.createElement('h3');
        h3.textContent = this.task.title;
        if (this.task.completed) {
            h3.style.textDecoration = 'line-through';
            h3.style.color = '#999';
        }

        const p = document.createElement('p');
        p.textContent = this.task.description || '';

        const dates = document.createElement('div');
        dates.className = 'task-dates';
        dates.style.fontSize = '12px';
        dates.style.color = '#999';
        dates.style.marginTop = '10px';
        
        const createdDate = new Date(this.task.createdAt).toLocaleDateString('ru-RU');
        dates.textContent = `Создано: ${createdDate}`;
        
        if (this.task.isUpdated) {
            const updatedDate = new Date(this.task.updatedAt).toLocaleDateString('ru-RU');
            dates.textContent += ` | Обновлено: ${updatedDate}`;
        }

        const actions = document.createElement('div');
        actions.className = 'task-actions';
        actions.style.marginTop = '10px';
        actions.style.display = 'flex';
        actions.style.gap = '10px';

        const editBtn = document.createElement('button');
        editBtn.textContent = '✏️ Редактировать';
        editBtn.className = 'btn-edit';
        editBtn.style.padding = '5px 10px';
        editBtn.style.cursor = 'pointer';
        editBtn.style.backgroundColor = '#2196F3';
        editBtn.style.color = 'white';
        editBtn.style.border = 'none';
        editBtn.style.borderRadius = '4px';
        editBtn.addEventListener('click', () => {
            if ((window as any).editTask) {
                (window as any).editTask(this.task);
            }
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️ Удалить';
        deleteBtn.className = 'btn-delete';
        deleteBtn.style.padding = '5px 10px';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.backgroundColor = '#f44336';
        deleteBtn.style.color = 'white';
        deleteBtn.style.border = 'none';
        deleteBtn.style.borderRadius = '4px';
        
        deleteBtn.addEventListener('click', async () => {
            if (confirm('Удалить задачу?')) {
                deleteBtn.disabled = true;
                deleteBtn.textContent = 'Удаление...';
                try {
                    await deleteTask(this.task.id);
                    if (this.onUpdate) {
                        this.onUpdate();
                    }
                } catch (error) {
                    console.error('Ошибка:', error);
                    alert('Не удалось удалить');
                    deleteBtn.disabled = false;
                    deleteBtn.textContent = 'Удалить';
                }
            }
        });

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        content.appendChild(h3);
        content.appendChild(p);
        content.appendChild(dates);
        content.appendChild(actions);

        div.appendChild(checkbox);
        div.appendChild(content);

        return div;
    }
}