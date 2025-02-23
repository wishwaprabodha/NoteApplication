const { getRedisClient, invalidateCache } = require('../connectors/cache/redis');
const noteRepository = require('../repositories/noteRepository');
const noteContentRepository = require('../repositories/noteContentRepository');
const logger = require('../utils/logger/logger')
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });


async function getLatestNoteFromNoteId(noteId, userId) {
    try {
        const userNote = await noteRepository.getLatestCompleteNoteFromNoteId(noteId, userId);
        logger.info('Get Latest Note from NoteId: ', noteId);
        return userNote;
    } catch (error) {
        throw error;
    }
}

async function getAllUserNotes(userId) {
    try {
        const redisClient = getRedisClient();
        const cacheKey = `user_notes_${userId}`;
        const cachedNotes = await redisClient.get(cacheKey);
        if (cachedNotes) {
            logger.info(`Cache hit for UserId: ${userId}`);
            return JSON.parse(cachedNotes);
        }
        const response = await noteRepository.getAllUserNotes(userId);
        if (response && response.length > 0) {
            await redisClient.set(cacheKey, JSON.stringify(response), 'EX', process.env.CACHE_EXPIRATION);
            logger.info(`Cache miss. Data fetched from DB and cached for UserId: ${userId}`);
        }
        logger.info('Get All User Notes for UserId: ', userId);
        return response;
    } catch (error) {
        logger.info('Error fetching User Notes: ', error.message);
        throw error;
    }
}

async function createNote(note) {
    try {
        const noteObject = {
            user_id: note.user_id,
            latest_version: 1,
            is_deleted: false,
        }
        const insertedNote = await noteRepository.createNote(noteObject);
        const cacheKey = `user_notes_${note.user_id}`;
        await invalidateCache(cacheKey);
        let insertedNoteContent;
        const noteContentObject = {}
        if (insertedNote) {
            noteContentObject.user_note_id = insertedNote.user_note_id;
            noteContentObject.title = note.title;
            noteContentObject.version_number = 1;
            noteContentObject.content = note.content;
            noteContentObject.multimedia = note.multimedia;
            insertedNoteContent = await noteContentRepository.createNoteContent(noteContentObject);
        } else {
            const error = 'User Note Creation Failed';
            logger.error(error);
            throw new Error(error);
        }
        if (!insertedNoteContent) {
            const error = 'Note Content Creation Failed';
            logger.error(error);
            throw new Error(error);
        }
        return insertedNoteContent;
    } catch (error) {
        logger.error('Error in User Creation: ', error.message);
        throw error;
    }
}

async function updateNoteForNoteId(noteId, updateObject) {
    try {
        const note = await noteRepository.getNoteFromNoteId(noteId, updateObject.userId);
        if (!note) {
            const error = `Note not found NoteId: ${noteId}`;
            logger.error(error);
            throw new Error(error);
        }
        const [lastNoteContent] = await noteContentRepository.getNoteContentFromNoteId(noteId)
        const noteContentObject = updateObject;
        noteContentObject.version_number = note.latest_version + 1;
        noteContentObject.user_note_id = noteId
        noteContentObject.title = noteContentObject.title || lastNoteContent.title;
        noteContentObject.content = noteContentObject.content || lastNoteContent.content;
        noteContentObject.multimedia = noteContentObject.multimedia || lastNoteContent.multimedia;
        const noteContent = await noteContentRepository.createNoteContent(noteContentObject);
        const updatedNote = await noteRepository.updateNoteByNoteId(noteId, updateObject.userId, { latest_version: noteContentObject.version_number });
        const cacheKey = `user_notes_${updateObject.userId}`;
        await invalidateCache(cacheKey);
        logger.info('Note Updated on NoteId: ', noteId);
        noteContent.updated = updatedNote
        return noteContent;
    } catch (error) {
        logger.info('Error in Note Update: ', error.message);
        throw error;
    }
}

async function deleteNote(userId, noteId) {
    try {
        const deletedNote = await noteRepository.updateNoteByNoteId(noteId, userId, { is_deleted: true });
        const cacheKey = `user_notes_${userId}`;
        await invalidateCache(cacheKey);
        return deletedNote;
    } catch (error) {
        throw error;
    }
}

async function getPreviousNoteContentForNoteId(noteId) {
    try {
        return await noteContentRepository.getPreviousNoteFromNoteId(noteId);
    } catch (error) {
        throw error;
    }
}

async function getAllNoteRevisions(noteId, userId) {
    try {
        const noteContent = await noteContentRepository.getAllNoteRevisions(noteId);
        const note = await noteRepository.getNoteFromNoteId(noteContent[0].user_note_id, userId);
        if (note) {
            return { note, noteContent };
        }
        return null
    } catch (error) {
        throw error;
    }
}

async function getSpecificNoteRevisions(noteId, userId, version) {
    try {
        const noteContent = await noteContentRepository.getSpecificNoteRevisions(noteId, version);
        const note = await noteRepository.getNoteFromNoteId(noteContent[0].user_note_id, userId);
        if (note) {
            return { note, noteContent };
        }
        return null
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getLatestNoteFromNoteId,
    getAllUserNotes,
    createNote,
    updateNoteForNoteId,
    deleteNote,
    getPreviousNoteContentForNoteId,
    getAllNoteRevisions,
    getSpecificNoteRevisions
}
