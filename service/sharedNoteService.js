const sharedNoteRepository = require('../repositories/sharedNoteRepository');

const logger = require('../utils/logger/logger')
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });


async function getSharedNoteFromNoteId(noteId, userId, sharedUserId) {
    try {
        const sharedNote = await sharedNoteRepository.getSharedNoteFromNoteId(noteId, userId, sharedUserId);
        logger.info('Get Shared Note from NoteId: ', noteId);
        return sharedNote;
    } catch (error) {
        throw error;
    }
}

async function shareNote(noteId, userId, sharingUserEmail) {
    try {
        const response = await sharedNoteRepository.shareNote(noteId, userId, sharingUserEmail);
        logger.info('Sharing Note for Email: ', sharingUserEmail);
        return response;
    } catch (error) {
        logger.info('Error Sharing Note: ', error.message);
        throw error;
    }
}

async function removeSharingNote(noteId, userId, sharingUserId) {
    try {
        const removeSharing = await sharedNoteRepository.removeSharingNote(noteId, userId, sharingUserId);
        logger.info('Sharing Removed for User: ', sharingUserId);
        return removeSharing;
    } catch (error) {
        logger.error('Error in Removing Note Share: ', error.message);
        throw error;
    }
}

module.exports = {
    getSharedNoteFromNoteId,
    shareNote,
    removeSharingNote
}
