import { TaskList } from '../src/components/TaskList/TaskList';
import { TaskForm } from '../src/components/TaskForm/TaskForm';
import { FilterBar } from '../src/components/Filterbar/FilterBar';
import type { Task } from '../src/components/Task/Task';

async function main() {
    const taskList = new TaskList();
    await taskList.loadTasks();
    
    const filterBar = new FilterBar(() => {
        const filtered = filterBar.filterAndSort(taskList.tasks);
        taskList.setFilteredTasks(filtered);
    });
    
    const taskForm = new TaskForm(async () => {
        await taskList.refresh();
        const filtered = filterBar.filterAndSort(taskList.tasks);
        taskList.setFilteredTasks(filtered);
    });
    
    document.body.appendChild(filterBar.render());
    
    const addButton = document.createElement('button');
    addButton.textContent = '+ Добавить задачу';
    addButton.style.padding = '10px 20px';
    addButton.style.marginBottom = '20px';
    addButton.style.background = '#4CAF50';
    addButton.style.color = 'white';
    addButton.style.border = 'none';
    addButton.style.borderRadius = '4px';
    addButton.style.cursor = 'pointer';
    addButton.style.fontSize = '16px';
    
    const formContainer = document.createElement('div');
    formContainer.style.display = 'none';
    formContainer.appendChild(taskForm.render());
    
    addButton.addEventListener('click', () => {
        if (formContainer.style.display === 'none') {
            formContainer.style.display = 'block';
            addButton.textContent = '− Скрыть форму';
        } else {
            formContainer.style.display = 'none';
            addButton.textContent = '+ Добавить задачу';
        }
    });
    
    document.body.appendChild(addButton);
    document.body.appendChild(formContainer);
    
    const filtered = filterBar.filterAndSort(taskList.tasks);
    taskList.setFilteredTasks(filtered);
    document.body.appendChild(taskList.render());
    
    (window as any).editTask = (task: Task) => {
        taskForm.editTask(task);
    };
}

main();