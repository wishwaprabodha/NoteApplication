const {Op} = require("sequelize");
const noteService = require("../service/noteService");
const sequelize = require('../connectors/db/sequelize')


async function getSharedNoteFromNoteId(noteId, userId, sharedUserId) {
    try {
        const sequelizeConnection = await sequelize.dbConnection();
        const sharedNote = await sequelizeConnection.sharedNote.findAll({
            where: {
                user_note_id: noteId,
                user_id: userId,
                shared_user_id: sharedUserId,
                is_active: true
            }
        })
        if (!sharedNote) {
            return null;
        }
        return sharedNote;
    } catch (error) {
        throw new Error(error);
    }
}

async function shareNote(noteId, userId, sharingUserEmail) {
    try {
        let note;
        const sequelizeConnection = await sequelize.dbConnection();
        const sharingUser = await sequelizeConnection.user.findOne({
            where: {
                email: sharingUserEmail
            }
        })
        if (sharingUser) {
            const sharingNote = {
                user_id: userId, user_note_id: noteId, shared_user_id: sharingUser.user_id, is_active: true
            }
            note = await sequelizeConnection.sharedNote.create(sharingNote);
        }
        if (!note) {
            return null;
        }
        return note;
    } catch (error) {
        throw new Error(error);
    }
}

async function removeSharingNote(noteId, userId, sharingUserId) {
    try {
        let note;
        const sequelizeConnection = await sequelize.dbConnection();
        const sharingUser = await sequelizeConnection.user.findOne({
            where: {
                user_id: {
                    [Op.or]: {
                        [Op.eq]: userId, [Op.eq]: sharingUserId
                    }
                }
            }
        })
        if (sharingUser) {
            note = await sequelizeConnection.sharedNote.update({
                is_active: false
            }, {
                where: {
                    user_note_id: noteId
                }
            });
            if (!note) {
                return null;
            }
            return note;
        }
        return null;
    } catch (error) {
        throw new Error(error);
    }
}

async function updateSharedNote(noteId, sharingUserId, updateObject) {
    try {
        const sequelizeConnection = await sequelize.dbConnection();
        const sharingUser = await sequelizeConnection.sharedNote.findAll({
            where: {
                shared_user_id: sharingUserId, user_note_id: noteId
            }
        })
        if (sharingUser) {
            const updatedNote = await noteService.updateNoteForNoteId(noteId, updateObject);
            if (!updatedNote) {
                return null;
            }
            return updatedNote;
        }
        return null;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    getSharedNoteFromNoteId,
    shareNote,
    removeSharingNote,
    updateSharedNote
};