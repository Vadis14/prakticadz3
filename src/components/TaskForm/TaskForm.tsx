import type { Task } from '../Task/Task';
import { createTask, updateTask } from '../../services/api';
import { Loader } from '../Loader/Loader';

export class TaskForm {
    private container: HTMLFormElement;
    private titleInput: HTMLInputElement;
    private descriptionTextarea: HTMLTextAreaElement;
    private completedCheckbox: HTMLInputElement;
    private submitButton: HTMLButtonElement;
    private onTaskCreated?: () => void;
    private editingTask: Task | null = null;

    constructor(onTaskCreated?: () => void) {
        this.onTaskCreated = onTaskCreated;
        this.container = document.createElement('form');
        this.container.className = 'task-form';

        this.titleInput = document.createElement('input');
        this.titleInput.type = 'text';
        this.titleInput.placeholder = 'Заголовок задачи';
        this.titleInput.required = true;
        this.titleInput.className = 'task-form__title';

        this.descriptionTextarea = document.createElement('textarea');
        this.descriptionTextarea.placeholder = 'Описание задачи (необязательно)';
        this.descriptionTextarea.className = 'task-form__description';
        this.descriptionTextarea.rows = 4;

        this.completedCheckbox = document.createElement('input');
        this.completedCheckbox.type = 'checkbox';
        this.completedCheckbox.id = 'task-completed';
        this.completedCheckbox.className = 'task-form__completed';

        this.submitButton = document.createElement('button');
        this.submitButton.type = 'submit';
        this.submitButton.textContent = 'Создать задачу';
        this.submitButton.className = 'task-form__submit';
    }

    public render(): HTMLElement {
        this.container.innerHTML = '';

        const completedLabel = document.createElement('label');
        completedLabel.htmlFor = 'task-completed';
        completedLabel.textContent = 'Выполнено';
        completedLabel.className = 'task-form__label';

        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'task-form__checkbox-container';
        checkboxContainer.appendChild(this.completedCheckbox);
        checkboxContainer.appendChild(completedLabel);

        this.container.appendChild(this.titleInput);
        this.container.appendChild(this.descriptionTextarea);
        this.container.appendChild(checkboxContainer);
        this.container.appendChild(this.submitButton);

        this.container.addEventListener('submit', this.handleSubmit.bind(this));

        return this.container;
    }

    private async handleSubmit(event: Event): Promise<void> {
        event.preventDefault(); 

        const title = this.titleInput.value.trim();
        const description = this.descriptionTextarea.value.trim();
        const completed = this.completedCheckbox.checked;

        if (!title) {
            alert('Заголовок задачи обязателен!');
            return;
        }

        const originalText = this.submitButton.textContent;
        this.submitButton.disabled = true;
        this.submitButton.textContent = 'Сохранение...';

        try {
            if (this.editingTask) {
                await updateTask(this.editingTask.id, {
                    title,
                    description,
                    completed,
                    updatedAt: new Date().toISOString(),
                    isUpdated: true
                });
                this.editingTask = null;
                this.submitButton.textContent = 'Создать задачу';
            } else {
                const newTask: Omit<Task, 'id'> = {
                    title,
                    description,
                    completed,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    isUpdated: false
                };
                await createTask(newTask);
            }
            
            this.reset();
            
            if (this.onTaskCreated) {
                this.onTaskCreated();
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при сохранении');
            this.submitButton.textContent = originalText;
        } finally {
            this.submitButton.disabled = false;
        }
    }

    public reset(): void {
        this.titleInput.value = '';
        this.descriptionTextarea.value = '';
        this.completedCheckbox.checked = false;
        this.editingTask = null;
        this.submitButton.textContent = 'Создать задачу';
    }

    public editTask(task: Task): void {
        this.editingTask = task;
        this.titleInput.value = task.title;
        this.descriptionTextarea.value = task.description;
        this.completedCheckbox.checked = task.completed;
        this.submitButton.textContent = 'Обновить задачу';
    }
}