const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

let loggerLib

function logger() {
    if (loggerLib) {
        return loggerLib;
    }
    loggerLib = winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message }) => {
                return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
            })),
        defaultMeta: { service: 'note-app' },
        transports: [
            new winston.transports.Console({
                level: 'info',
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
                )
            }),
            new winston.transports.File({ filename: 'error.log', level: 'error' }),
            new winston.transports.File({ filename: 'out.log' }),
        ],
    });

    loggerLib.add(
            new DailyRotateFile({
                filename: 'logs/application-%DATE%.log',
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '7d',
        })
    );
    return loggerLib;
}

module.exports = logger();



