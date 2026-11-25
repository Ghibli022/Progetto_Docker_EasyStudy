const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tag = sequelize.define('Tag', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    group_tags_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false, 
        references: {
            model: 'group_tags',
            key: 'id',
        }
    }
}, {
    tableName: 'tags',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
module.exports=Tag;
