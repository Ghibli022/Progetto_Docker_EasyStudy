const sequelize = require('../config/database');

const User = require('./userModel');
const Material = require('./materialModel');
const Tag = require('./tagModel');

const HelpRequest = require('./requestModel');
const HelpMessage = require('./messageModel');

const Grade = require('./gradeModel');
const Subject = require('./subjectModel');

Material.belongsTo(User, {
    foreignKey: 'author_id',
    as: 'author',
    onDelete: 'CASCADE'
});
User.hasMany(Material, {
    foreignKey: 'author_id',
    as: 'materials'
});
Tag.belongsToMany(Material, {
    through: 'material_tags',
    foreignKey: 'tag_id',
    timestamps: false
});
Material.belongsToMany(Tag, {
    through: 'material_tags',
    foreignKey: 'material_id',
    as: 'tags',
    timestamps: false
});
HelpRequest.belongsTo(User, {
    foreignKey: 'author_id',
    as: 'author',
    onDelete: 'CASCADE'
});
User.hasMany(HelpRequest, {
    foreignKey: 'author_id',
    as: 'helpRequests'
});
HelpMessage.belongsTo(HelpRequest, {
    foreignKey: 'request_id',
    as: 'request',
    onDelete: 'CASCADE'
});
HelpRequest.hasMany(HelpMessage, {
    foreignKey: 'request_id',
    as: 'messages'
});
HelpMessage.belongsTo(User, {
    foreignKey: 'author_id',
    as: 'author',
    onDelete: 'CASCADE'
});
User.hasMany(HelpMessage, {
    foreignKey: 'author_id',
    as: 'helpMessages'
});
HelpMessage.belongsTo(HelpMessage, {
    foreignKey: 'parent_message_id',
    as: 'parent',
    onDelete: 'SET NULL'
});
HelpMessage.hasMany(HelpMessage, {
    foreignKey: 'parent_message_id',
    as: 'replies'
});
Grade.belongsTo(Subject, {
    foreignKey: 'subject_id',
    as: 'subject',
    onDelete: 'CASCADE'
});
Subject.hasMany(Grade, {
    foreignKey: 'subject_id',
    as: 'grades'
});

module.exports={
    User,
    Material,
    Tag,
    Request,
    HelpRequest,
    HelpMessage,
    Grade,
    Subject
};