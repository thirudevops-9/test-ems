"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.managerTasksToday = exports.calendarOverview = exports.monthOverview = exports.weeklyTasks = exports.dailyLog = void 0;
const Helpers_1 = require("../common/Helpers");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const prisma_1 = __importDefault(require("../../prisma"));
const Helpers_2 = require("../common/Helpers");
const dailyLog = async (req, res) => {
    try {
        const { userId, userRole } = req.body.user;
        const { startOfDayUTC, endOfDayUTC } = Helpers_1.Helpers.getTodayStartEnd();
        const dailyTasks = await prisma_1.default.timesheet.findMany({
            where: {
                employeeId: userId,
                date: {
                    gte: startOfDayUTC,
                    lte: endOfDayUTC
                }
            },
            orderBy: {
                date: 'desc'
            }
        });
        return Helpers_1.Helpers.successResponse(200, dailyTasks, res);
    }
    catch (err) {
        console.error('dailyLog error:', err);
        return Helpers_1.Helpers.errorResponse(500, res, "Error occurred");
    }
};
exports.dailyLog = dailyLog;
const weeklyTasks = async (req, res) => {
    try {
        const { userId, userRole } = req.body;
        const { startOfWeekUTC, endOfWeekUTC } = Helpers_1.Helpers.getThisWeekStartEnd();
        const weeklyTasksVerifiedData = await prisma_1.default.timesheet.aggregate({
            where: {
                employeeId: userId,
                verifiedStatus: 1,
                date: {
                    gte: startOfWeekUTC,
                    lte: endOfWeekUTC
                }
            },
            _count: {
                id: true
            },
            orderBy: {
                date: 'desc'
            }
        });
        const weeklyTasksUnverifiedData = await prisma_1.default.timesheet.aggregate({
            where: {
                employeeId: userId,
                verifiedStatus: 0,
                date: {
                    gte: startOfWeekUTC,
                    lte: endOfWeekUTC
                }
            },
            _count: {
                id: true
            },
            orderBy: {
                date: 'desc'
            }
        });
        const taskCountVerified = weeklyTasksVerifiedData._count.id;
        const taskCountUnverified = weeklyTasksUnverifiedData._count.id;
        return Helpers_1.Helpers.successResponse(200, { taskCountVerified, taskCountUnverified, totalTasks: taskCountVerified + taskCountUnverified }, res);
    }
    catch (err) {
        console.error('weeklyTasks error:', err);
        return Helpers_1.Helpers.errorResponse(500, res, "Error occurred");
    }
};
exports.weeklyTasks = weeklyTasks;
const monthOverview = async (req, res) => {
    try {
        const { userId, userRole } = req.body.user;
        const { startOfMonthUTC, endOfMonthUTC } = Helpers_1.Helpers.getMonthStartEnd();
        const today = (0, moment_timezone_1.default)().tz(Helpers_2.indiaTimeZone);
        const daysPresent = await prisma_1.default.$queryRaw `
            SELECT DISTINCT DATE(date) as date
            FROM "Timesheet"
            WHERE employee_id = ${userId}
                AND date >= ${startOfMonthUTC}
                AND date <= ${endOfMonthUTC}
        `;
        const presentDates = new Set(daysPresent.map(day => moment_timezone_1.default.utc(day.date).tz(Helpers_2.indiaTimeZone).format('YYYY-MM-DD')));
        let workingDays = 0;
        let daysAbsent = 0;
        for (let day = (0, moment_timezone_1.default)(startOfMonthUTC); day.isSameOrBefore(today) && day.isSameOrBefore(endOfMonthUTC); day.add(1, 'day')) {
            if (day.day() !== 0 && day.day() !== 6) {
                // workingDays++;
                if (!presentDates.has(day.format('YYYY-MM-DD'))) {
                    daysAbsent++;
                }
            }
        }
        for (let day = (0, moment_timezone_1.default)(startOfMonthUTC); day.isSameOrBefore(endOfMonthUTC); day.add(1, 'day')) {
            if (day.day() !== 0 && day.day() !== 6) {
                workingDays++;
            }
        }
        const holidayCount = await getHolidayCountCurrentMonth();
        return Helpers_1.Helpers.successResponse(200, { daysPresent: presentDates.size, daysAbsent, workingDays: workingDays - holidayCount, holidayCount }, res);
    }
    catch (err) {
        console.log("monthOverview: Error", err);
        return Helpers_1.Helpers.errorResponse(500, res, "Internal Server Error");
    }
};
exports.monthOverview = monthOverview;
const calendarOverview = async (req, res) => {
    try {
        const { userId, userRole } = req.body.user;
        const month = Number(req.query.month);
        const year = Number(req.query.year);
        const { startOfMonthUTC, endOfMonthUTC } = Helpers_1.Helpers.getMonthStartEnd(month, year);
        const holidayData = await getHolidayList(month, year);
        const holidayList = holidayData.map((holiday) => holiday.date.toISOString().split('T')[0]); // convert ISO string to YYYY-MM-DD
        // for each day in this specific month, get (Total Tasks, Total Hours) per day
        const dailyData = await prisma_1.default.$queryRaw `
            SELECT 
            DATE(date) as date,
                CAST(COUNT(*) AS INTEGER) as "totalTasks",
                SUM(CAST(time_taken AS FLOAT)) as "totalHours"
            FROM "Timesheet"
            WHERE employee_id = ${userId}
                AND date >= ${startOfMonthUTC}
                AND date <= ${endOfMonthUTC}
            GROUP BY DATE(date)
            ORDER BY DATE(date)
        `;
        const dailyDataTotal = dailyData.map((day) => ({
            date: moment_timezone_1.default.utc(day.date).tz(Helpers_2.indiaTimeZone).format('YYYY-MM-DD'),
            totalTasks: day.totalTasks,
            totalHours: day.totalHours
        }));
        return Helpers_1.Helpers.successResponse(200, { dailyData: dailyDataTotal, holidayList }, res);
    }
    catch (err) {
        console.log("calendarOverview: Error", err);
        return Helpers_1.Helpers.errorResponse(500, res, "Internal Server Error");
    }
};
exports.calendarOverview = calendarOverview;
async function getHolidayCountCurrentMonth(month) {
    try {
        const currentDate = new Date();
        const targetMonth = month || currentDate.getMonth() + 1; // getMonth() returns 0-11, so we add 1
        const targetYear = currentDate.getFullYear();
        const startOfMonth = new Date(targetYear, targetMonth - 1, 1);
        const endOfMonth = new Date(targetYear, targetMonth, 0);
        const holidayCount = await prisma_1.default.holiday.count({
            where: {
                date: {
                    gte: startOfMonth,
                    lte: endOfMonth
                }
            }
        });
        return holidayCount;
    }
    catch (error) {
        return 0;
    }
}
async function getHolidayList(month, year) {
    const currentDate = new Date();
    const targetMonth = month || currentDate.getMonth() + 1; // getMonth() returns 0-11, so we add 1
    const targetYear = year || currentDate.getFullYear();
    const startOfMonth = new Date(targetYear, targetMonth - 1, 1);
    const endOfMonth = new Date(targetYear, targetMonth, 0);
    const holidayData = await prisma_1.default.holiday.findMany({
        where: {
            date: {
                gte: startOfMonth,
                lte: endOfMonth
            }
        }
    });
    return holidayData;
}
const managerTasksToday = async (req, res) => {
    try {
        const { userId, userRole } = req.body.user;
        const today = (0, moment_timezone_1.default)().tz(Helpers_2.indiaTimeZone).format('YYYY-MM-DD') + 'T00:00:00Z'; // start of today
        const tomorrow = (0, moment_timezone_1.default)().tz(Helpers_2.indiaTimeZone).format('YYYY-MM-DD') + 'T23:59:59Z'; // EOD
        const allTasks = await prisma_1.default.timesheet.findMany({
            select: {
                verifiedStatus: true
            },
            where: {
                employee: {
                    employeeManagers: {
                        some: {
                            managerId: userId
                        }
                    }
                },
                date: {
                    gte: today,
                    lt: tomorrow
                }
            }
        });
        const verifiedTasks = allTasks.filter((task) => task.verifiedStatus == 2).length;
        const unverifiedTasks = allTasks.filter((task) => task.verifiedStatus == 1).length;
        return Helpers_1.Helpers.successResponse(200, { loggedTasks: allTasks.length, verifiedTasks, unverifiedTasks }, res);
    }
    catch (err) {
        console.error("managerTasksToday: Error", err);
        return Helpers_1.Helpers.errorResponse(500, res, "Internal Server Error");
    }
};
exports.managerTasksToday = managerTasksToday;
