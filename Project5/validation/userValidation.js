// /validation/userValidation.js
const zod = require("zod");

const UserZodSchema = zod.object({
  name: zod.string().min(5, "Name must be at least 5 characters long"),
  email: zod.string().email("Invalid email format"),
  password: zod.string().min(6, "Password must be at least 6 characters long"),
});

module.exports = UserZodSchema;
