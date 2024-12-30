const { DataTypes } = require('sequelize');

const UserNoteModel = (sequelize) => {
    const UserNote = sequelize.define('UserNote', {
        user_note_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        latest_version: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'user_notes',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                name: 'idx_user_notes_title',
                fields: ['title']
            },
            {
                name: 'idx_user_notes_content',
                type: 'FULLTEXT',
                fields: ['content']
            },
            {
                name: 'idx_user_notes_user_id',
                fields: ['user_id']
            }
        ]
    });

    UserNote.associate = (models) => {
        UserNote.belongsTo(models.User, { foreignKey: 'user_id' });
        UserNote.hasMany(models.NoteContent, { foreignKey: 'user_note_id', onDelete: 'CASCADE' });
        UserNote.hasMany(models.SharedNote, { foreignKey: 'user_note_id', onDelete: 'CASCADE' });
    };

    return UserNote;
};

module.exports = UserNoteModel;