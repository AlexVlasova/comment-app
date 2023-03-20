// Создаем самовызывающуюся функцию чтоб не загрязнять глобальную область видимости
(function () {
    const commentsContainer = document.querySelector('.comments-list');

    function beautifyDate(n) {
        return n < 10 ? '0' + n : n;
    }
    // Создаем несколько исходных комментариев (могут загружаться из бд)
    function createComment(name, date, text, isFavourite) {
        let now = new Date();
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        let dateText = '';

        if (now.getDate() == date.getDate() && now.getMonth() == date.getMonth() && now.getFullYear() == date.getFullYear()) {
            dateText += 'Сегодня, ';
        } else if (yesterday.getDate() == date.getDate() && yesterday.getMonth() == date.getMonth() && yesterday.getFullYear() == date.getFullYear()) {
            dateText += 'Вчера, '
        } else {
            dateText += beautifyDate(date.getDate()) + '.' + beautifyDate(date.getMonth() + 1) + '.' + date.getFullYear() + ', ';
        }

        dateText += beautifyDate(date.getHours()) + ':';
        dateText += beautifyDate(date.getMinutes());


        let commentElement = document.createElement('li');
        commentElement.className = `comment ${isFavourite ? "favourite" : ""}`;
        commentElement.innerHTML = `
                <div class="comment__left">
                    <span class="comment__name">${name}</span>
                    <span class="comment__date">${dateText}</span>
                    <div class="comment__text">${text}</div>
                </div>
                <div class="comment__right">
                    <div class="comment__delete"></div>
                    <div class="comment__like">
                        <svg width="20" height="20" viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M37.499 71.1232C37.0652 71.1232 36.6501 70.9489 36.3458 70.6406L9.4364 43.3281C3.35466 37.2462 0 30.0034 0 22.9413C0 11.5386 7.57549 3.87683 18.8515 3.87683C28.5444 3.87683 32.3858 8.18259 37.499 14.1925C42.6123 8.1832 46.4525 3.87683 56.1458 3.87683C67.423 3.87683 75 11.5386 75 22.9413C75 30.0034 71.6467 37.2468 65.5577 43.3364L38.6515 70.6408C38.3472 70.9496 37.9321 71.1232 37.499 71.1232ZM18.8515 7.11421C9.36654 7.11421 3.23738 13.3268 3.23738 22.9413C3.23738 29.1384 6.25466 35.5685 11.7343 41.0475L37.499 67.1989L63.2604 41.0561C68.746 35.5694 71.7626 29.1392 71.7626 22.9415C71.7626 13.3271 65.6322 7.11445 56.1458 7.11445C47.7681 7.11445 44.7229 10.695 39.6776 16.6273L38.7286 17.741C38.4208 18.1011 37.9714 18.3076 37.499 18.3076C37.0263 18.3076 36.5763 18.1011 36.2695 17.741L35.3267 16.6344C30.2789 10.6974 27.2319 7.11421 18.8515 7.11421Z" fill="black"/>
                        </svg>
                    </div>
                </div>`;

        commentsContainer.append(commentElement);
    }

    createComment("Александра", new Date(), "Большой и длинный комментарий от Александры");
    createComment("Дарья", new Date(2023, 2, 19, 23, 36), "Большой и длинный комментарий от Александры Большой и длинный комментарий от Александры Большой и длинный комментарий от Александры", true);
    createComment("Артем", new Date(2020, 4, 10, 5, 12), "Большой и длинный комментарий от Александры Большой и длинный комментарий от Александры Большой и длинный комментарий от Александры и еще текст андры Большой и длинный комментарий от Александры и еще текст андры Большой и длинный комментарий от Александры и еще текст");

    commentsContainer.addEventListener('click', (e) => {
        e.preventDefault();

        const target = e.target,
            deleteBtn= target.closest('.comment__delete'),
            likeBtn = target.closest('.comment__like'),
            comment = target.closest('.comment');

        // Удаляем комментарий
        if (deleteBtn) {
            comment.remove();
            return;
        }

        // Лайкаем комментарий
        if (likeBtn) {
            comment.classList.toggle('favourite');
            return;
        }
    });

    const form = document.querySelector('.add-comment-form');
    const nameInput = form.querySelector('input[name="name"]');

    nameInput.addEventListener('input', event => {
        nameInput.value = nameInput.value.trim();

        if (nameInput.value.length < 3) {
            form.classList.add('invalid');
            showErrorInfo(nameInput, 'Введено слишком короткое имя!')
        } else {
            form.classList.remove('invalid');
            hideErrorInfo();
        }
    });

    form.addEventListener('submit', event => {
        event.preventDefault();

        if (!form.classList.contains('invalid'))
            formSubmit();
    });

    function formSubmit() {
        let name = form.name.value;
        name = name[0].toUpperCase() + name.slice(1).toLowerCase();
        let date = form.date.value;

        if (!date) {
            date = new Date();
        } else {
            date = new Date(date);
        }
        let text = form.text.value;

        createComment(name, date, text, false);
        clearForm();
    }

    function clearForm() {
        form.name.value = '';
        form.date.value = '';
        form.text.value = '';
    }

    form.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            if (!form.classList.contains('invalid'))
                formSubmit();
        }
    });

    function showErrorInfo(elem, textError) {
        if (document.querySelector('.error-message')) return;

        elem.insertAdjacentHTML('afterend', `
            <div class="error-message">${textError}</div>
        `);
    }

    function hideErrorInfo() {
        const errorElem = document.querySelector('.error-message');
        if (errorElem) errorElem.remove();
    }
})();