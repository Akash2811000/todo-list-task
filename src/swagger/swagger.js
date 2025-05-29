const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    version: "1.0.0",
    title: "TODO list",
  },
  host: "localhost:3000",
  basePath: "/",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    {
      name: "Todo",
      description: "Protected endpoints requiring authentication",
    },
  ],
  securityDefinitions: {
    Bearer: {
      type: "apiKey",
      name: "Authorization", // Changed from "token" to "Authorization"
      in: "header",
      description: "Enter JWT Bearer token in the format: Bearer <token>",
    },
  },
  definitions: {
    // Add your data models here
    User: {
      type: "object",
      properties: {
        id: { type: "string" },
        email: { type: "string" },
        name: { type: "string" },
      },
    },
    AuthResponse: {
      type: "object",
      properties: {
        token: { type: "string" },
        user: { $ref: "#/definitions/User" },
      },
    },
    ErrorResponse: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
  components: {},
};

// Generate swagger documentation
const outputFile = "./swagger.json";
const endpointsFiles = ["./src/app.ts"]; // Update with your main app file path

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log("Swagger documentation generated successfully!");
});
