exports.sync = fn => (...args) => fn(...args).catch(args[2]);
exports.wait = ms => new Promise(fn => setTimeout(fn, ms));

const MB = 1024 * 1024;

exports.freem = print => {
  const mem = process.memoryUsage();
  print(`MEMORY rss: ${Math.floor(mem.rss / MB)}MB heap: ${Math.floor(mem.heapTotal / MB)}MB used: ${Math.floor(mem.heapUsed / MB)}MB`);
}