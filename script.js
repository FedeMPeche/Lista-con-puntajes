// Array para almacenar el estado inicial de la tabla
const initialState = [
  { country: 'Argentina', score: '500' },
  { country: 'Francia', score: '700' },
  { country: 'Brasil', score: '300' },
  { country: 'Colombia', score: '900' },
  { country: 'Venezuela', score: '200' }
];

// Obtener referencias a los elementos de la tabla y los botones
const table = document.getElementById('countries-table');
const tbody = table.querySelector('tbody');
const resetBtn = document.getElementById('reset-btn');
const startStopBtn = document.getElementById('start-stop-btn');
const addRowBtn = document.getElementById('add-row-btn');
const historySelect = document.getElementById('history-select');
const saveBtn = document.getElementById('save-btn');

// Variable para almacenar el intervalo de actualización
let intervalId = null;

// Función para crear una fila en la tabla
function createRow(country, score) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td contenteditable="true">${country}</td>
    <td contenteditable="true">${score}</td>
  `;
  tbody.appendChild(row);
}

// Función para ordenar la tabla según la columna clicada
function sortTable(columnIndex) {
  const rows = Array.from(tbody.querySelectorAll('tr'));

  rows.sort((a, b) => {
    const aValue = a.cells[columnIndex].textContent;
    const bValue = b.cells[columnIndex].textContent;
    return aValue.localeCompare(bValue, undefined, { numeric: true });
  });

  if (columnIndex === 1) {
    rows.reverse();
  }

  for (let row of rows) {
    tbody.appendChild(row);
  }
}

// Función para agregar una nueva fila a la tabla
function addRow() {
  const country = prompt('Ingrese el nombre del país:');
  const score = prompt('Ingrese el puntaje:');
  createRow(country, score);
}

// Función para restablecer la tabla a su estado inicial
function resetTable() {
  tbody.innerHTML = '';
  initialState.forEach(row => createRow(row.country, row.score));
}

// Función para iniciar o detener la actualización automática de los puntajes
function toggleUpdateScores() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    startStopBtn.textContent = 'Iniciar';
  } else {
    intervalId = setInterval(updateScores, 3000);
    startStopBtn.textContent = 'Parar';
  }
}

// Función para generar un número aleatorio entre 1 y 1000
function getRandomScore() {
  return Math.floor(Math.random() * 1000) + 1;
}

// Función para actualizar los puntajes de los países
function updateScores() {
  const rows = tbody.querySelectorAll('tr');
  rows.forEach(row => {
    const scoreCell = row.cells[1];
    scoreCell.textContent = getRandomScore();
  });

  sortTable(1); // Ordenar por puntaje descendente
}

// Función para guardar el estado actual de la tabla
function saveState() {
  const state = Array.from(tbody.querySelectorAll('tr')).map(row => ({
    country: row.cells[0].textContent,
    score: row.cells[1].textContent
  }));

  const option = document.createElement('option');
  option.textContent = `Tabla ${historySelect.options.length + 1}`;
  option.value = JSON.stringify(state);
  historySelect.appendChild(option);


  // Almacenar el estado como un atributo personalizado del option
  option.dataset.state = JSON.stringify(state);
}

// Event listeners para los botones
resetBtn.addEventListener('click', resetTable);
addRowBtn.addEventListener('click', addRow);
startStopBtn.addEventListener('click', toggleUpdateScores);
historySelect.addEventListener('change', () => {
  const selectedOption = historySelect.options[historySelect.selectedIndex];
  const state = JSON.parse(selectedOption.value);

  tbody.innerHTML = '';
  state.forEach(row => createRow(row.country, row.score));
});

saveBtn.addEventListener('click', saveState);

// Restablecer la tabla a su estado inicial al cargar la página
resetTable();

// Función para ordenar los puntajes de menor a mayor
function sortTableAscending() {
  const rows = Array.from(tbody.querySelectorAll('tr'));

  rows.sort((a, b) => {
    const aValue = parseInt(a.cells[1].textContent);
    const bValue = parseInt(b.cells[1].textContent);
    return aValue - bValue;
  });

  for (let row of rows) {
    tbody.appendChild(row);
  }
}

// Event listener para el botón "sort-asc-btn"
const sortAscBtn = document.getElementById('sort-asc-btn');
sortAscBtn.addEventListener('click', sortTableAscending);
