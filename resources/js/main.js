var removeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect class="noFill" width="22" height="22"/><g><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6V18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';
var completeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect y="0" class="noFill" width="22" height="22"/><g><path class="fill" d="M9.7,14.4L9.7,14.4c-0.2,0-0.4-0.1-0.5-0.2l-2.7-2.7c-0.3-0.3-0.3-0.8,0-1.1s0.8-0.3,1.1,0l2.1,2.1l4.8-4.8c0.3-0.3,0.8-0.3,1.1,0s0.3,0.8,0,1.1l-5.3,5.3C10.1,14.3,9.9,14.4,9.7,14.4z"/></g></svg>';

var data = (localStorage.getItem('todoList')) ? JSON.parse(localStorage.getItem('todoList')) : {
    todo: [],
    completed: [],
    categories: []
}

renderTodoList();

// User clicked on the add button
// If there is any text inside the item field, add that text to the todo list
document.getElementById('add').addEventListener('click', function() {
    var value = document.getElementById('item').value;

    if (value.includes("@paste")) {
        const restValue = value.replace("@paste", "")
        var parsedData = JSON.parse(restValue);

        // Check if the data is in the old format
        if (Array.isArray(parsedData.todo) && Array.isArray(parsedData.completed)) {
            // Convert the old format to the new format
            data.todo = parsedData.todo.map(item => ({ value: item, category: "Principale" }));
            data.completed = parsedData.completed.map(item => ({ value: item, category: "Principale" }));
        } else {
            data = parsedData;
        }

        dataObjectUpdated();
        document.getElementById('item').value = '';
        location.reload()
    }

    if (value === "@copy") {
        document.getElementById('localstorage').innerText = localStorage.getItem('todoList');
        document.getElementById('item').value = '';
    }

    if (value.includes("@categoname")) {
        // change the name of the category which is selected (check if is not Principale)
        var category = document.getElementById('item').name;
        if (category === 'Principale') {
            console.log("Vous ne pouvez pas renommer la catégorie principale")
            return false
        }
        if (category) {
            var newCategory = value.replace("@categoname", "")
            data.categories[data.categories.indexOf(category)] = newCategory;
            // change all items with that category
            var lis = document.querySelectorAll('[data-category="' + category + '"]');
            for (var i = 0; i < lis.length; i++) {
                lis[i].dataset.category = newCategory;
            }
            dataObjectUpdated();
            var items = document.querySelectorAll('#todo li, #completed li');
            [].forEach.call(items, function(item) {
                item.style.display = 'block';
            })
            document.getElementById('item').value = '';
        }
    }

    if (value && !value.includes("@paste") && !value.includes("@copy") && !value.includes("@categoname")) {
        addItem(value);
    }
});

document.getElementById('item').addEventListener('keydown', function(e) {
    var value = this.value;
    if ((e.code === 'Enter' || e.code === 'NumpadEnter') && value && !value.includes("@paste") && !value.includes("@copy") && !value.includes("@categoname")) {
        addItem(value);
    }

    if ((e.code === 'Enter' || e.code === 'NumpadEnter') && value.includes("@paste")) {
        const restValue = value.replace("@paste", "")
        var parsedData = JSON.parse(restValue);

        // Check if the data is in the old format
        if (Array.isArray(parsedData.todo) && Array.isArray(parsedData.completed)) {
            // Convert the old format to the new format
            data.todo = parsedData.todo.map(item => ({ value: item, category: "Principale" }));
            data.completed = parsedData.completed.map(item => ({ value: item, category: "Principale" }));
        } else {
            data = parsedData;
        }

        dataObjectUpdated();
        document.getElementById('item').value = '';
        location.reload();
    }

    if ((e.code === 'Enter' || e.code === 'NumpadEnter') && value.includes("@categoname")) {
        // change the name of the category which is selected (check if is not Principale)
        var category = document.getElementById('item').name;
        if (category === 'Principale') {
            console.log("Vous ne pouvez pas renommer la catégorie principale")
            return false
        }
        if (category) {
            var newCategory = value.replace("@categoname", "")
            data.categories[data.categories.indexOf(category)] = newCategory;
            // change all items with that category
            var lis = document.querySelectorAll('[data-category="' + category + '"]');
            for (var i = 0; i < lis.length; i++) {
                lis[i].dataset.category = newCategory;
            }
            dataObjectUpdated();
            var items = document.querySelectorAll('#todo li, #completed li');
            [].forEach.call(items, function(item) {
                item.style.display = 'block';
            })
            document.getElementById('item').value = '';
        }
    }

    if ((e.code === 'Enter' || e.code === 'NumpadEnter') && value.includes("@copy") && !value.includes("@paste")) {
        document.getElementById('localstorage').innerText = localStorage.getItem('todoList');
        document.getElementById('item').value = '';
    }
});
document.getElementById('addCategory').addEventListener('click', function() {
    var category = prompt('Entrer le nom de la catégorie:');
    if (category) {
        data.categories.push(category);
        dataObjectUpdated();
    }
});

