import User from '../models/userModel';
import request from 'request';
import uriencoder from 'strict-uri-encode';

const API_KEY = process.env.API_KEY;

const getSummonersData = (summonersName, cb) => {
    request(`https://eun1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${uriencoder(summonersName)}?api_key=${API_KEY}`, (err, response, body) => {
        let data = JSON.parse(body);
        if (data.status)
            cb('noSummonersData', null);
        else
            cb(null, {
                summonersId: data.id,
                accountId: data.accountId
            });
    });
}

const registerUser = (userdata, cb) => {
    getSummonersData(userdata.summonersName, (err, summonersdata) => {
        if (err)
            cb(err, null);
        else {
            const newUser = new User({
                username: userdata.username,
                email: userdata.email,
                accountId: summonersdata.accountId,
                summonersId: summonersdata.summonersId,
                summonersName: userdata.summonersName
            });
            User.register(newUser, userdata.password, (err, res) => {
                if (err)
                    cb(err, null);
                else
                    cb(null, true);
            });
        }
    });

};

const findUserByEmail = (usermail, cb) => {
    User.findOne({email: usermail}, (err, result) => {
        if(err)
            cb(err, null);
        else
            cb(null, result);
    });
}

const updateUserPassword = (uid, password, cb) => {
    User.findOne({id: uid}, (err, result) => {
        if (err)
            cb(err, null);
        else if (result) {
            result.setPassword(password, () => {
                result.save((err) => {
                    if (err)
                        cb(err, null);
                    else
                        cb(null, true);
                });
            });
        }
    });
};

const listAllUsers = (cb) => {
    User.find({}, (err, result) => {
        if (err)
            cb('dbError', null);
        else 
            cb(null, result);
    });
};

const listSingleUser = (uid, cb) => {
    User.findOne({id: uid}, (err, result) => {
        if (err)
            cb('dbError', null);
        else
            cb(null, result);
    });
};

export default {registerUser, findUserByEmail, updateUserPassword, listAllUsers, listSingleUser};