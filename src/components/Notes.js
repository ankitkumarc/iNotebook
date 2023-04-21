import React, { useContext, useEffect, useRef, useState } from 'react'
import noteContext from '../context/notes/noteContext'
import { useNavigate } from 'react-router-dom'
import Noteitem from './Noteitem';
import Addnote from './Addnote';

const Notes = (props) => {
    let navigate = useNavigate();
    const context = useContext(noteContext);
    const { notes, getNote, editNote } = context;
    useEffect(() => {
        if (localStorage.getItem('token')) {
            getNote();
        }
        else {
            navigate("/login");
        }
        // eslint-disable-next-line
    }, [])
    const ref = useRef(null);
    const refClose = useRef(null);
    const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "" })

    const [myStyle, setMyStyle] = useState({
        color: 'black',
        backgroundColor: 'white',
        border: '2px solid black'
    })

    const updateNote = (currentNote) => {
        ref.current.click();
        setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag })
    }
    const handleClick = (e) => {
        editNote(note.id, note.etitle, note.edescription, note.etag)
        refClose.current.click();
        props.showAlert("Note Deleted Successfully!!!", "success");
    };
    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    };




    return (
        <>
            <Addnote showAlert={props.showAlert} mode={props.mode} toggle={props.toggle} />
            <div className="container" style={{ color: props.mode === 'dark' ? 'white' : '#230554' }} >
                <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Launch demo modal
                </button>


                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
                    <div className="modal-dialog">
                        <div className="modal-content" >
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel" style={myStyle}>Edit note</h1>
                            </div>
                            <div className="modal-body">
                                <form className="container my-3">
                                    <div className="mb-3">
                                        <label htmlFor="etitle" className="form-label"  >Title</label>
                                        <input type="text" className="form-control" id="etitle" name="etitle" value={note.etitle} aria-describedby="titleHelp" onChange={onChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="edescription" className="form-label">Description</label>
                                        <input type="text" className="form-control" id="edescription" name="edescription" value={note.edescription} onChange={onChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="etag">Tag</label>
                                        <input type="text" className="form-control" id="etag" name="etag" value={note.etag} onChange={onChange} />
                                    </div>
                                </form >
                            </div>
                            <div className="modal-footer" >
                                <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button disabled={note.etitle.length < 5 || note.edescription.length < 5} onClick={handleClick} type="button" className="btn btn-primary">Update Note</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row-my-3" style={{ color: props.mode === 'dark' ? 'white' : '#230554' }}>
                    <h2>Your Notes</h2>
                    <div className='container my-3 mx-3'>
                        {(notes.length === 0) && 'Create Your Notes Now'}
                    </div>
                    {notes.map((notes) => {
                        return <Noteitem key={notes._id} updateNote={updateNote} showAlert={props.showAlert} note={notes} />
                    })}
                </div>
            </div>
        </>)
}

export default Notes