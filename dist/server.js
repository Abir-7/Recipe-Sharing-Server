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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./app/config");
const seedSuperAdmin_1 = __importDefault(require("./app/DB/seedSuperAdmin"));
let server;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect(config_1.config.mongoUri);
        yield (0, seedSuperAdmin_1.default)();
        server = app_1.default.listen(Number(config_1.config.port), () => {
            console.log(`Example app listening on port ${config_1.config.port}`);
        });
    });
}
main().catch((err) => console.log(err));
process.on("unhandledRejection", () => {
    console.log("Unhandled Rejection is detected!!");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
});
process.on("uncaughtException", () => {
    console.log("Uncaught Exception is detected!!");
    process.exit(1);
});
