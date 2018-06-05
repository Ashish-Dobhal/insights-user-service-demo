"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var winston = require('winston');
let logger = new (winston.Logger)({
    level: 'debug',
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'somefile.log' })
    ]
});
exports.default = logger;
//# sourceMappingURL=logger.js.map