import Match from '../models/matchModel';
import request from 'request';

const API_KEY = process.env.API_KEY;

const createNew = (user, cb) => {
    let newMatch = new Match({
        user1: {
            id: user.id,
            username: user.username,
            accoundId: user.accountId,
            summonersId: user.summonersId,
            summonersName: user.summonersName
        },
        user2: {
            id: 0
        },
        user3: {
            id: 0
        },
        user4: {
            id: 0
        },
        user5: {
            id: 0
        },
        status: 0,
        gameId: 0,
        players: 1
    });

    newMatch.save((err, result) => {
        if (err)
            cb('dbError', null);
        else
            cb(null, result);
    });
}

const addPlayer = (mid, player, cb) => {
    Match.findOne({id: mid}, (err, result) => {
        if (result.user2.id == 0) {
            result.user2 = {
                id: player.id,
                username: player.username,
                accountId: player.accountId,
                summonersId: player.summonersId,
                summonersName: player.summonersName
            };
            result.players = 2;
            result.save(() => {
                cb(null, result);
            });
        }
        else if (result.user3.id == 0) {
            result.user3 = {
                id: player.id,
                username: player.username,
                accountId: player.accountId,
                summonersId: player.summonersId,
                summonersName: player.summonersName
            };
            result.players = 3;
            result.save(() => {
                cb(null, result);
            });
        }
        else if (result.user4.id == 0) {
            result.user4 = {
                id: player.id,
                username: player.username,
                accountId: player.accountId,
                summonersId: player.summonersId,
                summonersName: player.summonersName
            };
            result.players = 4;
            result.save(() => {
                cb(null, result);
            });
        }
        else if (result.user5.id == 0) {
            result.user5 = {
                id: player.id,
                username: player.username,
                accountId: player.accountId,
                summonersId: player.summonersId,
                summonersName: player.summonersName
            };
            result.players = 5;
            result.status = 1;
            result.save((err, result) => {
                cb(null, result);
            });
        }
    });
}

const findMatch = (user, cb) => {
    Match.findOne({players: 4}, (err, result) => {
        if (err)
            cb('dbError', null);
        else if (result == null) {
            Match.findOne({players: 3}, (err, result) => {
                if (err)
                    cb('dbError', null);
                else if (result == null) {
                    Match.findOne({players: 2}, (err, result) => {
                        if (err)
                            cb('dbError', null);
                        else if (result == null) {
                            Match.findOne({players: 1}, (err, result) => {
                                if (err)
                                    cb('dbError', null);
                                else if (result == null) {
                                    createNew(user, (err, result) => {
                                        if (err)
                                            cb(err, null);
                                        else if (result) {
                                            cb(null, result);
                                        }
                                    });
                                }
                                else
                                    addPlayer(result.id, user, (err, result) => {
                                        cb(null, result);
                                    });
                            });
                        }
                        else
                            addPlayer(result.id, user, (err, result) => {
                                cb(null, result);
                            });
                    });
                }
                else
                    addPlayer(result.id, user, (err, result) => {
                        cb(null, result);
                    });
            });
        }
        else
            addPlayer(result.id, user, (err, result) => {
                cb(null, result);
            });
    });
}

const spectate = (csid, cb) => {
    request(`https://eun1.api.riotgames.com/lol/spectator/v3/active-games/by-summoner/${csid}?api_key=${API_KEY}`, (err, response, body) => {
        let data = JSON.parse(body);
        if (data.status)
            cb({message: "notActive"}, null);
        else
            cb(null, {
                gameId: data.gameId,
                accountId: data.accountId
            });
    });
}

const getResult = (gid, cb) => {
    Match.findOne({id: gid}, (err, result) => {
        if (err)
            cb('dbError', null);
        else
            request(`https://eun1.api.riotgames.com/lol/match/v3/matches/'${result.gameId}?api_key=${API_KEY}`, (err, response, body) => {
                const data = JSON.parse(body);
                if (data.status)
                    cb({message: "noData"}, null);
                else {
                    const x = data.participantIdentities.filter((element) => {
                        return element.player.summonerId  == result.user1.summonersId;
                    });
                    const pid = x[0].participantId;
                    const y = data.participants.filter((element) => {
                        return element.participantId == pid;
                    });
                    const z = y[0].teamId;
                    const team = data.teams.filter(t => {
                        return t.teamId == z;
                    });
                    cb(null, {win: team[0].win, match: result});
                }
                    
            });
    });
    
}

const getData = (id, cb) => {
    Match.findOne({id}, (err, result) => {
        if (err)
            cb('dbError', null);
        else
            cb(null, result);
    });
}

export default {findMatch, getData, getResult, spectate};