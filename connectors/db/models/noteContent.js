const { DataTypes } = require('sequelize');


const NoteContentModel = (sequelize) => {
    const NoteContent = sequelize.define('NoteContent', {
        note_content_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_note_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        version_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        multimedia: {
            type: DataTypes.STRING(255),
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
        tableName: 'note_contents',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });

    NoteContent.associate = (models) => {
        NoteContent.belongsTo(models.UserNote, { foreignKey: 'user_note_id' }); // Correct association for UserNote
    };

    return NoteContent;
};

module.exports = NoteContentModel;
