function oval() { }

oval.alert = function (options) {
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

    const htmlContent = document.createElement('div');
    htmlContent.classList.add('oval-html-content');

    const confirmButton = document.createElement('button');
    confirmButton.classList.add('oval-button', 'oval-confirm');
    confirmButton.textContent = options.confirmButtonText || 'OK';

    if (options.icon) {
        const iconElement = document.createElement('span');
        iconElement.classList.add('material-icons');
        iconElement.textContent = options.icon || '';
        iconElement.style = options.iconStyle || 'color:black;font-size:30px';

        content.appendChild(iconElement);
    }

    actions.appendChild(confirmButton);

    content.appendChild(title);
    content.appendChild(text);
    if (options.html) {
        htmlContent.innerHTML = options.html;
        content.appendChild(htmlContent);
    }
    modal.appendChild(crossclose);
    modal.appendChild(content);
    if (!options.hideButtons) {
        modal.appendChild(actions);
    }
    if(options.overlay){
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

        if (options.html) {
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

        crossclose.addEventListener('click', () => {
            modal.remove();
            overlay.remove();
            result.isClosed = true;
            resolve(result);
        });

    });
};
