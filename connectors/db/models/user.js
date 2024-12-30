const { DataTypes } = require('sequelize');

const UserModel = (sequelize) => {
    const User = sequelize.define('User', {
        user_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        password_hash: {
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
        tableName: 'users',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });


    User.associate = (models) => {
        User.hasMany(models.UserNote, { foreignKey: 'user_id', onDelete: 'CASCADE' });
        User.hasMany(models.SharedNote, { foreignKey: 'user_id', onDelete: 'CASCADE' });
        User.hasMany(models.SharedNote, { foreignKey: 'shared_user_id', onDelete: 'CASCADE' });
    };

    return User;
};

module.exports = UserModel;
