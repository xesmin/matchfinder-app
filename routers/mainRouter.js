import express from 'express';
import Match from '../controllers/matchController';
import User from '../controllers/userController';
import {isLoggedIn, isLoggedOut} from '../middleware/access';
import passport from 'passport';
const router = express.Router();
import queue from 'queue';

const qOpts = {
    concurrency: 1,
    autostart: true
};

const matchmakingQueue = queue(qOpts);
matchmakingQueue.push(qcb => {
    qcb();
});

const gameQueue = queue(qOpts);
gameQueue.push(qcb => {

    qcb();
});

router.get('/', (req, res) => {
    res.render('index', {user: req.user});
});

router.get('/register', isLoggedOut, (req, res) => {
    res.render('register', {user: req.user, err: req.query.err || 0});
});

router.post('/register', isLoggedOut, (req, res) => {
    User.registerUser(req.body, (err, result) => {
        if (err)
            res.redirect('/register?err=1');
        else
            res.redirect('/login');
    });
});

router.get('/login', isLoggedOut, (req, res) => {
    res.render('login', {user: req.user, err: req.query.err || 0});
});

router.post('/login',
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: '/login?err=1',
        failureFlash: false
    }), (req, res) => {}
);

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    res.redirect('/login');
});

router.get('/qq', isLoggedIn, (req, res) => {
    matchmakingQueue.push(qcb => {
        Match.findMatch(req.user, (err, result) => {
            if (err) {
                res.redirect('/');
                qcb();
            }
                
            else if (result) {
                res.redirect('/lobby/'+result.id);
                qcb();
            }  
        });
    });
});

router.get('/lobby/:id', isLoggedIn, (req, res) => {
    Match.getData(req.params.id, (err, result) => {
        if (err)
            res.send(err);
        else if (result) {
            res.render('lobby', {user: req.user, game: result});
        }
        else
            res.send('routingError');
    });
});

router.get('/gamedata/:id', isLoggedIn, (req, res) => {
    Match.getData(req.params.id, (err, result) => {
        if (err)
            res.send({"error": "problem"});
        else if (result)
            res.send(result);
        else
            res.send({"error": "problem"});
    });
});

router.get('/game/:id', isLoggedIn, (req, res) => {
    Match.getData(req.params.id, (err, result) => {
        if (err)
            res.send(err);
        else if (result) {
            res.render('game', {user: req.user, game: result});
        }
        else
            res.send('routingError');
    });
});

router.get('/matchdata/:id', isLoggedIn, (req, res) => {
    Match.getData(req.params.id, (err, result) => {
        if (err)
            res.send(err);
        else if (result) {
            if (result.status == 1) {
                Match.spectate(result.user1.summonersId, (err, match) => {
                    if (err)
                        res.send({message: "matchNotStarted"});
                    else if (match) {
                        result.status = 2;
                        result.gameId = match.gameId;
                        result.save(() => {
                            res.send({message: "gameInProgress"});
                        });
                    }
                });
            } else if (result.status == 2) {
                Match.spectate(result.user1.summonersId, (err, match) => {
                    if (err) {
                        result.status = 3;
                        result.save(() => {
                            res.send({message: "gameFinished"});
                        });
                    }
                    else if (match) {
                        res.send({message: "gameInProgress"});
                    }
                });
            } else if (result.status == 3)
                res.send({message: "gameFinished"});
        }
        else
            res.send('routingError');
    });
});

router.get('/result/:id', isLoggedIn, (req, res) => {
    Match.getResult(req.params.id, (err, result) => {
        if (err)
            res.redirect('/game/' + req.params.id);
        else
            res.render('result', {user: req.user, win: result.win, data: result.match});
    });
});

export default router;