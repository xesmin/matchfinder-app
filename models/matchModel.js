import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import db from '../controllers/dbController';

const matchSchema = new mongoose.Schema({
    id: Number,
    user1: {
        id: Number,
        username: String,
        accountId: Number,
        summonersId: Number,
        summonersName: String
    },
    user2: {
        id: Number,
        username: String,
        accountId: Number,
        summonersId: Number,
        summonersName: String
    },
    user3: {
        id: Number,
        username: String,
        accountId: Number,
        summonersId: Number,
        summonersName: String
    },
    user4: {
        id: Number,
        username: String,
        accountId: Number,
        summonersId: Number,
        summonersName: String
    },
    user5: {
        id: Number,
        username: String,
        accountId: Number,
        summonersId: Number,
        summonersName: String
    },
    status: Number, // 0 - gathering, 1 - ready not started, 2 - in progress, 3 - finished
    gameId: Number,  // default to 0 (when not started),
    players: Number
});

autoIncrement.initialize(db);
matchSchema.plugin(autoIncrement.plugin, {
    model: 'Match',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});

export default mongoose.model('Match', matchSchema);

