const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');


//Route 1: fetching all notes user data :get "/api/notes/fetchallnotes" :login required
router.get('/fetchallnotes', fetchUser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    }
    // catch if error has occured
    catch (error) {
        res.status(500).send("Internal error has occured");
    }

})

//Route 2: creating notes for user :Post "/api/notes/createnotes" :login required
router.post('/createnotes', fetchUser, [
    body('title', 'Enter  valid title').isLength({ min: 3 }),
    body('description', 'Enter a valid description').isLength({ min: 5 })
], async (req, res) => {

    try {

        // destructuring of notes
        const { title, description, tag } = req.body;


        // if there are errors then return bad requests
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // create a new note to database
        const note = new Note({
            title, description, tag, user: req.user.id
        });

        const saveNotes = await note.save();

        res.json(saveNotes);
    }
    // catch if error has occured
    catch (error) {
        res.status(500).send("Internal error has occured");
    }
})

//Route 3: updating notes for user :Put "/api/notes/updatenotes" :login required
router.put('/updatenotes/:id', fetchUser, async (req, res) => {

    try {

        const { title, description, tag } = req.body;

        // create a newNote object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });

    }
    // catch if error has occured
    catch (error) {
        res.status(500).send("Internal error has occured");
    }
})

//Route 4: Deleting notes for user :delete "/api/notes/deletenotes" :login required
router.delete('/deletenotes/:id', fetchUser, async (req, res) => {
    try {
        // find the note to be deleted and delete it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not found") }

        // allow deletion if user owns the note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Successfully note has been deleted", note: note });
    }
    // catch if error has occured
    catch (error) {
        res.status(500).send("Internal error has occured");
    }
})


module.exports = router;