document.getElementById('removeCategory').addEventListener('click', function(e) {
    // if a category is selected, remove it from the dataset and update the view
    var category = document.getElementById('item').name;
    if (category === 'Principale') {
        console.log("Vous ne pouvez pas supprimer la catégorie principale")
        return false
    }
    if (category) {
        data.categories.splice(data.categories.indexOf(category), 1);
        // remove all items with that category
        var lis = document.querySelectorAll('[data-category="' + category + '"]');
        for (var i = 0; i < lis.length; i++) {
            lis[i].parentNode.removeChild(lis[i]);
        }
        dataObjectUpdated();
        var items = document.querySelectorAll('#todo li, #completed li');
        [].forEach.call(items, function(item) {
            item.style.display = 'block';
        });
        document.getElementById('item').name = 'Principale';
        document.getElementById('item').placeholder = 'Entrer une tâche pour Principale';
    }

})

function addItem(value) {
    var category = document.getElementById('item').name; // get the category from the name attribute of the item field
    addItemToDOM(value, category);
    document.getElementById('item').value = '';
    data.todo.push({ value: value, category: category }); // store the value and category in the todo array
    console.log(data)
    dataObjectUpdated();
}

function renderTodoList() {
    dataObjectUpdated()

    if (!data.categories.length) {
        data.categories.push("Principale")
        dataObjectUpdated()
    }

    if (!data.todo.length && !data.completed.length) return;

    for (var i = 0; i < data.todo.length; i++) {
        var value = data.todo[i].value;
        var category = data.todo[i].category;
        addItemToDOM(value, category);
    }

    for (var j = 0; j < data.completed.length; j++) {
        var value = data.completed[j].value;
        var category = data.completed[j].category;
        addItemToDOM(value, category, true);
    }
}

function dataObjectUpdated() {
    localStorage.setItem('todoList', JSON.stringify(data));

    // clear the category list
    var categoryList = document.getElementById('categoryList');
    while (categoryList.firstChild) {
        categoryList.removeChild(categoryList.firstChild);
    }

    categoryList.addEventListener('click', function(event) {
        if (event.target.tagName === 'LI') {
            var category = event.target.textContent;
            document.getElementById('item').placeholder = 'Entrer une tâche pour ' + category;
            // change the name of the item 
            document.getElementById('item').name = category;
            // show only the items with that category in the dataset 
            var items = document.querySelectorAll('#todo li, #completed li');
            [].forEach.call(items, function(item) {
                if (item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                } // hide the ones not to be shown
            });
            // if the button with id showAll is clicked, show all items again
            document.getElementById('showAll').addEventListener('click', function() {
                [].forEach.call(items, function(item) {
                    item.style.display = 'block';
                    document.getElementById('item').placeholder = 'Entrer une tâche pour Principale'
                        // change the name of the item 
                    document.getElementById('item').name = "Principale";
                });
            });

        }
    });

    // add each category to the category list
    data.categories.forEach(function(category) {

        var li = document.createElement('li');
        li.textContent = category;
        li.id = category.replace(/\s+/g, '-').toLowerCase(); // assign an id based on the category name
        categoryList.appendChild(li);
    });
}

