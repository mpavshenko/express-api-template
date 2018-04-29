exports.sync = fn => (...args) => fn(...args).catch(args[2]);
exports.wait = ms => new Promise(fn => setTimeout(fn, ms));