import prisma from "../lib/prisma.js";

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Forbidden: Insufficient permissions",
        required: allowedRoles,
        current: req.user.role,
      });
    }

    next();
  };
};

export const canAccessDepartment = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (req.user.role === "ADMIN" || req.user.role === "PROCUREMENT_OFFICER") {
    return next();
  }

  const requestedDepartmentId = parseInt(
    req.params.departmentId || req.body.departmentId
  );

  if (req.user.departmentId !== requestedDepartmentId) {
    return res.status(403).json({
      error: "Forbidden: Cannot access other departments",
    });
  }

  next();
};
