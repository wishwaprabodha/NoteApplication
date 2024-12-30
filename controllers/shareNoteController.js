const shareNoteService = require('../service/sharedNoteService');

async function getSharedNoteFromNoteId (req, res)  {
    try {
        const userId = req.user.userId;
        const noteId = parseInt(req.params.user_note_id);
        const  sharedUserId  = parseInt(req.params.shared_user_id);
        const note = await shareNoteService.getSharedNoteFromNoteId(noteId, userId, sharedUserId);
        if (note) {
            return res.status(200).json({ success: true, message: 'Fetched Shared Note Successfully!' });
        }
        return res.status(400).json({ success: false, message: 'Shared Note Not Found!' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Fetching Shared Note Failed!', error: error.message });
    }
}

async function removeSharingNote(req, res){
    try {
        const { noteId, sharingUserId } = req.body;
        const userId = req.user.userId;
        const note = await shareNoteService.removeSharingNote(noteId, userId, sharingUserId);
        if (!note) {
            return res.status(400).json({ success: false, message: 'Shared Note Not Found!', data: null });
        }
        return res.status(200).json({ success: true, message: 'Remove Shared Note Successfully!', data: { ...note } });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error Removing Shared Note!', error: error.message });
    }
}

async function shareNote(req, res){
    try {
        const { noteId, sharingUserEmail } = req.body;
        const userId = req.user.userId;
        const note = await shareNoteService.shareNote(noteId, userId, sharingUserEmail);
        if (!note) {
            return res.status(400).json({ success: false, message: 'Shared Note Not Found!', data: null });
        }
        return res.status(200).json({ success: true, message: 'Shared Note Successfully!', data: { ...note } });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Error Sharing Note!', error: error.message });
    }
}

module.exports = {
    getSharedNoteFromNoteId,
    shareNote,
    removeSharingNote
}
