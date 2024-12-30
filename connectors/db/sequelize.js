const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const logger = require('../../utils/logger/logger');

dotenv.config({ path: '.env' });

const userModel = require('./models/user');
const noteModel = require('./models/userNote');
const noteContentModel = require('./models/noteContent');
const sharedNotesModel = require('./models/sharedNote');


let connection;
let connectionObject = {};

async function createConnection() {
    const sequelize = new Sequelize(process.env.DATABASE, process.env.USERNAME, process.env.PASSWORD, {
        dialect: process.env.DIALECT,
        host: process.env.HOST
    });

    try {
        await sequelize.authenticate();

        const models = {
            User: userModel(sequelize),
            UserNote: noteModel(sequelize),
            NoteContent: noteContentModel(sequelize),
            SharedNote: sharedNotesModel(sequelize),
        };

        Object.values(models).forEach((model) => {
            if (model.associate) {
                model.associate(models);
            }
        });
        await sequelize.sync();

        logger.info('Sequelize Models Created!');
        connectionObject.user = models.User;
        connectionObject.note = models.UserNote;
        connectionObject.noteContent = models.NoteContent;
        connectionObject.sharedNote = models.SharedNote;
        connectionObject.connection = sequelize;
        logger.info('Connected to database via sequelize');
    } catch (error) {
        logger.error('Sequelize Authentication Failed', error);
    }
    return connectionObject;
}

async function dbConnection(){
    if (connection) {
        logger.info('Sequelize Existing Connection Found!');
        return connectionObject;
    }
    logger.info('Creating new Sequelize Connection!');
    return await createConnection();
}

module.exports = {
    dbConnection
};