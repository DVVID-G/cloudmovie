"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * User model: Mongoose schema with validation and password hashing.
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS || 10);
/**
 * User schema definition
 */
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Los nombres son obligatorios'],
        trim: true,
        maxlength: [50, 'Los nombres no pueden exceder 50 caracteres']
    },
    lastName: {
        type: String,
        required: [true, 'Los apellidos son obligatorios'],
        trim: true,
        maxlength: [50, 'Los apellidos no pueden exceder 50 caracteres']
    },
    age: {
        type: Number,
        min: [13, 'La edad no puede ser menor de 13 años'],
    },
    email: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Por favor ingresa un correo electrónico válido'
        ]
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
        validate: {
            validator: function (value) {
                return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(value);
            },
            message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial'
        }
    },
    resetPasswordTokenHash: { type: String, default: null, select: false },
    resetPasswordExpiresAt: { type: Date, default: null },
}, { timestamps: true });
/**
 * Hash password before saving if modified.
 */
userSchema.pre('save', async function (next) {
    // “this” es el documento Mongoose
    if (!this.isModified('password'))
        return next();
    try {
        this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
        next();
    }
    catch (err) {
        next(err);
    }
});
module.exports = mongoose.model('User', userSchema);
//# sourceMappingURL=user.js.map