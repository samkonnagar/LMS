import { ApiError } from "../utils/ApiError.js";

function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !user.role) {
      throw new ApiError(401, "Unauthorized: No user or role found");
    }

    if (!allowedRoles.includes(user.role)) {
      throw new ApiError(403, "Forbidden: Access denied");
    }

    next();
  };
}

export default authorizeRole;
