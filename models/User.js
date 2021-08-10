const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tasks: [{ type: Types.ObjectId, ref: 'Task' }],
    admin: { type: Boolean, default: false}
});

module.exports = model('User', schema);
