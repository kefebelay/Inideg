"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = authorizeRoles;
function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !allowedRoles.includes(user.role)) {
            res.status(403).json({
                message: "Forbidden: Access denied",
                reason: !user
                    ? "No user on request"
                    : `Role '${user.role}' not allowed`,
            });
            return;
        }
        next();
    };
}
