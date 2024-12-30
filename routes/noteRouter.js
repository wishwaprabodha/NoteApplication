const express = require('express');
const { create, getNote, getAllUserNotes, updateNote, deleteNote, revertToRevision, getAllNoteRevisions } = require('../controllers/noteController');
const { validateToken } = require('../middleware/authentication');

const router = express.Router();

router.post('/create', validateToken, create);
router.get('/revision/:note_id/:version', validateToken, revertToRevision);
router.get('/all', validateToken, getAllUserNotes);
router.get('/history', validateToken, getAllNoteRevisions);
router.get('/', validateToken, getNote);
router.put('/update-note', validateToken, updateNote);
router.delete('/delete-note', validateToken, deleteNote);

module.exports = router;
