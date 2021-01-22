var express = require('express');
var feverApi = require('../feverAPI/feverAPI.js');

var exports = module.exports = {}

var apiRouter = express.Router();

apiRouter.get('/attendId/:sessionId',function(req,res){
    feverApi.attendEvent(req,res);
})

apiRouter.get('/getPlanInfo/:planId',function(req,res){
    feverApi.getPlanInfo(req,res);
})

apiRouter.post('/facebookLogin/',function(req,res){
    feverApi.fbLogin(req,res);
})

apiRouter.post('/refreshToken/',function(req,res){
    feverApi.refreshToken(req,res)
})

apiRouter.post('/redeem',function(req,res){
    feverApi.redeemCode(req,res);
})

apiRouter.get('/search',function(req,res){
    feverApi.searchByWord(req,res);
})

apiRouter.get('/citiesList/:page',function(req,res){
    feverApi.getCities(req,res);
})

apiRouter.get('/getTickets/:userid/:page',function(req,res){
    feverApi.getTickets(req,res);
})

apiRouter.get('/getVouchers/:userid',function(req,res){
    feverApi.getVouchers(req,res);
})

apiRouter.get('/getFavorites/:page',function(req,res){
    feverApi.getFavorites(req,res);
})

exports.apiRouter = apiRouter