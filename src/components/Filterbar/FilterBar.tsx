import type { Task } from '../Task/Task';

export type FilterType = 'all' | 'active' | 'completed';
export type SortType = 'date-asc' | 'date-desc' | 'updated' | 'alphabet';

export class FilterBar {
    private container: HTMLElement;
    private searchInput: HTMLInputElement;
    private filterButtons: HTMLButtonElement[] = [];
    private sortSelect: HTMLSelectElement;
    private currentFilter: FilterType = 'all';
    private currentSort: SortType = 'date-desc';
    private onFilterChange?: (filter: FilterType, search: string, sort: SortType) => void;

    constructor(onFilterChange?: (filter: FilterType, search: string, sort: SortType) => void) {
        this.onFilterChange = onFilterChange;
        this.container = document.createElement('div');
        this.container.className = 'filter-bar';
        this.container.style.marginBottom = '20px';
        this.container.style.padding = '15px';
        this.container.style.background = 'white';
        this.container.style.borderRadius = '8px';
        this.container.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';

        this.searchInput = document.createElement('input');
        this.searchInput.type = 'text';
        this.searchInput.placeholder = '🔍 Поиск по заголовку и описанию...';
        this.searchInput.style.width = '100%';
        this.searchInput.style.padding = '10px';
        this.searchInput.style.marginBottom = '15px';
        this.searchInput.style.border = '1px solid #ddd';
        this.searchInput.style.borderRadius = '4px';
        this.searchInput.addEventListener('input', () => {
            this.notifyChange();
        });

        const filterContainer = document.createElement('div');
        filterContainer.style.display = 'flex';
        filterContainer.style.gap = '10px';
        filterContainer.style.marginBottom = '15px';

        const filters: { type: FilterType; label: string }[] = [
            { type: 'all', label: 'Все' },
            { type: 'active', label: 'Активные' },
            { type: 'completed', label: 'Выполненные' }
        ];

        filters.forEach(filter => {
            const btn = document.createElement('button');
            btn.textContent = filter.label;
            btn.style.padding = '8px 16px';
            btn.style.border = '1px solid #ddd';
            btn.style.borderRadius = '4px';
            btn.style.cursor = 'pointer';
            btn.style.backgroundColor = filter.type === this.currentFilter ? '#2196F3' : 'white';
            btn.style.color = filter.type === this.currentFilter ? 'white' : '#333';
            
            btn.addEventListener('click', () => {
                this.currentFilter = filter.type;
                this.updateFilterButtons();
                this.notifyChange();
            });
            
            this.filterButtons.push(btn);
            filterContainer.appendChild(btn);
        });

        const sortContainer = document.createElement('div');
        sortContainer.style.display = 'flex';
        sortContainer.style.alignItems = 'center';
        sortContainer.style.gap = '10px';

        const sortLabel = document.createElement('label');
        sortLabel.textContent = 'Сортировка:';
        sortLabel.style.fontWeight = 'bold';

        this.sortSelect = document.createElement('select');
        this.sortSelect.style.padding = '8px';
        this.sortSelect.style.border = '1px solid #ddd';
        this.sortSelect.style.borderRadius = '4px';
        this.sortSelect.innerHTML = `
            <option value="date-desc">Новые сначала</option>
            <option value="date-asc">Старые сначала</option>
            <option value="updated">По дате обновления</option>
            <option value="alphabet">По алфавиту</option>
        `;
        this.sortSelect.addEventListener('change', () => {
            this.currentSort = this.sortSelect.value as SortType;
            this.notifyChange();
        });

        sortContainer.appendChild(sortLabel);
        sortContainer.appendChild(this.sortSelect);

        this.container.appendChild(this.searchInput);
        this.container.appendChild(filterContainer);
        this.container.appendChild(sortContainer);
    }

    private updateFilterButtons(): void {
        this.filterButtons.forEach((btn, index) => {
            const filters: FilterType[] = ['all', 'active', 'completed'];
            const isActive = filters[index] === this.currentFilter;
            btn.style.backgroundColor = isActive ? '#2196F3' : 'white';
            btn.style.color = isActive ? 'white' : '#333';
        });
    }

    private notifyChange(): void {
        if (this.onFilterChange) {
            this.onFilterChange(this.currentFilter, this.searchInput.value, this.currentSort);
        }
    }

    public render(): HTMLElement {
        return this.container;
    }

    public filterAndSort(tasks: Task[]): Task[] {
        let filtered = tasks;

        if (this.currentFilter === 'active') {
            filtered = filtered.filter(task => !task.completed);
        } else if (this.currentFilter === 'completed') {
            filtered = filtered.filter(task => task.completed);
        }

        const search = this.searchInput.value.toLowerCase();
        if (search) {
            filtered = filtered.filter(task => 
                task.title.toLowerCase().includes(search) ||
                task.description.toLowerCase().includes(search)
            );
        }

        filtered.sort((a, b) => {
            switch (this.currentSort) {
                case 'date-desc':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case 'date-asc':
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case 'updated':
                    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
                case 'alphabet':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });

        return filtered;
    }
}

