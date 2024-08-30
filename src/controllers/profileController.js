"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileDetails = void 0;
const Helpers_1 = require("../common/Helpers");
const prisma_1 = __importDefault(require("../../prisma"));
const s3Config_1 = require("../common/s3Config");
const profileDetails = async (req, res) => {
    try {
        const { userId, userRole } = req.body.user;
        // const bankDetails = await prisma.bankDetails.findFirst({
        //     select: {
        //         id: true,
        //         employeeDetailsId: true,
        //         bankName: true,
        //         accountHolderName: true,
        //         accountNumber: true,
        //         bankIfscCode: true,
        //         accountType: true,
        //         bankAccountBranch: true
        //     },
        //     where: {
        //         employeeDetailsId: userId
        //     }
        // });
        // const emergencyDetails = await prisma.emergencyDetails.findFirst({
        //     select: {
        //         id: true,
        //         employeeDetailsId: true,
        //         personal1Name: true,
        //         p1Contact: true,
        //         relation1: true,
        //         email1: true,
        //         address1: true,
        //         personal2Name: true,
        //         p2Contact2: true,
        //         relation2: true,
        //         email2: true,
        //         address2: true
        //     },
        //     where: {
        //         employeeDetailsId: userId
        //     }
        // });
        // const familyDetails = await prisma.familyDetails.findFirst({
        //     select: {
        //         id: true,
        //         employeeDetailsId: true,
        //         spouseName: true,
        //         spouseEmail: true,
        //         spouseDob: true,
        //         childrenCount: true,
        //         childName1: true,
        //         childDob1: true,
        //         childName2: true,
        //         childDob2: true
        //     },
        //     where: {
        //         employeeDetailsId: userId
        //     }
        // });
        let employeeDetails = await prisma_1.default.employeeDetails.findUnique({
            select: {
                id: true,
                companyEmail: true,
                personalEmail: true,
                mobileNumber: true,
                alternateNumber: true,
                gender: true,
                birthDate: true,
                height: true,
                weight: true,
                bloodGroup: true,
                aadharNumber: true,
                passportNumber: true,
                passportValidity: true,
                panCardNumber: true,
                permanentAddress: true,
                currentAddress: true,
                photo: true,
                employeeResumes: {
                    select: {
                        id: true,
                        skills: true,
                        resumeFile: true,
                    }
                },
                bankDetails: {
                    select: {
                        id: true,
                        employeeDetailsId: true,
                        bankName: true,
                        accountHolderName: true,
                        accountNumber: true,
                        bankIfscCode: true,
                        accountType: true,
                        bankAccountBranch: true
                    }
                },
                FamilyDetails: {
                    select: {
                        id: true,
                        employeeDetailsId: true,
                        spouseName: true,
                        spouseEmail: true,
                        spouseDob: true,
                        childrenCount: true,
                        childName1: true,
                        childDob1: true,
                        childName2: true,
                        childDob2: true
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
                EmployeeBUDetails: {
                    select: {
                        id: true,
                        masterBusinessUnit: {
                            select: {
                                businessUnitName: true,
                                businessUnitHead: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        middleName: true,
                                        lastName: true,
                                    }
                                }
                            }
                        },
                        percentage: true
                    }
                },
                currentCompanyDetails: {
                    select: {
                        id: true,
                        joiningDate: true,
                        department: true,
                        yearsOfExperience: true,
                        designationMaster: {
                            select: {
                                designation: true
                            }
                        }
                    }
                }
            },
            where: {
                id: userId
            }
        });
        const profilePhoto = await (0, s3Config_1.getSignedUrlByPath)(`user/${employeeDetails === null || employeeDetails === void 0 ? void 0 : employeeDetails.photo}`);
        console.log(profilePhoto);
        Object.assign(employeeDetails, { profilePhoto });
        return Helpers_1.Helpers.successResponse(200, { employeeDetails }, res);
    }
    catch (err) {
        console.error('profileDetails error:', err);
        return Helpers_1.Helpers.errorResponse(500, res, "Internal Server Error");
    }
};
exports.profileDetails = profileDetails;
