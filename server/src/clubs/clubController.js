'use strict';

const mongoose = require('mongoose');
const Club = mongoose.model('Club');
const User = mongoose.model('User');

module.exports.list = function({query}, res) {
    const pageSize = query.pageSize ? parseInt(query.pageSize) : 0;
    const page = query.page ? parseInt(query.page) : 0;
    let totalRecords;
    Club.countDocuments().
    then((total) => totalRecords = total);

    Club.find()
        .limit(pageSize * page)
        .then(clubs => res.json({
            data: clubs,
            totalRecords
        }))
        .catch(error => res.status(500).send({message: error}));
}

module.exports.listByUser = function({params, query}, res) {
    const pageSize = query.pageSize ? parseInt(query.pageSize) : 0;
    const page = query.page ? parseInt(query.page) : 0;
    const username = params.userId;
    console.log(pageSize * page)
    User.findOne({username})
        .limit(pageSize * page)
        .then(u => {
            console.log(u)
            res.send(u.clubs);
        })
        .catch(error => res.status(500).send({message: error}));
}

module.exports.subscribeUser = function(req, res) {
    const clubId = req.params.clubId;
    const username = req.params.userId

    User.findOne({username})
        .then(u => {
            if(u.clubs.find(c => c.toString() === clubId)){
                throw 'Already subscribed to this club';
            }
            return User.updateOne({username}, {$push: {clubs: clubId}});
        })
        .then(() => Club.findById(clubId))
        .then(u => {
            res.send({message: `You have subscripted to ${u.name} successfully!`})
        }).catch(err => {
            res.status(500).send({message: err});
        });
}

module.exports.unsubscribeUser = function(req, res) {
    const clubId = req.params.clubId;
    const username = req.params.userId

    Club.findById(clubId).then(c => {
        User.findOne({username})
        .populate('clubs')
        .then(u => {
            const club = u.clubs.find(c => c._id.toString() === clubId);
            if(!club){
                console.log('hello');
                throw `You are not subscribed to ${c.name}!`;
            }
            return User.updateOne({username}, {$pull: {clubs: clubId}});
        })
        .then(() => {
            res.send({message: `You have unsubscripted from ${c.name} successfully!`})
        }).catch(err => {
            res.status(500).send({message: err});
        });
    })

   
}