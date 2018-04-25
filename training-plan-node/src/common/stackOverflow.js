const config = require('./../../config');
const request = require('request');
const queryString = require('querystring');
const zlib = require('zlib');

function getDateParam(name, date)
{
    return date 
        ? `${name}=${Math.floor((new Date(date)).getTime()/1000)}&`
        : '';
}

function tags(queryStringObj, accessToken, key)
{
    let query = { 
        page: '',
        pagesize: '',
        fromdate: '',
        todate: '',
        order: '',
        min: '',
        max: '',
        sort: '', 
        inname: '',
        accessToken: '',
        key: ''
        };

    query = Object.assign(query, queryStringObj, { site: 'stackoverflow' });
    query.fromdate = getDateParam('fromdate', query.fromdate);
    query.todate = getDateParam('todate', query.todate);
    query.access_token = accessToken;
    query.key = key;
    return {
        query,
        url: `${config.commonUrl}tags`
    };
}

function getCode(returnUrl, onSuccess, onfail)
{
    var url = `https://stackoverflow.com/oauth?client_id=${config.clientId}&redirect_uri=${returnUrl}`;
    request({ url }, (err, response, body) => {
        if (err)
        {
            onfail(err);
            return;
        }
            
        onSuccess(response)
    });
}

function getAccessToken(code, redirectUri, onSuccess, onfail)
{
    const options = { 
        url: config.accessTokenUrl, 
        method: 'POST',
        json: { client_id: config.clientId, client_secret: config.client_secret, code: code, redirect_uri: redirectUri }
    }; 
    request(options, (err, response, body) => {
        if (err)
        {
            onfail(err);
            return;
        }
         
        onSuccess(response)
    });
}

function invoke(url, queryParams, onSuccess, onfail)
{
    var reqData = {
        url: `${url}?${queryString.stringify(queryParams)}`,
        method:"get",
        headers: {'Accept-Encoding': 'gzip'}
    }

    var gunzip = zlib.createGunzip();
    request(reqData)
        .pipe(gunzip);
  
    
    var json = "";
    gunzip.on('data', function(data){
        json += data.toString();
    });
    gunzip.on('end', function(){
        const parsedJson = JSON.parse(json);
        console.log(parsedJson);
        onSuccess(parsedJson);
    });
}
module.exports = {
    tags,
    getCode,
    getAccessToken,
    invoke
}