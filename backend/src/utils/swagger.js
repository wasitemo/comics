import swaggerJSDoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerOptions = {
  definition: {
    openapi: "3.0.4",
    info: {
      title: "Dokumentasi API Comics",
      version: "0.1.9",
      description:
        "PROTECTED => Wajib login, perlu Authorization: Bearer `token` pada header, PUBLIC => Tidak perlu login.",
    },
    servers: [
      {
        url: "https://comics-2mkb.onrender.com",
        description: "",
      },
    ],
  },
  apis: [path.join(__dirname, "../routes/**/*.js")],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
