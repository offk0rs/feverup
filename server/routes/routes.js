var express = require('express');
var feverApi = require('../feverAPI/feverAPI.js');

var exports = module.exports = {}

var apiRouter = express.Router();

apiRouter.get('/getCoupons', function(req, res){
    feverApi.findCoupons(req, res);
});

apiRouter.get('/attendId/:sessionId',function(req,res){
    feverApi.attendEvent(req,res);
})

apiRouter.get('/getPlanInfo/:planId',function(req,res){
    feverApi.getPlanInfo(req,res);
})

apiRouter.post('/facebookLogin/',function(req,res){
    feverApi.fbLogin(req,res);
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

exports.apiRouter = apiRouter