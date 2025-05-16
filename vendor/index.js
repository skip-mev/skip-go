// @ts-check

const path = require('path');

const protoDirs = [
  path.resolve(__dirname, '../node_modules/@protobufs/'),
  path.resolve(__dirname, 'cosmos-proto/proto'),
  path.resolve(__dirname, 'cosmos-sdk/proto'),
  path.resolve(__dirname, 'evmos/proto'),
  path.resolve(__dirname, 'noble-cctp/proto'),
  path.resolve(__dirname, '../local_vendor/initia/proto'),
  path.resolve(__dirname, '../local_vendor/OPinit/proto'),
  path.resolve(__dirname, '../local_vendor/secret/proto'),
];

module.exports = protoDirs;
