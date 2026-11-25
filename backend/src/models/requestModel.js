
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HelpRequest = sequelize.define('HelpRequest', {
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
            key: 'id'
        }
    },

    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    status: {
        type: DataTypes.ENUM('OPEN', 'RESOLVED', 'REMOVED'),
        allowNull: false,
        defaultValue: 'OPEN'
    },

    resolved_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: 'help_requests',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
});

module.exports = HelpRequest;
