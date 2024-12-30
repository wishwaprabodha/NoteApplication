const express = require('express');
const { shareNote, getSharedNoteFromNoteId, removeSharingNote } = require('../controllers/shareNoteController');
const { validateToken } = require('../middleware/authentication');

const router = express.Router();

router.post('/share', validateToken, shareNote);
router.post('/remove-share', validateToken, removeSharingNote);
router.get('/:user_note_id/:shared_user_id', validateToken, getSharedNoteFromNoteId);


module.exports = router;
