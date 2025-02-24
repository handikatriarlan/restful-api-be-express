const prisma = require("../prisma/client");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const findUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
            },
            orderBy: {
                id: "desc",
            },
        });

        res.status(200).send({
            success: true,
            message: "Get all users successfully",
            data: users,
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};

const createUser = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: "Validation error",
            errors: errors.array(),
        });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
            },
        });

        res.status(201).send({
            success: true,
            message: "User created successfully",
            data: user,
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};

const findUserById = async (req, res) => {

    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(id),
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        res.status(200).send({
            success: true,
            message: `Get user By ID :${id}`,
            data: user,
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: "Validation error",
            errors: errors.array(),
        });
    }

    try {
        const oldUser = await prisma.user.findUnique({
            where: { id: Number(id) },
        });

        if (!oldUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const updatedData = {
            name: req.body.name || oldUser.name,
            email: req.body.email || oldUser.email,
            password: req.body.password ? await bcrypt.hash(req.body.password, 10) : oldUser.password,
        };

        const user = await prisma.user.update({
            where: { id: Number(id) },
            data: updatedData,
        });

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: user,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.user.delete({
            where: {
                id: Number(id),
            },
        });

        res.status(200).send({
            success: true,
            message: 'User deleted successfully',
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};

module.exports = { findUsers, createUser, findUserById, updateUser, deleteUser };