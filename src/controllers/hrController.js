"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getManagerList = exports.employeeOnboardingList = exports.addEmployee = void 0;
const Helpers_1 = require("../common/Helpers");
const hrValidations_1 = require("../validations/hrValidations");
const prisma_1 = __importDefault(require("../../prisma"));
const md5_1 = __importDefault(require("md5"));
const s3Config_1 = require("../common/s3Config");
const client_s3_1 = require("@aws-sdk/client-s3");
const addEmployee = async (req, res) => {
    try {
        const imgData = req.files.image;
        const resumeData = req.files.resume;
        let errors = Helpers_1.Helpers.validate(hrValidations_1.VAddEmployee, req.body);
        if (errors.length) {
            return Helpers_1.Helpers.errorResponse(400, res, "Validation Errors", errors);
        }
        const { userId, userRole } = req.body;
        const { firstName, middleName, lastName, employeeId, companyEmail, employeeTypeId, managerId, designationId, businessUnitId, personalEmail, mobileNumber, alternateNumber, gender, bloodGroup, birthDate, height, weight, aadharNumber, passportNumber, passportValidity, panCardNumber, currentAddress, permanentAddress, spouseName, spouseDob, spouseEmail, childName1, childDob1, childName2, childDob2, personal1Name, relation1, p1Contact, address1, personal2Name, relation2, p2Contact, address2, bankName, accountHolderName, accountNumber, bankIfscCode, accountType, bankAccountBranch, joiningDate, yearsOfExperience, skills } = req.body;
        const todayDate = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, -1); // to append date and time to image for uniqueness
        const employeeIdInt = parseInt(employeeId);
        const employeeTypeIdInt = parseInt(employeeTypeId);
        const designationIdInt = parseInt(designationId);
        const businessUnitIdInt = parseInt(businessUnitId);
        const genderInt = parseInt(gender);
        const weightFloat = parseFloat(weight);
        const existingEmployee = await prisma_1.default.employeeDetails.findFirst({
            where: {
                id: employeeIdInt
            }
        });
        if (existingEmployee) {
            return Helpers_1.Helpers.errorResponse(400, res, "Another Employee of that same Employee Id already exists.");
        }
        const employeeDetail = await prisma_1.default.employeeDetails.create({
            data: {
                id: employeeIdInt,
                firstName,
                middleName,
                lastName,
                companyEmail,
                personalEmail,
                mobileNumber,
                alternateNumber,
                gender: genderInt,
                bloodGroup,
                birthDate: new Date(birthDate),
                height,
                weight: weightFloat,
                aadharNumber,
                passportNumber,
                passportValidity: new Date(passportValidity).toString(),
                panCardNumber,
                currentAddress,
                permanentAddress,
                photo: imgData ? employeeId + '_' + todayDate + '_' + imgData.name : null
            }
        });
        const employeeManager = await prisma_1.default.employeeManager.create({
            data: {
                employeeDetailsId: employeeIdInt,
                managerId: parseInt(managerId),
                isActive: 1
            }
        });
        if (imgData && imgData.mimetype === 'image/jpeg' || imgData.mimetype === 'image/png' || imgData.mimetype === 'image/jpg' || imgData.mimetype === 'image/gif') {
            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: 'user/' + employeeId + '_' + todayDate + '_' + imgData.name,
                Body: imgData.data,
                ContentType: 'image/jpeg'
            };
            const command = new client_s3_1.PutObjectCommand(params);
            const response = await s3Config_1.s3Client.send(command);
        }
        const assignDesignation = await prisma_1.default.currentCompanyDetails.create({
            data: {
                employeeDetailsId: employeeIdInt,
                designationMasterId: designationIdInt,
                joiningDate: new Date(joiningDate)
            }
        });
        const assignBU = await prisma_1.default.employeeBUDetails.create({
            data: {
                employeeDetailsId: employeeIdInt,
                employeeMasterBusinessUnitId: businessUnitIdInt
            }
        });
        const assignRole = await prisma_1.default.employeeDetailRole.create({
            data: {
                employeeDetailsId: employeeIdInt,
                masterRoleId: employeeTypeIdInt
            }
        });
        const loginDetail = await prisma_1.default.loginDetails.create({
            data: {
                id: employeeIdInt,
                username: companyEmail,
                password: (0, md5_1.default)("123456") // default password for now
            }
        });
        const familyDetail = await prisma_1.default.familyDetails.create({
            data: {
                employeeDetailsId: employeeIdInt,
                spouseName,
                spouseDob: new Date(spouseDob),
                spouseEmail,
                childName1,
                childDob1: new Date(childDob1),
                childName2,
                childDob2: new Date(childDob2)
            }
        });
        const emergencyDetail = await prisma_1.default.emergencyDetails.create({
            data: {
                employeeDetailsId: employeeIdInt,
                personal1Name,
                relation1,
                p1Contact,
                address1,
                personal2Name,
                relation2,
                p2Contact,
                address2
            }
        });
        const bankDetail = await prisma_1.default.bankDetails.create({
            data: {
                employeeDetailsId: employeeIdInt,
                accountHolderName,
                accountNumber,
                bankName,
                aadharCardNumber: aadharNumber,
                bankIfscCode,
                accountType,
                bankAccountBranch
            }
        });
        if (resumeData) {
            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: 'resume/' + employeeId + '_' + todayDate + '_' + resumeData.name,
                Body: resumeData.data,
                ContentType: resumeData.mimetype
            };
            const command = new client_s3_1.PutObjectCommand(params);
            const response = await s3Config_1.s3Client.send(command);
        }
        const employeeResume = await prisma_1.default.employeeResume.create({
            data: {
                employeeDetailsId: employeeIdInt,
                yearsOfExperience: parseFloat(yearsOfExperience),
                skills,
                resumeFile: resumeData ? employeeId + '_' + todayDate + '_' + resumeData.name : null
            }
        });
        return Helpers_1.Helpers.successResponse(200, {}, res, "Employee Added Successfully");
    }
    catch (err) {
        console.error('addEmployee error:', err);
        return Helpers_1.Helpers.errorResponse(500, res, "Error occurred");
    }
};
exports.addEmployee = addEmployee;
const employeeOnboardingList = async (req, res) => {
    try {
        const employeeList = await prisma_1.default.employeeDetails.findMany({
            select: {
                id: true,
                firstName: true,
                middleName: true,
                lastName: true,
                companyEmail: true,
                benchOrPoc: true,
                currentCompanyDetails: {
                    select: {
                        designationMaster: {
                            select: {
                                id: true,
                                designation: true
                            }
                        },
                        joiningDate: true
                    }
                },
                employeeProjects: true,
                EmployeeBUDetails: {
                    select: {
                        masterBusinessUnit: {
                            select: {
                                id: true,
                                businessUnitName: true
                            }
                        }
                    }
                },
                employeeResumes: {
                    select: {
                        skills: true
                    }
                },
                employeeManagers: {
                    select: {
                        manager: {
                            select: {
                                id: true,
                                firstName: true,
                                middleName: true,
                                lastName: true
                            }
                        }
                    }
                },
            }
        });
        const flattenedEmployeeList = employeeList.map(employee => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12;
            let status;
            if (employee.employeeProjects.length === 0) {
                status = (_a = employee.benchOrPoc) !== null && _a !== void 0 ? _a : 0;
            }
            else if (employee.employeeProjects.some(project => project.isBillable)) {
                status = 3; // billable
            }
            else {
                status = 2; // non-billable
            }
            return {
                id: employee.id,
                firstName: (_b = employee.firstName) !== null && _b !== void 0 ? _b : null,
                middleName: (_c = employee.middleName) !== null && _c !== void 0 ? _c : null,
                lastName: (_d = employee.lastName) !== null && _d !== void 0 ? _d : null,
                email: (_e = employee.companyEmail) !== null && _e !== void 0 ? _e : null,
                designationId: (_h = (_g = (_f = employee.currentCompanyDetails[0]) === null || _f === void 0 ? void 0 : _f.designationMaster) === null || _g === void 0 ? void 0 : _g.id) !== null && _h !== void 0 ? _h : null,
                designation: (_l = (_k = (_j = employee.currentCompanyDetails[0]) === null || _j === void 0 ? void 0 : _j.designationMaster) === null || _k === void 0 ? void 0 : _k.designation) !== null && _l !== void 0 ? _l : null,
                joiningDate: (_o = (_m = employee.currentCompanyDetails[0]) === null || _m === void 0 ? void 0 : _m.joiningDate) !== null && _o !== void 0 ? _o : null,
                projects: (_p = employee.employeeProjects) !== null && _p !== void 0 ? _p : null,
                businessUnitId: (_t = (_s = (_r = (_q = employee.EmployeeBUDetails) === null || _q === void 0 ? void 0 : _q[0]) === null || _r === void 0 ? void 0 : _r.masterBusinessUnit) === null || _s === void 0 ? void 0 : _s.id) !== null && _t !== void 0 ? _t : null,
                businessUnitName: (_x = (_w = (_v = (_u = employee.EmployeeBUDetails) === null || _u === void 0 ? void 0 : _u[0]) === null || _v === void 0 ? void 0 : _v.masterBusinessUnit) === null || _w === void 0 ? void 0 : _w.businessUnitName) !== null && _x !== void 0 ? _x : null,
                skills: (_0 = (_z = (_y = employee.employeeResumes) === null || _y === void 0 ? void 0 : _y[0]) === null || _z === void 0 ? void 0 : _z.skills) !== null && _0 !== void 0 ? _0 : null,
                status,
                // manager: employee.employeeManagers[0]?.manager ?? null,
                manager: {
                    id: (_3 = (_2 = (_1 = employee.employeeManagers[0]) === null || _1 === void 0 ? void 0 : _1.manager) === null || _2 === void 0 ? void 0 : _2.id) !== null && _3 !== void 0 ? _3 : null,
                    firstName: (_6 = (_5 = (_4 = employee.employeeManagers[0]) === null || _4 === void 0 ? void 0 : _4.manager) === null || _5 === void 0 ? void 0 : _5.firstName) !== null && _6 !== void 0 ? _6 : null,
                    middleName: (_9 = (_8 = (_7 = employee.employeeManagers[0]) === null || _7 === void 0 ? void 0 : _7.manager) === null || _8 === void 0 ? void 0 : _8.middleName) !== null && _9 !== void 0 ? _9 : null,
                    lastName: (_12 = (_11 = (_10 = employee.employeeManagers[0]) === null || _10 === void 0 ? void 0 : _10.manager) === null || _11 === void 0 ? void 0 : _11.lastName) !== null && _12 !== void 0 ? _12 : null
                }
            };
        });
        return Helpers_1.Helpers.successResponse(200, flattenedEmployeeList, res);
    }
    catch (err) {
        console.error('employeeOnboardingList error:', err);
        return Helpers_1.Helpers.errorResponse(500, res, "Error occurred");
    }
};
exports.employeeOnboardingList = employeeOnboardingList;
const getManagerList = async (req, res) => {
    try {
        const managerListData = await prisma_1.default.employeeDetails.findMany({
            distinct: ['id'],
            where: {
                employeeDetailRoles: {
                    some: {
                        masterRoleId: {
                            in: [2, 3, 5]
                        }
                    }
                }
            },
            select: {
                id: true,
                firstName: true,
                middleName: true,
                lastName: true
            }
        });
        return Helpers_1.Helpers.successResponse(200, managerListData, res);
    }
    catch (err) {
        console.error('getManagerList error:', err);
        return Helpers_1.Helpers.errorResponse(500, res, "Error occurred");
    }
};
exports.getManagerList = getManagerList;
