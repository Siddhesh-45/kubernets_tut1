const studentList = document.querySelector('#student-list');
const searchInput = document.querySelector('#search-input');
const courseFilter = document.querySelector('#course-filter');
const statusFilter = document.querySelector('#status-filter');
const emptyState = document.querySelector('#empty-state');
const resultsLabel = document.querySelector('#results-label');
const modal = document.querySelector('#student-modal');
const form = document.querySelector('#student-form');
const formError = document.querySelector('#form-error');
let students = [];

const initials = (name) => name.split(' ').map((part) => part[0]).slice(0, 2).join('');

function renderStudents() {
  const search = searchInput.value.toLowerCase().trim();
  const course = courseFilter.value;
  const status = statusFilter.value;
  const filtered = students.filter((student) => {
    const matchesSearch = [student.name, student.email, student.course].some((value) => value.toLowerCase().includes(search));
    return matchesSearch && (!course || student.course === course) && (!status || student.status === status);
  });

  studentList.innerHTML = filtered.map((student) => `
    <tr>
      <td><div class="student-cell"><span class="student-initials">${initials(student.name)}</span><span>${student.name}<small class="student-email">${student.email}</small></span></div></td>
      <td>${student.course}</td>
      <td>${student.year}</td>
      <td><span class="status ${student.status === 'On leave' ? 'leave' : ''}">${student.status}</span></td>
      <td><button class="delete-button" data-id="${student.id}" aria-label="Remove ${student.name}">×</button></td>
    </tr>`).join('');

  emptyState.hidden = filtered.length !== 0;
  resultsLabel.textContent = `Showing ${filtered.length} of ${students.length} students`;
  document.querySelector('#total-count').textContent = String(students.length).padStart(2, '0');
  document.querySelector('#active-count').textContent = String(students.filter((student) => student.status === 'Active').length).padStart(2, '0');
  document.querySelector('#leave-count').textContent = String(students.filter((student) => student.status === 'On leave').length).padStart(2, '0');
}

function populateCourses() {
  const courses = [...new Set(students.map((student) => student.course))].sort();
  courseFilter.innerHTML = '<option value="">All courses</option>' + courses.map((course) => `<option value="${course}">${course}</option>`).join('');
}

async function loadStudents() {
  const response = await fetch('/api/students');
  students = await response.json();
  populateCourses();
  renderStudents();
}

[searchInput, courseFilter, statusFilter].forEach((control) => control.addEventListener('input', renderStudents));
studentList.addEventListener('click', async (event) => {
  const button = event.target.closest('.delete-button');
  if (!button || !window.confirm('Remove this student from the directory?')) return;
  await fetch(`/api/students/${button.dataset.id}`, { method: 'DELETE' });
  await loadStudents();
});

document.querySelector('#open-modal').addEventListener('click', () => {
  form.reset();
  formError.textContent = '';
  modal.showModal();
});
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const response = await fetch('/api/students', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!response.ok) {
    formError.textContent = 'Please complete all fields and try again.';
    return;
  }
  modal.close();
  await loadStudents();
});

loadStudents().catch(() => { formError.textContent = 'Could not load student data.'; });
