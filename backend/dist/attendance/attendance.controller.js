"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceController = void 0;
const common_1 = require("@nestjs/common");
const create_attendance_dto_1 = require("./dto/create-attendance.dto");
const decorators_1 = require("../common/decorators");
const user_entity_1 = require("../users/entities/user.entity");
const attendance_service_1 = require("./attendance.service");
let AttendanceController = class AttendanceController {
    attendanceService;
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    create(createAttendanceDto) {
        return this.attendanceService.create(createAttendanceDto);
    }
    submit(payload, user) {
        return this.attendanceService.submitAttendance(payload, user);
    }
    dashboard(user) {
        return this.attendanceService.getDashboardStats(user);
    }
    findAll() {
        return this.attendanceService.findAll();
    }
    findByClass(classId, startDate, endDate) {
        return this.attendanceService.findByClass(classId, startDate, endDate);
    }
    getReport(classId) {
        return this.attendanceService.getAttendanceReport(classId);
    }
};
exports.AttendanceController = AttendanceController;
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Roles)(user_entity_1.UserRole.PROFESSOR, user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_attendance_dto_1.CreateAttendanceDto]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('submit'),
    (0, decorators_1.Roles)(user_entity_1.UserRole.PROFESSOR, user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "submit", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, decorators_1.Roles)(user_entity_1.UserRole.PROFESSOR, user_entity_1.UserRole.ADMIN),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "dashboard", null);
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Roles)(user_entity_1.UserRole.PROFESSOR, user_entity_1.UserRole.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('turma/:classId'),
    __param(0, (0, common_1.Param)('classId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "findByClass", null);
__decorate([
    (0, common_1.Get)('turma/:classId/report'),
    __param(0, (0, common_1.Param)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "getReport", null);
exports.AttendanceController = AttendanceController = __decorate([
    (0, common_1.Controller)('attendance'),
    __metadata("design:paramtypes", [attendance_service_1.AttendanceService])
], AttendanceController);
//# sourceMappingURL=attendance.controller.js.map