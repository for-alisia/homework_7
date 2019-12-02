const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

(function() {
    fillTable(getCookie());

    addButton.addEventListener('click', e => {
        const cookieArr = [];
        const cookieName = addNameInput.value;
        const cookieValue = addValueInput.value;
        const filterValue = filterNameInput.value.trim();

        cookieArr.push(cookieName.trim());
        cookieArr.push(cookieValue.trim());
        document.cookie = cookieArr.join('=');
        fillTable(filterCookie(filterValue));

        addNameInput.value = '';
        addValueInput.value = '';
    });

    filterNameInput.addEventListener('keyup', function() {
        const value = filterNameInput.value.trim();
        fillTable(filterCookie(value));
    });
})();

//Получаем существующие cookie
function getCookie() {
    const currentCookies = document.cookie.split('; ');
    const cookiesObj = currentCookies.reduce((acc, current) => {
        const [name, value] = current.split('=');
        acc[name] = value;

        return acc;
    }, {});

    return cookiesObj;
}
//Заполняем теблицу из существующих cookie
function fillTable(cookies) {
    const fragment = document.createDocumentFragment();
    const trs = listTable.querySelectorAll('tr');

    for (let tr of trs) {
        tr.remove();
    }

    for (let cookie in cookies) {
        fragment.appendChild(createTr(cookie, cookies[cookie]));
    }

    listTable.appendChild(fragment);
}
//Создаем строку в таблице
function createTr() {
    const tr = document.createElement('tr');

    for (let arg of arguments) {
        tr.appendChild(createCell(arg));
    }

    tr.appendChild(createCellButton());
    tr.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON') {
            const cookieName = this.firstElementChild.textContent;
            const cookieValue = this.firstElementChild.nextElementSibling
                .textContent;

            deleteCookie(cookieName, cookieValue);
            this.remove();
        }
    });

    return tr;
}
//Создаем ячейку в таблице
function createCell(value) {
    const cell = document.createElement('td');
    cell.textContent = value;

    return cell;
}
//Создаем кнопку в таблице
function createCellButton() {
    const button = document.createElement('button');
    const cell = document.createElement('td');

    button.textContent = 'Удалить';
    button.className = 'btn btn-danger';

    cell.appendChild(button);

    return cell;
}

//Добавляем куки
function addCookie(cookieArr) {
    const currentCookies = getCookie();
    document.cookie = cookieArr.join('=');

    fillTable(getCookie());    
}

//Удаляем cookie
function deleteCookie(name, value) {
    document.cookie = `${name}=${value}; max-age=0`;
}

//Проверяем совпадение строк
function isMatching(value, chunk) {
    const lowValue = value.toLowerCase().trim();
    const lowChunk = chunk.toLowerCase().trim();

    return lowValue.includes(lowChunk);
}

//Фильтруем cookie
function filterCookie(value) {
    const currentCookie = getCookie();
    const filteredCookie = {};
    if (value) {
        for (let name in currentCookie) {
            if (
                isMatching(name, value) ||
                isMatching(currentCookie[name], value)
            ) {
                filteredCookie[name] = currentCookie[name];
            }
        }

        return filteredCookie;
    } else {
        return currentCookie;
    }
}
