import swaggerJSDoc from "swagger-jsdoc";
import { components, tags } from "./docs/components";

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "MasterChief Mikkeli API",
			version: "1.0.0",
			description: "Reseptien CRUD API dokumentoitu Swaggerilla",
		},
		components: components,
		tags: tags,
	},
	apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
