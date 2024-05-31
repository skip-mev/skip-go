"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssetLists = exports.getChains = exports.getAssets = exports.getChain = void 0;
const assets_1 = require("./assets");
const chains_1 = require("./chains");
const types_1 = require("./types");
function raise(message) {
    throw new Error(message);
}
function getChain(chainId) {
    return chains_1.chainRecord[chainId] || raise(`chain '${chainId}' does not exist in chainRecord`);
}
exports.getChain = getChain;
function getAssets(chainId) {
    return assets_1.assetsRecord[chainId] || raise(`chain '${chainId}' does not exist in assetsRecord`);
}
exports.getAssets = getAssets;
function getChains() {
    return Object.values(chains_1.chainRecord);
}
exports.getChains = getChains;
function getAssetLists() {
    return types_1.chainIds.map((chainId) => ({
        chain_name: types_1.chainIdToName[chainId],
        assets: assets_1.assetsRecord[chainId],
    }));
}
exports.getAssetLists = getAssetLists;
__exportStar(require("./types"), exports);
