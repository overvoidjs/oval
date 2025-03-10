function oval() { }

oval.alert = function (options) {
    // Создаем основные элементы
    const modal = document.createElement('div');
    modal.classList.add('oval-modal');

    const crossclose = document.createElement('div');
    crossclose.classList.add('crossclose');

    const content = document.createElement('div');
    content.classList.add('oval-content');

    const title = document.createElement('h2');
    title.classList.add('oval-title');
    title.textContent = options.title || 'Сообщение';

    const text = document.createElement('p');
    text.classList.add('oval-text');
    text.textContent = options.text || '';

    const actions = document.createElement('div');
    actions.classList.add('oval-actions');

    const overlay = document.createElement('div');
    overlay.classList.add('oval-overlay');
    document.body.appendChild(overlay);

    // Создаем контейнер для произвольного HTML-кода
    const htmlContent = document.createElement('div');
    htmlContent.classList.add('oval-html-content');

    const confirmButton = document.createElement('button');
    confirmButton.classList.add('oval-button', 'oval-confirm');
    confirmButton.textContent = options.confirmButtonText || 'OK';

    if (options.icon) {
        // Создаем элемент для иконки
        const iconElement = document.createElement('span');
        iconElement.classList.add('material-icons');
        iconElement.textContent = options.icon || '';
        iconElement.style = options.iconStyle || 'color:black;font-size:30px'; // Устанавливаем цвет иконки

        // Добавляем иконку в разметку (например, перед заголовком)
        // titleElement.before(iconElement);
        // Добавляем иконку перед заголовком
        // content.insertBefore(iconElement, title);
        // title.before(iconElement);
        content.appendChild(iconElement);
    }

    actions.appendChild(confirmButton);

    // Собираем структуру модального окна
    content.appendChild(title);
    content.appendChild(text);
    // Если передан HTML-код, то вставляем его в контейнер
    if (options.html) {
        htmlContent.innerHTML = options.html;
        // Добавляем контейнер с HTML-кодом в содержимое модального окна
        content.appendChild(htmlContent);
    }
    modal.appendChild(crossclose);
    modal.appendChild(content);
    if (!options.hideButtons) {
        modal.appendChild(actions);
    }
    if(options.overlay){
        overlay.style.display = 'block';
    }

    // Добавляем модальное окно в DOM
    document.body.appendChild(modal);

    let result = {
        isConfirmed: false,
        isCanceled: false,
        isClosed: false
    }

    // Возвращаем Promise для обработки событий
    return new Promise((resolve) => {
        confirmButton.addEventListener('click', () => {
            modal.remove();
            result.isConfirmed = true;
            overlay.style.display = 'none';
            resolve(result); // Передаем объект опций для дальнейшей обработки
        });

        if (options.showCancelButton) {
            // Создаем кнопку отмены, если она указана в опциях
            const cancelButton = document.createElement('button');
            cancelButton.classList.add('oval-button', 'oval-cancel');
            cancelButton.textContent = options.cancelButtonText || 'Отмена';
            actions.appendChild(cancelButton);
            // Обработчик события для кнопки отмены
            cancelButton.addEventListener('click', () => {
                modal.remove();
                result.isCanceled = true;
                overlay.style.display = 'none';
                // Разрешаем Promise с дополнительным свойством, указывающим, что была нажата кнопка отмены
                resolve(result);
            });
        }

        if (options.html) {
            htmlContent.addEventListener('submit', (event) => {
                event.preventDefault();
            
                const formData = new FormData(event.target);
                const formDataObject = Object.fromEntries(formData.entries());   
            
                result.data = formDataObject;
                modal.remove();
                overlay.style.display = 'none';
                resolve(result);
            });
        }

        if (options.closeOnOutsideClick) {
            document.addEventListener('click', (event) => {
                // Проверяем, является ли кликнутый элемент модальным окном или его содержимым
                if (!modal.contains(event.target) && event.target !== modal) {
                    modal.remove();
                    overlay.style.display = 'none';
                    result.isClosed = true;
                    resolve(result);
                }
            });
        }

        crossclose.addEventListener('click', () => {
            modal.remove();
            overlay.style.display = 'none';
            result.isClosed = true;
            resolve(result);
        });


    });
};
