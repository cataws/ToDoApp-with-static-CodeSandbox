const taskInput = document.getElementsByClassName('task_input')[0];
const taskSubmit = document.getElementsByClassName('task_submit')[0];
const taskDelete = document.getElementsByClassName('task_delete')[0];
const taskList = document.getElementsByClassName('task_list')[0];

// ローカルストレージに保存されたデータを取得
const getPersistentTodos = () => {
  const noTodos = []; // ローカルストレージが空なら、空配列を返す
  const persistentTodos = JSON.parse(localStorage.getItem('todo'));
  return persistentTodos !== null ? persistentTodos : noTodos;
};
// ローカルストレージにデータを保存
const setPersistentTodos = (todo) =>
  localStorage.setItem('todo', JSON.stringify(todo));

// Deleteボタン押下時の処理
const deleteTasks = (deleteButton) => {
  const chosenTask = deleteButton.closest('li');
  taskList.removeChild(chosenTask);
  // ローカルストレージに保存
  setPersistentTodos(
    getPersistentTodos().filter((todo) => todo.item !== chosenTask.id)
  );
};

// Completeボタン押下時の処理(完了⇔未完了のトグル)
const completeTasks = (completeButton) => {
  const chosenTask = completeButton.closest('li');

  if (chosenTask.className === 'complete') {
    // 完了タスクを未完了に戻す
    chosenTask.className = 'notComplete';
    completeButton.innerHTML = 'Complete';
  } else {
    // 未完了タスクを完了にする
    chosenTask.className = 'complete';
    completeButton.innerHTML = 'Restore';
  }

  // 完了・未完了のデータをローカルストレージに保存
  let persistentTodos = [];
  persistentTodos = getPersistentTodos().map((todo) => {
    if (todo.item === chosenTask.id) {
      todo.comp = chosenTask.className === 'complete' ? true : false;
    }
    return todo;
  });
  setPersistentTodos(persistentTodos);
};

// やること追加ボタン押下時③ ⇒ ボタンの作成
const addButtons = (item) => {
  const deleteButton = document.createElement('button');
  deleteButton.className = 'task_button';
  deleteButton.innerHTML = 'Delete';
  item.appendChild(deleteButton);

  const completeButton = document.createElement('button');
  completeButton.className = 'task_button';
  item.appendChild(completeButton);
  if (item.className === 'complete') {
    completeButton.innerHTML = 'Restore';
  } else {
    completeButton.innerHTML = 'Complete';
  }

  deleteButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    deleteTasks(deleteButton);
  });

  completeButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    completeTasks(completeButton);
  });
};

// やること追加ボタン押下時② ⇒ タスクの要素を追加
const addTasks = (task) => {
  const listItem = document.createElement('li');
  const showItem = taskList.appendChild(listItem);
  listItem.id = task;

  const listItem2 = document.createElement('p');
  const showItem2 = showItem.appendChild(listItem2);
  showItem2.innerHTML = task;

  addButtons(listItem);

  // ローカルストレージに保存
  const persistentTodos = getPersistentTodos();
  persistentTodos.push({ item: task, comp: false });
  setPersistentTodos(persistentTodos);
};

// やること追加ボタン押下時① ⇒ エラー処理
taskSubmit.addEventListener('click', (evt) => {
  evt.preventDefault();
  const task = taskInput.value;
  if (task === '') {
    // タスク未入力は認めない
    window.alert('タスクを入力してください');
    return;
  }

  const persistentTodos = getPersistentTodos();
  const found = persistentTodos.find((todo) => todo.item === task);
  if (found) {
    // タスクの重複は認めない
    window.alert('タスクが重複しています');
    return;
  }

  addTasks(task);
  taskInput.value = '';
});

// 全削除ボタン押下時 ⇒ リストの全削除(LoaclStorageも全削除)
taskDelete.addEventListener('click', (evt) => {
  evt.preventDefault();
  localStorage.clear();
  taskList.textContent = '';
});

// Reload時の処理
document.addEventListener('DOMContentLoaded', () => {
  const persistentTodos = getPersistentTodos();
  if (persistentTodos.length !== 0) {
    // ローカルストレージに保存してあるデータを戻す
    persistentTodos.forEach((todo) => {
      const listItem = document.createElement('li');
      listItem.id = todo.item;
      if (todo.comp === true) {
        listItem.setAttribute('class', 'complete');
      }
      listItem.textContent = todo.item;
      taskList.appendChild(listItem);
      addButtons(listItem);
    });
  }
});
