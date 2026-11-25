const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Material = sequelize.define('Material', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    author_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false, 
        references: {
            model: 'users',
            key: 'id',
        }
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    file_type: {
        type: DataTypes.ENUM('PNG', 'JPEG', 'DOCX', 'PDF'),
        allowNull: false
    },
    file_url: {
        type: DataTypes.STRING(1000),
        allowNull: false
    },
    filename: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    file_size: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true
    },
    download_count: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM('ACTIVE', 'REMOVED'),
        allowNull: false,
        defaultValue: 'ACTIVE'
    }
}, {
    tableName: 'materials',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Material; 