
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HelpMessage = sequelize.define('HelpMessage', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },

    request_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
            model: 'help_requests',
            key: 'id'
        }
    },

    author_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },

    parent_message_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
        defaultValue: null,
        references: {
            model: 'help_message',
            key: 'id'
        }
    },

    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    status: {
        type: DataTypes.ENUM('ACTIVE', 'REMOVED'),
        allowNull: false,
        defaultValue: 'ACTIVE'
    }
}, {
    tableName: 'help_message',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
});

module.exports = HelpMessage;
