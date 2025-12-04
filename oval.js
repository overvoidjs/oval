function oval() { }

oval.alert = function (options) {
    const modal = document.createElement('div');
    modal.classList.add('oval-modal');
    
    // Добавляем пользовательский класс к модальному окну
    if (options.modalClass) {
        modal.classList.add(options.modalClass);
    }

    const content = document.createElement('div');
    content.classList.add('oval-content');

    let title, text;

    // Создаем заголовок только если он указан
    if (options.title !== undefined && options.title !== null && options.title !== '') {
        title = document.createElement('h2');
        title.classList.add('oval-title');
        title.textContent = options.title;
    }

    // Создаем текст только если он указан
    if (options.text !== undefined && options.text !== null && options.text !== '') {
        text = document.createElement('p');
        text.classList.add('oval-text');
        text.textContent = options.text;
    }

    const actions = document.createElement('div');
    actions.classList.add('oval-actions');

    const overlay = document.createElement('div');
    overlay.classList.add('oval-overlay');
    
    // Добавляем пользовательский класс к оверлею
    if (options.overlayClass) {
        overlay.classList.add(options.overlayClass);
    }
    
    document.body.appendChild(overlay);

    const htmlContent = document.createElement('div');
    htmlContent.classList.add('oval-html-content');

    const confirmButton = document.createElement('button');
    confirmButton.classList.add('oval-button', 'oval-confirm');
    confirmButton.textContent = options.confirmButtonText || 'OK';

    // Создаем крестик только если hideCrossClose не true
    if (!options.hideCrossClose) {
        const crossclose = document.createElement('div');
        crossclose.classList.add('crossclose');
        modal.appendChild(crossclose);
    }

    if (options.icon) {
        const iconElement = document.createElement('span');
        iconElement.classList.add('material-icons');
        iconElement.textContent = options.icon || '';
        iconElement.style = options.iconStyle || 'color:black;font-size:30px';

        content.appendChild(iconElement);
    }

    actions.appendChild(confirmButton);

    // Добавляем заголовок только если он был создан
    if (title) {
        content.appendChild(title);
    }
    
    // Добавляем текст только если он был создан
    if (text) {
        content.appendChild(text);
    }
    
    // Обработка html из селектора
    if (options.htmlFromSelector) {
        const selectorElement = document.querySelector(options.htmlFromSelector);
        if (selectorElement) {
            const wrapperDiv = document.createElement('div');
            wrapperDiv.classList.add('ovalhtml');
            wrapperDiv.innerHTML = selectorElement.innerHTML;
            htmlContent.appendChild(wrapperDiv);
            content.appendChild(htmlContent);
        } else {
            console.warn(`Элемент с селектором "${options.htmlFromSelector}" не найден`);
        }
    }
    // Обработка обычного html
    else if (options.html) {
        htmlContent.innerHTML = options.html;
        content.appendChild(htmlContent);
    }
    
    modal.appendChild(content);
    if (!options.hideButtons) {
        modal.appendChild(actions);
    }
    
    if (options.overlay) {
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    }

    document.body.appendChild(modal);

    if (typeof options.onOpen === 'function') {
        options.onOpen();
    }

    let result = {
        isConfirmed: false,
        isCanceled: false,
        isClosed: false
    }

    return new Promise((resolve) => {
        confirmButton.addEventListener('click', () => {
            modal.remove();
            result.isConfirmed = true;
            overlay.remove();
            resolve(result);
        });

        if (options.showCancelButton) {
            const cancelButton = document.createElement('button');
            cancelButton.classList.add('oval-button', 'oval-cancel');
            cancelButton.textContent = options.cancelButtonText || 'Отмена';
            actions.appendChild(cancelButton);
            cancelButton.addEventListener('click', () => {
                modal.remove();
                overlay.remove();
                result.isCanceled = true;
                resolve(result);
            });
        }

        if (options.html || options.htmlFromSelector) {
            htmlContent.addEventListener('submit', (event) => {
                event.preventDefault();
            
                const formData = new FormData(event.target);
                const formDataObject = Object.fromEntries(formData.entries());   
            
                result.data = formDataObject;
                modal.remove();
                overlay.remove();
                resolve(result);
            });
        }

        if (options.closeOnOutsideClick) {
            overlay.addEventListener('click', (event) => {
                if (!modal.contains(event.target) && event.target !== modal) {
                    modal.remove();
                    overlay.remove();
                    result.isClosed = true;
                    resolve(result);
                }
            });
        }

        // Добавляем обработчик для крестика только если он создан
        if (!options.hideCrossClose) {
            const crossclose = modal.querySelector('.crossclose');
            crossclose.addEventListener('click', () => {
                modal.remove();
                overlay.remove();
                result.isClosed = true;
                resolve(result);
            });
        }
    });
};
