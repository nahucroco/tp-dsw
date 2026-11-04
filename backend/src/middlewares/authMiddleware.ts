import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
	userId: number;
	role: string;
}
declare global {
	namespace Express {
		interface Request {
			user?: JwtPayload;
		}
	}
}
export const authenticateToken = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const token = req.cookies.jwt;

	if (!token) {
		return res.status(401).json({
			message: 'No token',
		});
	}

	try {
		req.user = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

		next();
	} catch {
		return res.status(403).json({
			message: 'Invalid token',
		});
	}
};
export const authorizeRoles = (...roles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.user) {
			return res.status(401).json({
				message: 'User is not authorized',
			});
		}

		if (!roles.includes(req.user.role)) {
			return res.status(403).json({
				message: 'the user does not have enough permissions',
			});
		}

		next();
	};
};
