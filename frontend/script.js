const API = 'http://localhost:5000/api/todos';

const statuses = [
  { key: 'backlog', label: 'Backlog' },
  { key: 'wip', label: 'Work in Progress' },
  { key: 'pending', label: 'Pending' },
  { key: 'done', label: 'Done' },
];

const board = document.getElementById('board');
const form = document.getElementById('create-form');

async function fetchTodos() {
  const res = await fetch(API);
  const data = await res.json();
  return data;
}

function createColumn(status) {
  const col = document.createElement('div');
  col.className = 'column';

  const title = document.createElement('h2');
  title.textContent = status.label;

  const list = document.createElement('div');
  list.className = 'list';

  col.appendChild(title);
  col.appendChild(list);

  return col;
}
function createCard(todo) {
  const card = document.createElement('div');
  card.className = 'card';

  const title = document.createElement('h3');
  title.textContent = escapeHtml(todo.title);

  const desc = document.createElement('p');
  desc.textContent = escapeHtml(todo.description || '');

  const meta = document.createElement('div');
  meta.className = 'meta';

  const actions = document.createElement('div');
  actions.className = 'actions';

  // Status selector
  const select = document.createElement('select');
  statuses.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.key;
    opt.textContent = s.label;
    if (s.key === todo.status) opt.selected = true;
    select.appendChild(opt);
  });
  select.addEventListener('change', () => changeStatus(todo._id, select.value));
  actions.appendChild(select);

  // Delete button
  const delBtn = document.createElement('button');
  delBtn.textContent = 'Delete';
  delBtn.addEventListener('click', () => deleteTodo(todo._id));
  actions.appendChild(delBtn);

  meta.appendChild(actions);
  card.appendChild(title);
  card.appendChild(desc);
  card.appendChild(meta);

  return card;
}
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function render() {
  board.innerHTML = '';
  const cols = {};
  statuses.forEach(s => {
    const col = createColumn(s);
    board.appendChild(col);
    cols[s.key] = col.querySelector('.list');
  });
  const todos = await fetchTodos();

  // Add each todo to its column
  todos.forEach(t => {
    if (cols[t.status]) {
      const card = createCard(t);
      cols[t.status].appendChild(card);
    }
  });
}
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('desc').value.trim();
  const status = document.getElementById('status').value;

  if (!title) return alert('Title is required');

  await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, status }),
  });

  form.reset();
  render();
});
async function changeStatus(id, status) {
  await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  render();
}

async function deleteTodo(id) {
  if (!confirm('Delete this todo?')) return;
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  render();
}
render();
