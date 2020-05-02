var request = require('request');
var cryptoUtils = require('../cryptoUtils/cryptoUtils.js')
const https = require('https')

function findCoupons(req, res){
    const url = "https://i80y2bqlsl-dsn.algolia.net:443/1/indexes/Fever-"+ req.query.city +"/query";
    options = {
        url : url,
        headers:{
            "X-Algolia-API-Key": "e4226055c240f9e38e89794dcfb91766", 
            "X-Algolia-Application-Id": "I80Y2BQLSL",
            "User-Agent": "Algolia for Android (3.27.0); Android (6.0.1)"
        },
        json:{
            "params":"filters=&hitsPerPage="+ req.query.hitsPerPage +"&page="+ req.query.page +"&query="+ req.query.query
        }
    }
    request.post(options,function(error,response,body){
        if(error !== null){
            res.status(500).send()
        } else {
            if(response.statusCode !== 200){
                res.status(404).send()
            } else {
                var coupons = {coupons:{}}
                var cont = 0;
                for(var i = 0, len = Object.keys(body.hits).length; i < len; i++){
                    if(body.hits[i]._highlightResult.description.value.match(new RegExp('(?<=\\b'+ req.query.regexWord +'\\s)(\\w+)'))){
                        coupons.coupons[cont] = {"id" : body.hits[i].id,"coupon" : body.hits[i]._highlightResult.description.value.match(new RegExp('(?<=\\b'+ req.query.regexWord +'\\s)(\\w+)'))[0]}
                        cont ++
                    }
                }
                res.status(200).send(coupons)

            }
        }
    });
}

function googleLogin(req,res){
    const url = "http://beam.feverup.com/api/4.0/login/google/";
    const xApiData = cryptoUtils.getXAPIData();
    options = {
        url : url,
        headers : {
            'Accept': "application/json", 
            'Screen': "android@xxhdpi", 
            "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 6.0.1; A0001 Build/MTC20F)", 
            "X-API-Signature": xApiData['X-API-Signature'], 
            "Content-type": "application/json", 
            "X-API-Nonce": xApiData['X-API-Nonce'], 
            "X-API-Datetime": xApiData['X-API-Datetime'], 
            "X-Client-Version": "4.5.21", 
            "X-API-Key": xApiData['X-API-Key'], 
            "Accept-Language": "es", 
            "Content-Type": "application/json"
        },
        json : {
            "google_id":req.body.google_id,
            "middle_name":req.body.middle_name,
            "client_version":req.body.client_version,
            "first_name":req.body.first_name,
            "last_name":req.body.last_name,
            "birthday":req.body.birthday,
            "gender":req.body.gender,
            "email":req.body.email,
            "avatar_url":req.body.avatar_url,
            "suuid":cryptoUtils.getSuuid(req.body.suuid).uuid,
            "auth_token":req.body.auth_token,
            "client_id":req.body.client_id,
            "accepted_terms":[]
        }
    }

    request.post(options,function(error,response,body){
        if(error !== null){
            res.status(500).send()
        } else {
            if(response.statusCode !== 200){
                res.status(404).send()
            } else {
                res.status(200).send({"token": body.token})
            }
        }
    });

}

function getPlanInfo(req,res){
    const url = "http://beam.feverup.com/api/4.0/plans/"+req.params.planId+"/";
    options = {
        url : url,
        headers:{
            "Accept": "application/json", 
            "Screen": "android@xxhdpi", 
            "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 6.0.1; A0001 Build/MTC20F)", 
            "Authorization": "Token " + req.headers.token,
            "X-Client-Version": "4.5.21", 
            "Accept-Language": "es"
        }
    }

    request.get(options,function(error,response,body){
        if(error !== null){
            res.status(500).send()
        } else {
            if(response.statusCode !== 200){
                res.status(404).send(JSON.parse(body))
            } else {
                res.status(200).send({
                    "id" : JSON.parse(body).id,
                    "description": JSON.parse(body).description,
                    "defaultSession": JSON.parse(body).default_session.id
                });
            }
        }
    });

}

function attendEvent(req,res){
    const url = "http://beam.feverup.com/api/4.0/sessions/"+req.params.sessionId+"/attend/";
    options = {
        url : url,
        headers:{
            "X-Client-Version": "4.5.5",
            "Screen": "android@xxhdpi",
            "Accept": "application/json",
            "Authorization": "Token " + req.headers.token,
            "Accept-Language": "en",
            "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 6.0.1; A0001 Build/MTC20F)",
        },
        json : {
            "ticket_number":1,
            "phone":""
        }
    }

    request.post(options,function(error,response,body){
        if(error !== null){
            res.status(500).send()
        } else {
            if(response.statusCode !== 200){
                res.status(404).send(body)
            } else {
                res.status(200).send(body);
            }
        }
    });
}

function redeemCode(req,res){
    const url = "https://beam.feverup.com:443/api/4.0/vouchers/"+req.query.code+"/redeem/"
    options = {
        url : url,
        headers : {
            "Accept": "application/json", 
            "Screen": "android@xxhdpi", 
            "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 6.0.1; A0001 Build/MTC20F)", 
            "Authorization": "Token " + req.headers.token,
            "Content-type": "application/json", 
            "X-Client-Version": "4.5.21", 
            "Accept-Language": "es", 
            "Content-Type": "application/json"
        },
        json : {
            "suuid":cryptoUtils.getSuuid(req.body.suuid).uuid,
        }
    }

    request.post(options,function(error,response,body){
        if(error !== null){
            res.status(500).send()
        } else {
            if(response.statusCode !== 200){
                res.status(815).send(body)
            } else {
                res.status(200).send(body);
            }
        }
    });
}

function searchByWord(req,res){
    const url = "https://i80y2bqlsl-dsn.algolia.net:443/1/indexes/Fever-"+req.query.city+"/query";
    options = {
        url : url,
        headers:{
            "X-Algolia-API-Key": "e4226055c240f9e38e89794dcfb91766", 
            "X-Algolia-Application-Id": "I80Y2BQLSL",
            "User-Agent": "Algolia for Android (3.27.0); Android (6.0.1)"
        },
        json:{
            "params":"filters=&hitsPerPage="+req.query.hitsPerPage+"&page="+req.query.page+"&query="+req.query.query
        }
    }
    request.post(options,function(error,response,body){
        if(error !== null){
            res.status(500).send()
        } else {
            if(response.statusCode !== 200){
                res.status(404).send(body)
            } else {
                res.status(200).send(body)
            }
        }
    });
}

function getCities(req,res){
    const url = "http://beam.feverup.com/api/4.0/cities/?page=" + req.params.page;
    options = {
        url : url,
        headers:{
            "Accept": "application/json", 
            "Screen": "android@xxhdpi", 
            "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 6.0.1; A0001 Build/MTC20F)", 
            "Authorization": "Token " + req.headers.token, 
            "X-Client-Version": "4.5.21", 
            "Accept-Language": "es"
        }
    }

    request.get(options,function(error,response,body){
        if(error !== null){
            res.status(500).send()
        } else {
            if(response.statusCode !== 200){
                res.status(404).send(body)
            } else {
                res.status(200).send(JSON.parse(body));
            }
        }
    });

}

exports.getCities = getCities
exports.searchByWord = searchByWord
exports.redeemCode = redeemCode
exports.getPlanInfo = getPlanInfo
exports.googleLogin = googleLogin
exports.attendEvent = attendEvent
exports.findCoupons = findCoupons

