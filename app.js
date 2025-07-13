import { Task } from './task.js';

let tareas = [];
let currentFilter = 'all';
let taskIdCounter = 1;

// Elemento del DOM
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const filterAllBtn = document.getElementById('filterAll');
const filterCompletedBtn = document.getElementById('filterCompleted');
const filterPendingBtn = document.getElementById('filterPending');

// Eliminar tarea
function eliminarTarea(taskId) {
    tareas = tareas.filter(t => t.id !== taskId);
    mostrarTareas();
}

// Cambiar estado de completado
function toggleTarea(id) {
    const tarea = tareas.find(t => t.id === id);
    if (tarea) {
        tarea.toggleCompleted();
        mostrarTareas();
    }
}

// Filtrar tareas
function filtrarTareas(completadas) {
    return tareas.filter(t => t.completed === completadas);
}

// Mostrar tareas en el DOM
function mostrarTareas() {
    taskList.innerHTML = '';

    let tareasFiltradas = tareas;

    if (currentFilter === 'completed') {
        tareasFiltradas = filtrarTareas(true);
    } else if (currentFilter === 'pending') {
        tareasFiltradas = filtrarTareas(false);
    }

    // Actualizar botones de filtro
    updateFilterButtons();

    if (tareasFiltradas.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.textContent = currentFilter === 'all' ? 
            'No tienes tareas aún. ¡Agrega una nueva!' : 
            currentFilter === 'completed' ? 
            'No hay tareas completadas' : 
            'No hay tareas pendientes';
        taskList.appendChild(emptyState);
        return;
    }

    tareasFiltradas.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';

        // Contenedor del contenido de la tarea
        const taskContent = document.createElement('div');
        taskContent.className = 'task-content';

        // Checkbox personalizado
        const checkbox = document.createElement('div');
        checkbox.className = `task-checkbox ${task.completed ? 'checked' : ''}`;
        checkbox.addEventListener('click', () => toggleTarea(task.id));

        // Texto de la tarea
        const taskText = document.createElement('span');
        taskText.className = `task-text ${task.completed ? 'completed' : ''}`;
        taskText.textContent = task.name;

        // Contenedor de acciones
        const taskActions = document.createElement('div');
        taskActions.className = 'task-actions';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.addEventListener('click', () => eliminarTarea(task.id));

        // Ensamblar elementos
        taskContent.appendChild(checkbox);
        taskContent.appendChild(taskText);
        taskActions.appendChild(deleteBtn);
        li.appendChild(taskContent);
        li.appendChild(taskActions);
        taskList.appendChild(li);
    });
}

// Actualizar estado visual de los botones de filtro
function updateFilterButtons() {
    const buttons = [filterAllBtn, filterCompletedBtn, filterPendingBtn];
    buttons.forEach(btn => btn.classList.remove('active'));
    
    if (currentFilter === 'all') {
        filterAllBtn.classList.add('active');
    } else if (currentFilter === 'completed') {
        filterCompletedBtn.classList.add('active');
    } else if (currentFilter === 'pending') {
        filterPendingBtn.classList.add('active');
    }
}

// Agregar tarea con limpieza de input
function agregarTarea(taskName) {
    if (taskName.trim() === '') return;
    const nuevaTarea = new Task(taskIdCounter++, taskName.trim());
    tareas.push(nuevaTarea);
    taskInput.value = ''; // Limpiar input
    mostrarTareas();
}

// Eventos
addTaskBtn.addEventListener('click', () => agregarTarea(taskInput.value));
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') agregarTarea(taskInput.value);
});

filterAllBtn.addEventListener('click', () => {
    currentFilter = 'all';
    mostrarTareas();
});
filterCompletedBtn.addEventListener('click', () => {
    currentFilter = 'completed';
    mostrarTareas();
});
filterPendingBtn.addEventListener('click', () => {
    currentFilter = 'pending';
    mostrarTareas();
});

// Variable de estado inicial
mostrarTareas();