function removeItem() {
    var item = this.parentNode.parentNode;
    var parent = item.parentNode;
    var id = parent.id;
    var value = item.innerText;

    if (id === 'todo') {
        data.todo.splice(data.todo.indexOf(value), 1);
    } else {
        data.completed.splice(data.completed.indexOf(value), 1);
    }
    dataObjectUpdated();

    parent.removeChild(item);
}

function completeItem() {
    var item = this.parentNode.parentNode;
    var parent = item.parentNode;
    var id = parent.id;
    var value = item.innerText;
    var category = item.dataset.category; // get the category from the dataset

    if (id === 'todo') {
        data.todo.splice(data.todo.findIndex(item => item.value === value && item.category === category), 1); // remove the item from the todo array
        data.completed.push({ value: value, category: category }); // add the item to the completed array
    } else {
        data.completed.splice(data.completed.findIndex(item => item.value === value && item.category === category), 1); // remove the item from the completed array
        data.todo.push({ value: value, category: category }); // add the item to the todo array
    }
    dataObjectUpdated();

    // Check if the item should be added to the completed list or to be re-added to the todo list
    var target = (id === 'todo') ? document.getElementById('completed') : document.getElementById('todo');

    parent.removeChild(item);
    target.insertBefore(item, target.childNodes[0]);
}

function editItem(item) {
    var textElement = item.querySelector('.text');
    var text = textElement.innerText;
    textElement.innerHTML = '<input type="text" class="edit-item" value="' + text + '">';

    var editInput = item.querySelector('.edit-item');
    editInput.addEventListener('keydown', function(e) {
        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
            var newText = editInput.value;
            textElement.innerHTML = newText;

            updateItemInLocalStorage(text, newText);
        } else if (e.code === 'Escape') {
            textElement.innerHTML = text; // Restore the original text
        }
    });

    editInput.addEventListener('blur', function() {
        var newText = editInput.value;
        textElement.innerHTML = newText !== '' ? newText : text; // Restore the original text if the modified text is empty

        updateItemInLocalStorage(text, newText);
    });

    editInput.focus();
}

function updateItemInLocalStorage(oldText, newText) {
    var index = data.todo.findIndex(item => item.value === oldText);
    if (index !== -1) {
        data.todo[index].value = newText;
    } else {
        index = data.completed.findIndex(item => item.value === oldText);
        if (index !== -1) {
            data.completed[index].value = newText;
        }
    }
    dataObjectUpdated();
}

// Adds a new item to the todo list
function addItemToDOM(text, category, completed) {
    var list = (completed) ? document.getElementById('completed') : document.getElementById('todo');

    var item = document.createElement('li');
    var textElement = document.createElement('span');
    textElement.classList.add('text');
    textElement.textContent = text;
    item.dataset.category = category; // assign the category to the dataset
    item.appendChild(textElement);

    textElement.addEventListener('click', function() {
        editItem(this.parentNode); // Appeler la fonction editItem en passant l'élément parent du span
    });

    var buttons = document.createElement('div');
    buttons.classList.add('buttons');

    var remove = document.createElement('button');
    remove.classList.add('remove');
    remove.innerHTML = removeSVG;

    // Add click event for removing the item
    remove.addEventListener('click', removeItem);

    var complete = document.createElement('button');
    complete.classList.add('complete');
    complete.innerHTML = completeSVG;

    // Add click event for completing the item
    complete.addEventListener('click', completeItem);

    buttons.appendChild(remove);
    buttons.appendChild(complete);
    item.appendChild(buttons);

    list.insertBefore(item, list.childNodes[0]);
}