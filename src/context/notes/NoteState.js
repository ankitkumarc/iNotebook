import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
    const host = "http://localhost:5000/"
    const notesInitial = []

    const [notes, setNotes] = useState(notesInitial);

    // Get all notes
    const getNote = async () => {

        // API call
        const response = await fetch(`${host}api/notes/fetchallnotes`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            }
        });
        const json = await response.json();
        console.log(json);
        // pushing note to array
        setNotes(json);
    }

    // Add a note
    const addNote = async (title, description, tag) => {

        // API call
        const response = await fetch(`${host}api/notes/createnotes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({ title, description, tag }),
        });

        // Logic to addNote
        const note = await response.json();

        // pushing note to array
        setNotes(notes.concat(note));
    }

    // Delete a note

    const deleteNote = async (id) => {
        // API call
        const response = await fetch(`${host}api/notes/deletenotes/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            }
        });
        const json = response.json();
        console.log(json);

        // logic to deletenote
        const newNotes = notes.filter((note) => { return note._id !== id })
        setNotes(newNotes)
    }
    // Edit a note
    const editNote = async (id, title, description, tag) => {

        // API call
        const response = await fetch(`${host}api/notes/updatenotes/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({ title, description, tag }),
        });
        const json = await response.json();
        console.log(json);

        let newNotes = await JSON.parse(JSON.stringify(notes))

        // Logic to edit notes
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if (element._id === id) {
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                break;
            }

        }
        setNotes(newNotes);
    }

    return (
        <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNote }}>
            {props.children}
        </NoteContext.Provider>

    );
}

export default NoteState;
