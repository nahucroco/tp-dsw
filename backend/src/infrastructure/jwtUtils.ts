import type { Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'something';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '100';

const generateJWT = (res: Response, userId: number, role: string) => {
	const expiryInSeconds = parseInt(JWT_EXPIRY as string, 10);
	const token = jwt.sign({ userId, role }, JWT_SECRET, {
		expiresIn: expiryInSeconds,
	});
	if (Number.isNaN(expiryInSeconds)) {
		throw new Error('Invalid JWT_EXPIRY value');
	}

	res.cookie('jwt', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: expiryInSeconds * 1000,
		path: '/',
	});
};

const clearJWT = (res: Response) => {
	res.cookie('jwt', '', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		expires: new Date(0),
		path: '/',
	});
};

export { generateJWT, clearJWT };
