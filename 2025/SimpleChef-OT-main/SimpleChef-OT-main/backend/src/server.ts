import 'dotenv/config';
import { createApp } from "./app";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";

const PORT = process.env.PORT ?? 3000;

const app = createApp();

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const server = app.listen(PORT, () => {
	console.log(`API käynnissä portissa ${PORT}`);
});

// Log server errors
server.on("error", (err) => console.error("Server error:", err));