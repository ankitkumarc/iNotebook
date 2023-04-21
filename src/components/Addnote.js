import React, { useContext, useState } from 'react'
import noteContext from '../context/notes/noteContext'

const Addnote = (props) => {
    const context = useContext(noteContext);
    const { addNote } = context;
    const [note, setNote] = useState({ "title": "", "description": "", "tag": "" })
    const handleClick = (e) => {
        e.preventDefault();
        addNote(note.title, note.description, note.tag);
        setNote({ "title": "", "description": "", "tag": "" });
        props.showAlert("Note Added Successfully!!!", "success")
    };
    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    };


    return (
        <div className='container my-3'>
            <h1>This is Home</h1>
            <form className="container my-3">
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" name="title" aria-describedby="titleHelp" value={note.title} onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="description" name="description" value={note.description} onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="tag">Tag</label>
                    <input type="text" className="form-control" name='tag' id="tag" value={note.tag} onChange={onChange} />

                </div>
                <button disabled={note.title.length < 5 || note.description.length < 5} type="submit" className="btn btn-primary" onClick={handleClick} >Add Note</button>
            </form >
        </div >
    )
}

export default Addnote
