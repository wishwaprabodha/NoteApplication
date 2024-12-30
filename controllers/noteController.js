const noteService = require('../service/noteService');

async function create (req, res)  {
    try {
        const { title, content, multimedia } = req.body;
        const user_id = req.user.userId;
        const noteObject = {
            user_id,
            title, content, multimedia,
        }
        const note = await noteService.createNote(noteObject)
        if (note) {
            return res.status(201).json({ success: true, message: 'Note Created Successfully!' });
        }
    } catch (error) {
        res.status(400).json({ success: false, message: 'Note Creation Failed', error: error.message });
    }
}

async function getNote(req, res){
    try {
        const { noteId } = req.body;
        const userId = req.user.userId;
        const note = await noteService.getLatestNoteFromNoteId(noteId, userId)
        if (!note) {
            return res.status(400).json({ success: false, message: 'No Notes Found', data: null });
        }
        return res.status(200).json({ success: true, message: 'Note Found', data: { ...note } });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error Getting Note', error: error.message });
    }
}

async function getAllUserNotes(req, res) {
    try {
        const userId = req.user.userId;
        const notes = await noteService.getAllUserNotes(userId);
        if (!notes) {
            return res.status(400).json({ success: false, message: 'No Notes Found', data: null });
        }
        return res.status(200).json({ success: true, message: 'Notes Found', notes });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error Getting User Note', error: error.message });
    }
}


async function updateNote(req, res){
    try {
        const { noteId, title, content, multimedia } = req.body;
        const userId = req.user.userId;
        const noteObject = {
            userId, title, content, multimedia,
        }
        const noteUpdated = await noteService.updateNoteForNoteId(noteId, noteObject);
        if (noteUpdated) {
            return res.status(200).json({ success: true, message: 'note updated' });
        }
        return res.status(400).json({ success: false, message: 'note update failed' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Update Note Failed', error: error.message });
    }
}

async function deleteNote(req, res){
    try {
        const { noteId } = req.body;
        const userId = req.user.userId;
        const noteDeleted = await noteService.deleteNote(userId, noteId);
        if (noteDeleted) {
            return res.status(200).json({ success: true, message: 'note deleted' });
        }
        return res.status(400).json({ success: false, message: 'note deletion failed' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Delete Note Failed', error: error.message });
    }
}

async function getAllNoteRevisions(req, res){
    try {
        const { noteId } = req.body;
        const userId = req.user.userId;
        const notes = await noteService.getAllNoteRevisions(noteId, userId);
        if (notes) {
            return res.status(200).json({ success: true, message: 'notes fetched', notes });
        }
        return res.status(400).json({ success: false, message: 'note fetch failed' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Get Revision Notes Failed', error: error.message });
    }
}

async function revertToRevision(req, res){
    try {
        const version = parseInt(req.params.version);
        const noteId = parseInt(req.params.note_id);
        const userId = req.user.userId;
        const noteRevision = await noteService.getSpecificNoteRevisions(noteId, userId, version);
        const noteObject = {
            title: noteRevision.noteContent[0].title,
            content: noteRevision.noteContent[0].content,
            multimedia: noteRevision.noteContent[0].multimedia,
            version_number: noteRevision.noteContent[0].version_number + 1,
            userId
        }
        const newNote = await noteService.updateNoteForNoteId(noteId, noteObject)
        if (newNote) {
            return res.status(200).json({ success: true, message: `note revised to version: ${noteRevision.noteContent[0].version_number}` });
        }
        return res.status(400).json({ success: false, message: 'note revision failed' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Revision Note Failed', error: error.message });
    }
}

module.exports = {
    create,
    getNote,
    getAllUserNotes,
    updateNote,
    deleteNote,
    getAllNoteRevisions,
    revertToRevision
};
