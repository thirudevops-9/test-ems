"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = exports.optCache = void 0;
const express_1 = __importDefault(require("express"));
const node_cache_1 = __importDefault(require("node-cache"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const app_route_1 = __importDefault(require("./routes/app.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const dashboard_route_1 = __importDefault(require("./routes/dashboard.route"));
const timesheet_route_1 = __importDefault(require("./routes/timesheet.route"));
const profile_route_1 = __importDefault(require("./routes/profile.route"));
const project_route_1 = __importDefault(require("./routes/project.route"));
const manager_route_1 = __importDefault(require("./routes/manager.route"));
const buhead_route_1 = __importDefault(require("./routes/buhead.route"));
const hr_route_1 = __importDefault(require("./routes/hr.route"));
const master_route_1 = __importDefault(require("./routes/master.route"));
const cors_1 = __importDefault(require("cors"));
// const fileUpload = require('express-fileupload');
const express_fileupload_1 = __importDefault(require("express-fileupload"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
exports.optCache = new node_cache_1.default({ stdTTL: 300 }); // default TTL = 5 min
exports.transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: 'emsinfogen@gmail.com',
        pass: process.env.MAILER_PASS
    }
});
Object.defineProperty(BigInt.prototype, "toJSON", {
    get() {
        "use strict";
        return () => String(this);
    }
});
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use((0, express_fileupload_1.default)());
app.use('/api/', app_route_1.default);
app.use('/api/', auth_route_1.default);
app.use('/api/', dashboard_route_1.default);
app.use('/api/', timesheet_route_1.default);
app.use('/api/', profile_route_1.default);
app.use('/api/', project_route_1.default);
app.use('/api/', manager_route_1.default);
app.use('/api/', buhead_route_1.default);
app.use('/api/', hr_route_1.default);
app.use('/api/', master_route_1.default);
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
