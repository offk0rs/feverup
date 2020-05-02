const crypto = require('crypto');
var iconv  = require('iconv-lite');
var uuid = require('uuid-random');

var cArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' ]

function getSuuid(currSuuid){
    var sb2 = currSuuid + ":NuctAipsacAkyixtaumliHyuHykugUpJawbijrybAud";
    return { 'uuid' : String(currSuuid +":"+ feverSha1(sb2))};
}

function getXAPIData(){
    var randomUUID = uuid().replace("-","").substring(0,8);
    var currentMillis = String(parseInt(new Date().getTime() / 1000));
    var sb = "NuctAipsacAkyixtaumliHyuHykugUpJawbijrybAud"+currentMillis+randomUUID
    return {
        'X-API-Key' : 'fSjmqAfvvXrAV1Fi6372MnGXrAu2aEAPrUQ5P3rifVM',
        'X-API-Datetime':currentMillis,
        'X-API-Nonce':randomUUID,
        'X-API-Signature':feverSha1(sb)
    }
}

function feverSha1(txt){
    var bArr = crypto.createHash('sha1').update(iconv.encode(txt, "ISO-8859-1"),'ascii').digest();
    var shaRet = ""
    var i2 = 0;
    for (var i3 = 0; i3 < bArr.length; i3++) {
        var i4 = i2 + 1;
        shaRet += cArr[(bArr[i3] & 0xF0) >>> 4];
        i2 = i4 + 1;
        shaRet += cArr[bArr[i3] & 0xF];
      } 
    return shaRet;
}

exports.getSuuid = getSuuid;
exports.getXAPIData = getXAPIData;