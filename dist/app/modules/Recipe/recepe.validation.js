"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodRecipeSchema = void 0;
const zod_1 = require("zod");
exports.zodRecipeSchema = zod_1.z.object({
    recepe: zod_1.z.string({
        required_error: "Recipe  is required",
    }),
    title: zod_1.z.string({
        required_error: "Recipe title is required",
    }),
    category: zod_1.z.string({
        required_error: "Recipe category is required",
    }),
    image: zod_1.z.string({
        required_error: "Recipe Image is required",
    }),
});
