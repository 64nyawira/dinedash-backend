"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const event_router_1 = __importDefault(require("./Router/event.router"));
const user_router_1 = __importDefault(require("./Router/user.router"));
const project_router_1 = __importDefault(require("./Router/project.router"));
const gallary_router_1 = __importDefault(require("./Router/gallary.router"));
const news_router_1 = __importDefault(require("./Router/news.router"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const corsOptions = {
    origin: 'http://localhost:55694',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json()); // or app.use(express.json())
app.use("/event", event_router_1.default);
app.use("/user", user_router_1.default);
app.use("/project", project_router_1.default);
app.use("/gallery", gallary_router_1.default);
app.use("/news", news_router_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
