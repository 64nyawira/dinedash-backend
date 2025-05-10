"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const menu_router_1 = __importDefault(require("./router/menu.router"));
const userauth_router_1 = __importDefault(require("./router/userauth.router"));
const cart_router_1 = __importDefault(require("./router/cart.router"));
const order_router_1 = __importDefault(require("./router/order.router"));
const table_router_1 = __importDefault(require("./router/table.router"));
const reservation_router_1 = __importDefault(require("./router/reservation.router"));
const reward_router_1 = __importDefault(require("./router/reward.router"));
const loyalty_router_1 = __importDefault(require("./router/loyalty.router"));
const analytics_router_1 = __importDefault(require("./router/analytics.router"));
const inventory_router_1 = __importDefault(require("./router/inventory.router"));
const multiSupport_router_1 = __importDefault(require("./router/multiSupport.router"));
const payment_router_1 = __importDefault(require("./router/payment.router"));
const upload_router_1 = __importDefault(require("./router/upload.router"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const corsOptions = {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve uploaded files statically
const uploadsPath = path_1.default.join(__dirname, 'uploads');
app.use('/uploads', express_1.default.static(uploadsPath));
// API routes
app.use("/menu", menu_router_1.default);
app.use("/auth", userauth_router_1.default);
app.use("/upload", upload_router_1.default); // This should handle file uploads at /upload endpoint
app.use("/cart", cart_router_1.default);
app.use("/order", order_router_1.default);
app.use("/table", table_router_1.default);
app.use("/reservation", reservation_router_1.default);
app.use("/reward", reward_router_1.default);
app.use("/loyalty", loyalty_router_1.default);
app.use("/analytics", analytics_router_1.default);
app.use("/inventory", inventory_router_1.default);
app.use("/multiSupport", multiSupport_router_1.default);
app.use("/payment", payment_router_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'production' ? undefined : err.message
    });
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
