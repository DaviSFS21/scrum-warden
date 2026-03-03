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
exports.PointsController = void 0;
const common_1 = require("@nestjs/common");
const points_service_1 = require("./points.service");
const add_point_dto_1 = require("./dto/add-point.dto");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
let PointsController = class PointsController {
    pointsService;
    constructor(pointsService) {
        this.pointsService = pointsService;
    }
    findAll(userId, sprintId) {
        return this.pointsService.findAll(userId, sprintId);
    }
    getExpulsions() {
        return this.pointsService.getExpulsions();
    }
    add(dto) {
        return this.pointsService.add(dto);
    }
};
exports.PointsController = PointsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('sprintId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PointsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('expulsions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PointsController.prototype, "getExpulsions", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.SM),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_point_dto_1.AddPointDto]),
    __metadata("design:returntype", void 0)
], PointsController.prototype, "add", null);
exports.PointsController = PointsController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('points'),
    __metadata("design:paramtypes", [points_service_1.PointsService])
], PointsController);
//# sourceMappingURL=points.controller.js.map