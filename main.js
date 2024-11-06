const addNoteBtn = document.querySelector(".add-note");
const saveNoteBtn = document.getElementById("save-note-btn");
const notesContainer = document.querySelector(".grid-container");
const modal = document.getElementById("modal");
const closeBtn = document.querySelector(".close-btn");
const noteTitle = document.getElementById("note-title");
const noteDescription = document.getElementById("note-description");
const countdown = document.getElementById("countdown");
let editNoteId = null;

// Function to get the current date in YYYY-MM-DD format
const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// Function to simulate asynchronous delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to load notes from localStorage
const loadNotes = async () => {
  await delay(1000); // Simulate a delay of 1 second
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");
  notesContainer.innerHTML = `
        <div class="grid-item add-note">
            <div class="plus-icon">+</div>
            <p>Add new note</p>
        </div>
        ${notes
          .map(
            (note) => `
            <div class="grid-item note-card" data-id="${note.id}">
                <h3 class="note-title">${note.title}</h3>
                <p class="note-description">${note.description}</p>
                <p class="date">${note.date}</p>
                <div class="action-buttons">
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                </div>
            </div>`
          )
          .join("")}
    `;

  // Reattach event listeners for adding, editing, and deleting notes
  document.querySelector(".add-note").addEventListener("click", openModal);
  document
    .querySelectorAll(".edit")
    .forEach((button) => button.addEventListener("click", openEditModal));
  document
    .querySelectorAll(".delete")
    .forEach((button) => button.addEventListener("click", deleteNote));
};

// Function to save or update note to localStorage
const saveNote = async () => {
  const title = noteTitle.value;
  const description = noteDescription.value;
  if (title.trim() === "" || description.trim() === "") {
    alert("Both title and description are required!");
    return;
  }
  noteTitle.value = ""; // Clear the input fields
  noteDescription.value = "";
  closeModal(); // Close the modal

  // Check if we are editing an existing note
  if (editNoteId) {
    let notes = JSON.parse(localStorage.getItem("notes") || "[]");
    notes = notes.map((note) =>
      note.id === editNoteId ? { ...note, title, description } : note
    );
    localStorage.setItem("notes", JSON.stringify(notes));
    editNoteId = null;
    loadNotes(); // Refresh the displayed notes
  } else {
    // Add new note with a countdown
    let countdownValue = 5;
    countdown.textContent = countdownValue;
    countdown.style.display = "block";

    while (countdownValue > 0) {
      await delay(1000); // Wait for 1 second
      countdownValue--;
      countdown.textContent = countdownValue;
    }

    countdown.style.display = "none"; // Hide the countdown

    let notes = JSON.parse(localStorage.getItem("notes") || "[]");
    const id = Date.now(); // Use current timestamp as unique ID
    notes.push({ id, title, description, date: getCurrentDate() });
    localStorage.setItem("notes", JSON.stringify(notes));
    loadNotes(); // Refresh the displayed notes
  }
};

// Function to open the modal for adding a new note
const openModal = () => {
  modal.style.display = "block";
  editNoteId = null; // Reset the edit note ID
};

// Function to open the modal for editing an existing note
const openEditModal = (event) => {
  const noteCard = event.target.closest(".note-card");
  const noteId = parseInt(noteCard.getAttribute("data-id"), 10);
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");
  const note = notes.find((note) => note.id === noteId);
  noteTitle.value = note.title;
  noteDescription.value = note.description;
  modal.style.display = "block";
  editNoteId = noteId;
};

// Function to delete a note from localStorage
const deleteNote = (event) => {
  const noteCard = event.target.closest(".note-card");
  const noteId = parseInt(noteCard.getAttribute("data-id"), 10);
  let notes = JSON.parse(localStorage.getItem("notes") || "[]");
  notes = notes.filter((note) => note.id !== noteId);
  localStorage.setItem("notes", JSON.stringify(notes));
  loadNotes(); // Refresh the displayed notes
};

// Function to close the modal
const closeModal = () => {
  modal.style.display = "none";
};

// Event listener for the save button
saveNoteBtn.addEventListener("click", saveNote);

// Event listener to close the modal
closeBtn.addEventListener("click", closeModal);

// Close the modal if the user clicks outside the modal content
window.addEventListener("click", function (event) {
  if (event.target === modal) {
    closeModal();
  }
});

// Load notes when the page loads
window.addEventListener("load", loadNotes);
