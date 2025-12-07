"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnections = void 0;
const getConnections = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // In the future, this will fetch the user's connections from the database
    const connections = {
        nodes: [
            { id: 'User', group: 'user' },
            { id: 'Connection 1', group: 'connection' },
            { id: 'Connection 2', group: 'connection' },
            { id: 'Connection 3', group: 'connection' },
        ],
        links: [
            { source: 'User', target: 'Connection 1' },
            { source: 'User', target: 'Connection 2' },
            { source: 'User', target: 'Connection 3' },
        ],
    };
    res.json(connections);
});
exports.getConnections = getConnections;
