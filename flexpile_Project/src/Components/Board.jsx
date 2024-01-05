import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { SiPinboard } from "react-icons/si";
import { RiPushpin2Fill, RiPushpin2Line } from "react-icons/ri";
import "../index.css";

function Board() {
  
  const [notes, setNotes] = useState([]);
  const [editableNoteId, setEditableNoteId] = useState(null);
  const [showAddNotePopup, setShowAddNotePopup] = useState(false);
  const [noteInput1, setNoteInput1] = useState("");

  // Constants for note dimensions
  const noteWidth = 150;
  const noteHeight = 160;

  // Function to handle displaying the add note popup
  const handleAddNote = () => {
    setShowAddNotePopup(true);
  };

  // Function to cancel adding a new note
  const handleCancelAddNote = () => {
    setShowAddNotePopup(false);
    setNoteInput1("");
  };

  // Function to add a new note
  const handlePostNote = () => {
    const newNote = {
      id: Date.now(),
      text: `${noteInput1} `,
      x: 0,
      y: 0,
      zIndex: notes.length + 1,
      pinned: false,
    };
    setNotes([...notes, newNote]);
    setShowAddNotePopup(false);
    setNoteInput1("");
  };

  // Function to delete a note from the board
  const handleDelete = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id)
    setNotes(updatedNotes)
  };

  // Function to initiate editing a note
  const handleEdit = (id) => {
    setEditableNoteId(id)
  };

  // Function to change the text content of a note
  const handleNoteChange = (e, id) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, text: e.target.value } : note
    );
    setNotes(updatedNotes)
  };

  // Function to start dragging a note
  const handleDragStart = (e, id) => {
    if (!notes.find((note) => note.id === id).pinned) {
      e.dataTransfer.setData("noteId", id);
      const draggedNoteIndex = notes.findIndex((note) => note.id === id);
      const draggedNote = { ...notes[draggedNoteIndex] };
      draggedNote.zIndex = notes.length + 1;
      const updatedNotes = [...notes];
      updatedNotes[draggedNoteIndex] = draggedNote;
      setNotes(updatedNotes);
    }
  };

  // Function to drop a note onto the board
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedNoteId = e.dataTransfer.getData("noteId");
    const droppedNoteIndex = notes.findIndex(
      (note) => note.id.toString() === droppedNoteId
    );
    const droppedNote = { ...notes[droppedNoteIndex] }
    const rect = e.currentTarget.getBoundingClientRect()
    let x = e.clientX - rect.left - noteWidth / 2
    let y = e.clientY - rect.top - noteHeight / 2

    x = Math.max(x, 0);
    y = Math.max(y, 0);
    x = Math.min(x, rect.width - noteWidth);
    y = Math.min(y, rect.height - noteHeight);

    droppedNote.x = x;
    droppedNote.y = y;
    droppedNote.zIndex = notes.length;
    const updatedNotes = [...notes];
    updatedNotes[droppedNoteIndex] = droppedNote;
    setNotes(updatedNotes);
  };

  // Function to pin or unpin a note
  const handlePinNote = (id) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, pinned: !note.pinned } : note
    );
    setNotes(updatedNotes);
  };

  return (
    <>
      <div
        className="board-container"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <h3 className="board-header">Board</h3>

        {/* Button to add a new note */}
        <button
          className="add-note-btn"
          onClick={handleAddNote}
          title="Add note"
        >
          + <span className="tooltip-text"></span>
        </button>

        {/* Add Note Popup */}
        {showAddNotePopup && (
          <div className="add-note-popup">
            <div className="popup-content">
              <input
                type="text"
                placeholder="Enter text 1"
                value={noteInput1}
                onChange={(e) => setNoteInput1(e.target.value)}
                className="input-style"
              />
              <button onClick={handlePostNote}>Post Note</button>
              <button onClick={handleCancelAddNote}>Cancel</button>
            </div>
          </div>
        )}

        <div className="note-container">
          {/* Render all notes */}
          {notes.map((note) => (
            <div
              className="note"
              key={note.id}
              style={{
                position: "absolute",
                top: note.y,
                left: note.x,
                zIndex: note.zIndex,
                width: noteWidth,
                height: noteHeight,
              }}
              draggable={!note.pinned}
              onDragStart={(e) => handleDragStart(e, note.id)}
            >
              {/* Render the note content or an input for editing */}
              {editableNoteId !== note.id && (
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(note.id)}
                >
                  <RxCross2 />
                </button>
              )}
              {editableNoteId === note.id ? (
                <input
                  type="text"
                  value={note.text}
                  onChange={(e) => handleNoteChange(e, note.id)}
                  onBlur={() => setEditableNoteId(null)}
                  autoFocus
                />
              ) : (
                <>
                  <p onClick={() => handleEdit(note.id)}>{note.text}</p>
                </>
              )}

              {/* Buttons for editing and pinning/unpinning */}
              {editableNoteId !== note.id && (
                <div className="edit-btn">
                  <button onClick={() => handleEdit(note.id)}>Edit</button>

                  {/* Conditional rendering for pin/unpin button */}
                  {!note.pinned ? (
                    <button onClick={() => handlePinNote(note.id)}>
                      <SiPinboard />
                    </button>
                  ) : (
                    <button onClick={() => handlePinNote(note.id)}>
                      {note.pinned ? <RiPushpin2Fill /> : <RiPushpin2Line />}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
export default Board

