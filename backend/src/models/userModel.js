const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    last_name: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    profile_image_url: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    role: {
        type: DataTypes.ENUM('STUDENT', 'ADMIN'),
        allowNull: false,
        defaultValue: 'STUDENT'
    },
    account_status: {
        type: DataTypes.ENUM('ACTIVE', 'BLOCKED'),
        allowNull: false,
        defaultValue: 'ACTIVE'
    },
    last_login_at: { //DA RIVEDERE
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports=User;