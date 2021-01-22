var request = require('request');
var cryptoUtils = require('../cryptoUtils/cryptoUtils.js')
const https = require('https')

const base = "https://beam.feverup.com:443/api/4.1";

function refreshToken(req,res){
    const url = "https://beam.feverup.com:443/api/4.2/login/refresh/";
    options = {
        url : url,
        headers : {
            "Authorization": "Bearer " + req.body.auth_token,
            "Accept": "application/json",
            "Screen": "android@xxhdpi",
            "X-Client-Version": "5.4.20",
            "User-Agent": "Android Fever/5.4.20 Dalvik/2.1.0 (Linux; U; Android 10; MI 8 MIUI/V12.0.1.0.QEAMIXM)",
            "Accept-Language": "es",
            "Content-Type": "application/json",
            "Accept-Encoding": "gzip, deflate"

        },
        json : {
            "refresh":req.body.refresh_token
        }
        
    }
    request.post(options,function(error,response,body){
        if(error !== null){
            res.status(500).send()
        } else {
            if(response.statusCode !== 200){
                res.status(response.statusCode).send()
            } else {
                res.status(200).send({"token": body.access})
            }
        }
    });

}

function fbLogin(req,res){
    const url = "https://beam.feverup.com:443/api/4.2/login/facebook/";
    const xApiData = cryptoUtils.getXAPIData();
    options = {
        url : url,
        headers : {
            "Origin": "https://feverup.com", 
            "Accept": "application/json, text/plain, */*", 
            "X-API-Nonce": xApiData['X-API-Nonce'], 
            "User-Agent": "Mozilla/5.0", 
            "Referer": "https://feverup.com/oauth-callback",
            "X-API-Datetime": xApiData['X-API-Datetime'], 
            "Accept-Language": "es", 
            "X-API-Key": xApiData['X-API-Key'], 
            "X-API-Signature": xApiData['X-API-Signature'],
            "Content-Type": "application/json"
        },
        json : {
            "accepted_terms":[],
            "auth_token":req.body.auth_token,
            "client_version":"w.2.2",
            "signup_source":"fever"
        }
        
    }
    request.post(options,function(error,response,body){
        if(error !== null){
            res.status(500).send()
        } else {
            if(response.statusCode !== 200){
                res.status(response.statusCode).send()
            } else {
                res.status(200).send({"token": body.access,"refresh":body.refresh})
            }
        }
    });

}

////// DEPRECATED ////// 
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
    const url = base + "/plans/"+req.params.planId+"/";
    options = {
        url : url,
        headers:{
            "Accept": "application/json", 
            "Screen": "android@xxhdpi", 
            "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 6.0.1; A0001 Build/MTC20F)", 
            "Authorization": "Bearer " + req.headers.token,
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
                    "defaultSession": ( JSON.parse(body).default_session !== null) ? JSON.parse(body).default_session.id : null
                });
            }
        }
    });

}

function attendEvent(req,res){
    const url = base + "/sessions/"+req.params.sessionId+"/attend/";
    options = {
        url : url,
        headers:{
            "X-Client-Version": "4.5.5",
            "Screen": "android@xxhdpi",
            "Accept": "application/json",
            "Authorization": "Bearer " + req.headers.token,
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
    var url = base + "/vouchers/"+req.query.code+"/redeem/";

    options = {
        url : url,
        headers : {
            "Authorization": "Bearer " + req.headers.token,
            "Accept": "application/json",
            "Screen": "android@xxhdpi",
            "X-Client-Version": "5.4.5",
            "Accept-Language": "es",
            "Content-Type": "application/json",
            "Content-type": "application/json",
            "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 10; MI 8 MIUI/20.7.23)",
            "Host": "beam.feverup.com",
            "Connection": "close",
            "Accept-Encoding":" gzip, deflate"
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
    const url = base + "/cities/?page=" + req.params.page;
    options = {
        url : url,
        headers:{
            "Accept": "application/json", 
            "Screen": "android@xxhdpi", 
            "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 6.0.1; A0001 Build/MTC20F)", 
            "Authorization": "Bearer " + req.headers.token, 
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

function getTickets(req,res){
    const url = base + "/users/" + req.params.userid + "/tickets/?page=" + req.params.page;
    options = {
        url : url,
        headers:{
            "Accept": "application/json", 
            "Screen": "android@xxhdpi", 
            "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 6.0.1; A0001 Build/MTC20F)", 
            "Authorization": "Bearer " + req.headers.token, 
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

function getVouchers(req,res){
    const url = base + "/users/" + req.params.userid + "/vouchers"
    options = {
        url : url,
        headers:{
            "Accept": "application/json", 
            "Screen": "android@xxhdpi", 
            "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 6.0.1; A0001 Build/MTC20F)", 
            "Authorization": "Bearer " + req.headers.token, 
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

function getFavorites(req,res){
    const url = base + "/plans/favorites/?page=" + req.params.page;
    options = {
        url : url,
        headers:{
            "Accept": "application/json", 
            "Screen": "android@xxhdpi", 
            "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 6.0.1; A0001 Build/MTC20F)", 
            "Authorization": "Bearer " + req.headers.token, 
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
exports.fbLogin = fbLogin
exports.attendEvent = attendEvent
exports.refreshToken = refreshToken
exports.getTickets = getTickets
exports.getVouchers = getVouchers
exports.getFavorites = getFavorites