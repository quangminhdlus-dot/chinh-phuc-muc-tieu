/* JavaScript thuần: trạng thái → lưu localStorage → cập nhật giao diện. */
'use strict';
const STORAGE_KEY = 'chinh-phuc-12-tuan-v1';
const $ = (selector) => document.querySelector(selector);
let state = { goal: '', tasks: [] };
let filter = 'all';
let toastTimer;
let storageWarning = '';

// Kiểm tra dữ liệu cũ để ứng dụng không bị dừng khi bộ nhớ bị hỏng.
function normalizeState(data) {
  if (!data || typeof data !== 'object' || typeof data.goal !== 'string' || !Array.isArray(data.tasks)) throw new Error('Dữ liệu không hợp lệ');
  const ids = new Set();
  const tasks = data.tasks.filter((task) => {
    if (!task || typeof task.id !== 'string' || ids.has(task.id) || typeof task.text !== 'string' || !task.text.trim() || typeof task.done !== 'boolean' || !Number.isInteger(task.week) || task.week < 1 || task.week > 12) return false;
    ids.add(task.id);
    return true;
  }).map((task) => ({ id: task.id, text: task.text.trim().slice(0, 200), done: task.done, week: task.week }));
  return { goal: data.goal.slice(0, 500), tasks };
}
function loadState() {
  let raw;
  try { raw = localStorage.getItem(STORAGE_KEY); }
  catch { storageWarning = 'Trình duyệt không cho phép lưu. Dữ liệu chỉ giữ trong phiên này.'; return; }
  if (raw !== null) {
    try { state = normalizeState(JSON.parse(raw)); }
    catch { storageWarning = 'Dữ liệu cũ bị lỗi. Lần lưu tiếp theo sẽ thay thế dữ liệu cũ.'; }
  }
}
function showStorageWarning() {
  $('#save-status').textContent = storageWarning;
  $('#save-status').classList.add('error');
}
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    storageWarning = '';
    $('#save-status').textContent = '✓ Đã lưu trên trình duyệt này';
    $('#save-status').classList.remove('error');
    return true;
  } catch {
    storageWarning = 'Không thể lưu: bộ nhớ đầy hoặc bị chặn. Dữ liệu mới chỉ giữ trong phiên này.';
    showStorageWarning();
    return false;
  }
}
function notify(message) {
  clearTimeout(toastTimer);
  $('#toast').textContent = message;
  $('#toast').classList.add('visible');
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 2600);
}
function getProgress(tasks) {
  const done = tasks.filter((task) => task.done).length;
  return { done, remaining: tasks.length - done, percent: tasks.length ? Math.round(done / tasks.length * 100) : 0 };
}
function render() {
  const progress = getProgress(state.tasks);
  $('#task-count').textContent = state.tasks.length;
  $('#done-count').textContent = progress.done;
  $('#remaining-count').textContent = progress.remaining;
  $('#progress-percent').textContent = progress.percent;
  $('#progress-fill').style.width = `${progress.percent}%`;
  $('#progress-bar').setAttribute('aria-valuenow', progress.percent);
  $('#progress-caption').textContent = !state.tasks.length ? 'Sẵn sàng cho bước đầu tiên' : progress.percent === 100 ? 'Tuyệt vời! Bạn đã hoàn thành mọi công việc.' : `${progress.done} / ${state.tasks.length} công việc đã hoàn thành`;
  const visibleTasks = state.tasks.filter((task) => filter === 'all' || (filter === 'done' ? task.done : !task.done));
  $('#list-summary').textContent = `${visibleTasks.length} công việc`;
  $('#task-list').replaceChildren();
  visibleTasks.forEach((task) => {
    const row = document.createElement('li');
    row.className = `task-row${task.done ? ' is-done' : ''}`;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-check';
    checkbox.id = `task-${task.id}`;
    checkbox.checked = task.done;
    checkbox.addEventListener('change', () => {
      task.done = checkbox.checked;
      saveState();
      render();
      // Giữ vị trí bàn phím sau khi danh sách được vẽ lại.
      const next = document.getElementById(checkbox.id);
      if (next) next.focus();
      else document.querySelector(`[data-filter="${filter}"]`).focus();
    });
    const label = document.createElement('label');
    label.className = 'task-label';
    label.htmlFor = checkbox.id;
    // Không chèn HTML từ nội dung người dùng nhập.
    label.textContent = task.text;
    const week = document.createElement('span');
    week.className = 'week-tag';
    week.textContent = `Tuần ${task.week}`;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'delete-button';
    remove.textContent = '×';
    remove.setAttribute('aria-label', `Xóa công việc: ${task.text}`);
    remove.title = 'Xóa công việc';
    remove.addEventListener('click', () => {
      state.tasks = state.tasks.filter((item) => item.id !== task.id);
      saveState();
      render();
      $('#task-input').focus();
      notify('Đã xóa công việc');
    });
    row.append(checkbox, label, week, remove);
    $('#task-list').append(row);
  });
  $('#empty-state').hidden = visibleTasks.length > 0;
  $('#empty-state h3').textContent = !state.tasks.length ? 'Bước đầu tiên bắt đầu từ đây' : 'Chưa có công việc ở mục này';
  $('#empty-state p').textContent = !state.tasks.length ? 'Thêm một công việc nhỏ cho tuần đầu tiên. Mỗi dấu tích là một bước tiến.' : filter === 'done' ? 'Hoàn thành một việc và quay lại xem thành quả nhé.' : 'Bạn đã hoàn thành tất cả công việc hiện tại!';
  $('#week-grid').replaceChildren();
  for (let week = 1; week <= 12; week++) {
    const tasks = state.tasks.filter((task) => task.week === week);
    const done = tasks.filter((task) => task.done).length;
    const cell = document.createElement('span');
    cell.className = `week-cell${tasks.length ? ' has-tasks' : ''}${tasks.length && done === tasks.length ? ' complete' : ''}`;
    cell.textContent = String(week).padStart(2, '0');
    cell.title = `Tuần ${week}: ${done}/${tasks.length} công việc hoàn thành`;
    cell.setAttribute('aria-label', cell.title);
    $('#week-grid').append(cell);
  }
}
function setFilter(nextFilter) {
  filter = nextFilter;
  document.querySelectorAll('[data-filter]').forEach((button) => button.setAttribute('aria-pressed', button.dataset.filter === filter));
  render();
}
function initialize() {
  loadState();
  $('#goal').value = state.goal;
  if (storageWarning) showStorageWarning();
  for (let week = 1; week <= 12; week++) {
    const option = document.createElement('option');
    option.value = week;
    option.textContent = `Tuần ${week}`;
    $('#task-week').append(option);
  }
  // Tự lưu theo từng lần gõ; nút lưu giúp xác nhận thao tác.
  $('#goal').addEventListener('input', () => { state.goal = $('#goal').value; saveState(); });
  $('#goal-form').addEventListener('submit', (event) => {
    event.preventDefault();
    state.goal = $('#goal').value;
    if (saveState()) notify('Đã lưu mục tiêu của bạn');
  });
  $('#task-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const input = $('#task-input');
    const text = input.value.trim();
    if (!text) { input.setCustomValidity('Hãy nhập tên công việc.'); input.reportValidity(); return; }
    state.tasks.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, text: text.slice(0, 200), done: false, week: Number($('#task-week').value) });
    saveState();
    input.value = '';
    if (filter === 'done') setFilter('all'); else render();
    input.focus();
  });
  $('#task-input').addEventListener('input', () => $('#task-input').setCustomValidity(''));
  document.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => setFilter(button.dataset.filter)));
  render();
}
initialize();
