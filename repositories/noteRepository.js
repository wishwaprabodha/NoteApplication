const sequelize = require('../connectors/db/sequelize')
const { Sequelize } = require('sequelize');

async function getNoteFromNoteId(noteId, userId) {
    try {
        const sequelizeConnection = await sequelize.dbConnection();
        const note = await sequelizeConnection.note.findAll({
            where: {
                user_note_id: noteId,
                user_id: userId
            }
        });
        if (!note) {
            return null;
        }
        return note;
    } catch (error) {
        throw new Error(error);
    }
}

async function getNotesFromUserId(userid) {
    try {
        const sequelizeConnection = await sequelize.dbConnection();
        const note = await sequelizeConnection.note.findAll({
            where: { user_id: userid }
        });
        if (!note) {
            return null;
        }
        return note;
    } catch (error) {
        throw new Error(error);
    }
}

async function createNote(noteObject) {
    try {
        const sequelizeConnection = await sequelize.dbConnection();
        const note = await sequelizeConnection.note.create(noteObject);
        if (!note) {
            return null;
        }
        return note;
    } catch (error) {
        throw new Error(error);
    }
}

async function updateNoteByNoteId(noteId, userId, data) {
    try {
        const updateObject = data;
        const sequelizeConnection = await sequelize.dbConnection();
        if (data.is_deleted) {
            updateObject.latest_version = Sequelize.literal('latest_version + 1')
        }
        const [note] = await sequelizeConnection.note.update(
            updateObject, {
            where: {
                user_note_id : noteId,
                user_id: userId
            }
        });
        if (!note) {
            return null;
        }
        return note;
    } catch (error) {
        throw new Error(error);
    }
}

async function getLatestCompleteNoteFromNoteId(noteId, userId) {
    try {
        const sequelizeConnection = await sequelize.dbConnection();
        const note = await sequelizeConnection.note.findOne({
            include: [
                {
                    model: sequelizeConnection.noteContent,
                    where: { user_note_id: noteId, is_deleted: false },
                    order: [['version_number', 'DESC']],
                    limit: 1
                }
            ],
            where: {
                user_note_id: noteId,
                user_id: userId
            }
        });
        if (!note) {
            return null;
        }
        return note;
    } catch (error) {
        throw new Error(error);
    }
}

async function getAllUserNotes(userId) {
    try {
        const sequelizeConnection = await sequelize.dbConnection();
        const notes = await sequelizeConnection.note.findAll({
            include: [
                {
                    model: sequelizeConnection.noteContent,
                    required: true,
                    attributes: ['note_content_id', 'title', 'content', 'multimedia', 'version_number'],
                    where: {
                        version_number: Sequelize.col('UserNote.latest_version')
                    },
                }
            ],
            where: {
                user_id: userId,
                is_deleted: false,
            },
            attributes: ['user_note_id', 'user_id', 'latest_version', 'is_deleted', 'created_at', 'updated_at']
        });

        if (!notes) {
            return null;
        }
        return notes;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    getNoteFromNoteId,
    getNotesFromUserId,
    createNote,
    updateNoteByNoteId,
    getLatestCompleteNoteFromNoteId,
    getAllUserNotes
};