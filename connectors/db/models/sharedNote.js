const { DataTypes } = require('sequelize');

const SharedNoteModel = (sequelize) => {
    const SharedNote = sequelize.define('SharedNote', {
        shared_note_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        shared_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        user_note_id: {
            type: DataTypes.INTEGER,
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
        tableName: 'shared_notes',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });


    SharedNote.associate = (models) => {
        SharedNote.belongsTo(models.User, { foreignKey: 'user_id' });
        SharedNote.belongsTo(models.User, { foreignKey: 'shared_user_id' });
        SharedNote.belongsTo(models.UserNote, { foreignKey: 'user_note_id' });
    };

    return SharedNote;
};

module.exports = SharedNoteModel;
