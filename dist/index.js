"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_2 = require("./config/cors");
const arcjet_middleware_1 = __importDefault(require("./middlewares/arcjet.middleware"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const auth_router_1 = __importDefault(require("./routes/auth/auth.router"));
const machine_router_1 = __importDefault(require("./routes/master/machine.router"));
const color_router_1 = __importDefault(require("./routes/master/color.router"));
const size_router_1 = __importDefault(require("./routes/master/size.router"));
const material_router_1 = __importDefault(require("./routes/master/material.router"));
const kaos_kaki_router_1 = __importDefault(require("./routes/transaction/kaos_kaki.router"));
const order_router_1 = __importDefault(require("./routes/transaction/order.router"));
const stock_routes_1 = __importDefault(require("./routes/transaction/stock.routes"));
const app = (0, express_1.default)();
// Pasang CORS **sebelum** route lain
app.use((0, cors_1.default)(cors_2.corsOptions));
// Tangani preflight request untuk semua route
app.options("", (0, cors_1.default)(cors_2.corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
//cookie parser
app.use((0, cookie_parser_1.default)());
//arcjet middleware
app.use(arcjet_middleware_1.default);
//auth router
app.use("/api/v1/auth", auth_router_1.default);
//master router
app.use("/api/v1/machine", machine_router_1.default);
app.use("/api/v1/color", color_router_1.default);
app.use("/api/v1/size", size_router_1.default);
app.use("/api/v1/material", material_router_1.default);
//transaction router
app.use("/api/v1/kaos-kaki", kaos_kaki_router_1.default);
app.use("/api/v1/order", order_router_1.default);
app.use("/api/v1/stock", stock_routes_1.default);
app.use("/", async (req, res, next) => {
    const welcomeMessage = "Welcome To Website Kaos Kaki Management Backend";
    return res.status(200).json({
        success: true,
        message: welcomeMessage,
    });
});
//error handler middleware
app.use(error_middleware_1.default);
// handle 404 error
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404));
});
// app.listen(PORT, () =>
//   console.log(`[server]: Server is running at http://localhost:${PORT}`)
// );
exports.default = app;
// prompt tolong
// context:
// sebuah relational database utama kaos-kaki yang memiliki relasi
// 1.bahan = satu dari nilon atau spandek atau campuran
// 2. mesin = bisa lebih dari 1 yaitu ths,manula,yaushen
// 3.ukuran = bisa lebih dari 1 mulai dari ss hingga xxxl
// 4.variasi = bisa lebih dari 1 mulai dari putih polos,ptih 1/2 telapak,telapak hitam full,hitam ,dan warna custom
// 5. dari setiap kaos kaki yang terikat variasi terdapat gambar sampel
// saya ingin membuat sebuah sistem scalabel
// dari context diatas master nya berupa bahan,mesin,ukuran,variasi sedangkan gambar terikat pada kaos kaki dan variasi yang dimiliki
// tolong buatkan menggunakn express.js menggunakan typescript, auth jwt, drizzle orm, rate limiting, tolong buat scalabel
// fitur
// 1. crud dasar pada setiap tabel
// 2. struktur folder didalam src berupa config=konfigurasi file, controller,database = drizzle orm client, middlewares = auth middleware dan error handling middleware,  models = schema drizzle,repositories = layer data, routes,service= logika bisnis , types,utils
//# sourceMappingURL=index.js.map