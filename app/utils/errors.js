/*
This are the reported errors.
*/
module.exports = {
  // Use to report that everything was ok
  0: { code: 0, message: 'NO ERROR', htmlCode: 200 },
  // AUTHORIZATION ERRORS CODES STARTING WITH 1
  100: { code: 100, message: 'NOT AUTHORIZED', htmlCode: 401 },
  101: { code: 101, message: 'TOKEN EXPIRED', htmlCode: 401 },
  102: { code: 102, message: 'SQL INJECTION', htmlCode: 403 },
  // USER AUTHENTICATION ERRORS
  200: { code: 200, message: 'LOGIN FAILED', htmlCode: 401 },
  201: { code: 201, message: 'USER ALREADY EXISTS', htmlCode: 401 },
  202: { code: 202, message: 'USER DOESNT EXISTS', htmlCode: 404 },
  203: { code: 203, message: 'USER NOT ACTIVE', htmlCode: 401 },
  // DATABASE ERRORS
  300: { code: 300, message: 'DATABASE PROBLEM', htmlCode: 500 },
  301: { code: 301, message: 'FAIL IN AN EXTERNAL SERVICE', htmlCode: 500 },
  // LOGIC ERRORS
  400: { code: 400, message: 'MALFORMED REQUEST', htmlCode: 400 },
  401: { code: 401, message: 'EMPTY', htmlCode: 400 },
  402: { code: 402, message: 'NOT TYPE FILE SUPPORT', htmlCode: 400 },
  403: { code: 403, message: 'INSUFFICIENT PARAMETERS', htmlCode: 400 },
  404: { code: 404, message: 'SERVICE DOESNT EXISTS', htmlCode: 404 },
  405: { code: 405, message: 'PROTOCOL DOESNT SUPPORTED ON THIS CONTROLLER', htmlCode: 400 },
  406: { code: 406, message: 'FAIL IN AN INTERNAL SERVICE', htmlCode: 500 }
}
