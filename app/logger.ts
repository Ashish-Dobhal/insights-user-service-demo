var winston = require('winston');
let logger = new (winston.Logger)(
  {
    level:'debug',
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: 'somefile.log' })
    ]
  }) 

  export default  logger;