import type { Request, Response } from "express";
import UserData from "../data/UserData";
import { User } from "../models/User";

let current_id = 1;

export const getUser = (req: Request, res: Response) => {
	res.json(UserData);
};
export const getUserById = (req: Request, res: Response) => {
	const id = parseInt(req.params.id);
	const user = UserData.find((user) => user.id === id);
	if (!user) res.status(404).json({ message: "User not found" });
	res.json(user);
};
export const createUser = (req: Request, res: Response) => {
	const { fullName, username, password, email } = req.body;
	const user = new User(current_id++, fullName, username, password, email);
	UserData.push(user);
	res.status(201).json(user);
};
export const updateUser = (req: Request, res: Response) => {
	const id = parseInt(req.params.id);
	const user = UserData.find((user) => user.id === id);
	if (!user) res.status(404).json({ message: "User not found" });
	const { fullName, username, password, email } = req.body;
	user.fullName = fullName;
	user.username = username;
	user.password = password;
	user.email = email;
	res.json(user);
};
export const deleteUser = (req: Request, res: Response) => {
	const id = parseInt(req.params.id);
	const index = UserData.findIndex((user) => user.id === id);
	if (index === -1) res.status(404).json({ message: "User not found" });
	UserData.splice(index, 1);
	res.json("User deleted");
};
