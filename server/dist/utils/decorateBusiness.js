"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorateBusiness = decorateBusiness;
exports.decorateBusinesses = decorateBusinesses;
function decorateBusiness(business, userId) {
    var _a, _b;
    const isLiked = (_a = business.likes) === null || _a === void 0 ? void 0 : _a.some((id) => id.toString() === userId);
    return Object.assign(Object.assign({}, business), { isLiked, likeCount: ((_b = business.likes) === null || _b === void 0 ? void 0 : _b.length) || 0 });
}
function decorateBusinesses(businesses, userId) {
    return businesses.map((b) => {
        var _a;
        const likeIds = ((_a = b.likes) === null || _a === void 0 ? void 0 : _a.map((id) => id.toString())) || [];
        return Object.assign(Object.assign({}, b), { isLiked: userId ? likeIds.includes(userId.toString()) : false, likes: likeIds });
    });
}
