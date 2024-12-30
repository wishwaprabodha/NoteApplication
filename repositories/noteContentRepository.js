const sequelize = require('../connectors/db/sequelize')

async function getNoteContentFromNoteId(noteId) {
    try {
        const sequelizeConnection = await sequelize.dbConnection();
        const note = await sequelizeConnection.noteContent.findAll({
            where: {
                user_note_id: noteId,
            },
            order: [['version_number', 'DESC']],
            limit: 1
        });
        if (!note) {
            return null;
        }
        return note;
    } catch (error) {
        throw new Error(error);
    }
}

async function createNoteContent(noteContentObject) {
    try {
        const sequelizeConnection = await sequelize.dbConnection();
        const noteContent = await sequelizeConnection.noteContent.create(noteContentObject);
        if (!noteContent) {
            return null;
        }
        return noteContent;
    } catch (error) {
        throw new Error(error);
    }
}

async function getPreviousNoteFromNoteId(noteId) {
    try {
        const sequelizeConnection = await sequelize.dbConnection();
        const notes = await sequelizeConnection.noteContent.findAll(
            {
                where: { user_note_id : noteId  },
                order: [['version_number', 'DESC']],
                limit: 2
            });
        if (!notes) {
            return null;
        }
        return notes.length < 2 ? notes[0] : notes[1];
    } catch (error) {
        throw new Error(error);
    }
}

async function getAllNoteRevisions(noteId) {
    try {
        const sequelizeConnection = await sequelize.dbConnection();
        const notes = await sequelizeConnection.noteContent.findAll({
            where: { user_note_id: noteId },
            attributes: ['note_content_id', 'title', 'content', 'multimedia', 'version_number', 'user_note_id'],
            raw: true
        });
        if (!notes) {
            return null;
        }
        return notes;
    } catch (error) {
        throw new Error(error);
    }
}

async function getSpecificNoteRevisions(noteId, version) {
    try {
        const sequelizeConnection = await sequelize.dbConnection();
        const notes = await sequelizeConnection.noteContent.findAll(
            {
                where: {
                    user_note_id : noteId,
                    version_number: version
                }
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
    getNoteContentFromNoteId,
    createNoteContent,
    getPreviousNoteFromNoteId,
    getAllNoteRevisions,
    getSpecificNoteRevisions
};