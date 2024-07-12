import { Buffer } from 'buffer';

// Polyfill self for browser and global for Node.js
const globalObject = typeof self !== 'undefined' ? self : global;

Object.assign(globalObject, {
  process: process,
  Buffer: Buffer,
});
