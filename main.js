const addNoteBtn = document.querySelector('.add-note');
const saveNoteBtn = document.getElementById('save-note-btn');
const notesContainer = document.querySelector('.grid-container');
const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close-btn');
const noteTitle = document.getElementById('note-title');
const noteDescription = document.getElementById('note-description');
const countdown = document.createElement('div'); 

countdown.id = 'countdown';
countdown.className = 'countdown';
countdown.textContent = '';
document.body.appendChild(countdown); 

let editNoteId = null;


const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


const loadNotes = async () => {
    await delay(1000); 
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    notesContainer.innerHTML = `
        <div class="grid-item add-note">
            <div class="plus-icon">+</div>
            <p>Add new note</p>
        </div>
        ${notes.map(note => `
            <div class="grid-item note-card" data-id="${note.id}">
                <h3 class="note-title">${note.title}</h3>
                <p class="note-description">${note.description}</p>
                <p class="date">${note.date}</p>
                <div class="action-buttons">
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                </div>
            </div>`).join('')}
    `;

    document.querySelector('.add-note').addEventListener('click', openModal);
    document.querySelectorAll('.edit').forEach(button => button.addEventListener('click', openEditModal));
    document.querySelectorAll('.delete').forEach(button => button.addEventListener('click', deleteNote));
};


const saveNote = async () => {
    const title = noteTitle.value;
    const description = noteDescription.value;
    if (title.trim() === '' || description.trim() === '') {
        alert('Both title and description are required!');
        return;
    }
    noteTitle.value = '';
    noteDescription.value = '';
    closeModal(); 

    if (editNoteId) {
        let notes = JSON.parse(localStorage.getItem('notes') || '[]');
        notes = notes.map(note => note.id === editNoteId ? { ...note, title, description } : note);
        localStorage.setItem('notes', JSON.stringify(notes));
        editNoteId = null;
        loadNotes(); 
    } else {
        let countdownValue = 5;
        countdown.textContent = `Wait ${countdownValue}s`;
        countdown.style.display = 'block';

        while (countdownValue > 0) {
            await delay(1000); 
            countdownValue--;
            countdown.textContent = `Wait ${countdownValue}s`;
        }

        countdown.style.display = 'none';

        let notes = JSON.parse(localStorage.getItem('notes') || '[]');
        const id = Date.now(); 
        notes.push({ id, title, description, date: getCurrentDate() });
        localStorage.setItem('notes', JSON.stringify(notes));
        loadNotes(); 
    }
};

const openModal = () => {
    modal.style.display = 'block';
    editNoteId = null;
};

const openEditModal = (event) => {
    const noteCard = event.target.closest('.note-card');
    const noteId = parseInt(noteCard.getAttribute('data-id'), 10);
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const note = notes.find(note => note.id === noteId);
    noteTitle.value = note.title;
    noteDescription.value = note.description;
    modal.style.display = 'block';
    editNoteId = noteId;
};

const deleteNote = (event) => {
    const noteCard = event.target.closest('.note-card');
    const noteId = parseInt(noteCard.getAttribute('data-id'), 10);
    let notes = JSON.parse(localStorage.getItem('notes') || '[]');
    notes = notes.filter(note => note.id !== noteId);
    localStorage.setItem('notes', JSON.stringify(notes));
    loadNotes(); 
};


const closeModal = () => {
    modal.style.display = 'none';
};


saveNoteBtn.addEventListener('click', saveNote);


closeBtn.addEventListener('click', closeModal);


window.addEventListener('click', function(event) {
    if (event.target === modal) {
        closeModal();
    }
});


window.addEventListener('load', loadNotes);
