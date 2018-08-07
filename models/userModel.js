import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import autoIncrement from 'mongoose-auto-increment';
import db from '../controllers/dbController';

const userSchema = new mongoose.Schema({
    id: Number,
    username: String,
    email: String,
    summonersName: String,
    summonersId: Number,
    accountId: Number,
});

autoIncrement.initialize(db);
userSchema.plugin(autoIncrement.plugin, {
    model: 'User',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});
userSchema.plugin(passportLocalMongoose);

export default mongoose.model('User', userSchema);

