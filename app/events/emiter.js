// create a unique, global symbol name
// -----------------------------------

const KEY = Symbol.for("dmt.eventEmiter");

// check if the global object has this symbol
// add it if it does not have the symbol, yet
// ------------------------------------------

var globalSymbols = Object.getOwnPropertySymbols(global);
var hasKey = (globalSymbols.indexOf(KEY) > -1);

const EventEmitter = require('events');
if (!hasKey){
  global[KEY] = new EventEmitter()
}

// define the singleton API
// ------------------------

var singleton = {};

Object.defineProperty(singleton, "instance", {
  get: function(){
    return global[KEY];
  }
});

// ensure the API is never changed
// -------------------------------

Object.freeze(singleton);

// export the singleton API only
// -----------------------------

module.exports = singleton;