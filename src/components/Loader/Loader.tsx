export class Loader {
    public static create(): HTMLElement {
        const loader = document.createElement('div');
        loader.className = 'loader';
        loader.style.textAlign = 'center';
        loader.style.padding = '20px';
        loader.innerHTML = '<div style="display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite;"></div><p style="margin-top: 10px;">Загрузка...</p>';
        return loader;
    }

    public static createButtonLoader(): HTMLElement {
        const loader = document.createElement('span');
        loader.innerHTML = '<span style="display: inline-block; width: 12px; height: 12px; border: 2px solid #fff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 0.6s linear infinite;"></span>';
        return loader;
    }
}

