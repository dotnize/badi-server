import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import type { Request, Response } from "express";

import { db } from "~/db/drizzle";
import { user, userPassword } from "~/db/schema";
import type { User } from "~/lib/types";

export async function getCurrentSession(req: Request, res: Response) {
    try {
        if (req.session.user) {
            res.status(200).json(req.session.user);
        } else {
            res.status(204).json({ error: true, message: "No session found." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).end();
    }
}

export async function login(req: Request, res: Response) {
    try {
        const emailInput = req.body.email;
        const passwordInput = req.body.password;

        // check if email exists
        const foundUser = await db.query.user.findFirst({
            where: eq(user.email, emailInput),
        });
        if (!foundUser) {
            res.status(404).json({ error: true, message: "Invalid email." });
            return;
        }

        // get user's password
        const foundPassword = await db.query.userPassword.findFirst({
            where: eq(userPassword.userId, foundUser.id),
        });
        // extra safety, just in case
        if (!foundPassword) {
            throw new Error(`User ${foundUser.id} has no password.`);
        }

        // compare password input with hashed password
        const validPassword = await bcrypt.compare(passwordInput, foundPassword.password);
        if (!validPassword) {
            res.status(401).json({ error: true, message: "Invalid password." });
            return;
        }

        req.session.user = foundUser;
        req.session.save(() => {
            res.status(200).json(req.session.user);
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

export async function register(req: Request, res: Response) {
    try {
        const input: Omit<User, "id" | "verified"> & { password: string } = req.body;

        // check all required fields
        if (
            !input.email ||
            !input.password ||
            !input.firstName ||
            !input.lastName ||
            !input.gender ||
            !input.location
        ) {
            res.status(400).json({ error: true, message: "Missing required fields." });
        }

        // check if email already exists
        const duplicateUser = await db.query.user.findFirst({
            where: eq(user.email, input.email),
        });
        if (duplicateUser) {
            res.status(409).json({ error: true, message: "Email is already registered." });
            return;
        }

        // hash password
        const hashedPassword = await bcrypt.hash(input.password, 10);

        // restructure user input with verified to 0, and exclude password
        const inputUser: Omit<User, "id"> = {
            email: input.email,
            firstName: input.firstName,
            lastName: input.lastName,
            gender: input.gender,
            location: input.location,
            verified: 0,
            averageRating: null,
            phoneNumber: input.phoneNumber || null,
            avatarUrl: input.avatarUrl || null,
        };
        // insert inputUser to db
        const insertResult = await db.insert(user).values(inputUser);

        // insert hashed password to db
        await db
            .insert(userPassword)
            .values({ userId: insertResult[0].insertId, password: hashedPassword });

        // final user object, inputUser with auto-incremented id
        const newUser: User = { id: insertResult[0].insertId, ...inputUser };

        // save to session and return user object
        req.session.user = newUser;
        req.session.save(() => {
            res.status(201).json(req.session.user);
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

export async function logout(req: Request, res: Response) {
    try {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}
