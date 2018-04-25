const express = require('express');
const path = require('path');
const stackOverflow = require('./src/common/stackOverflow');
const url = require('url');
const querystring = require('querystring');
const config = require('./config');

const app = express();
const port = process.env.port || 3000;

console.log(path.join(__dirname, './public'));

app.use(express.static(path.join(__dirname, './public')));
app.set('views', './src/views');
app.set('view engine', 'pug');

if (process.env.env === 'development') {
    app.locals.pretty = true;
}

app.use(function(req, res, next) {
    for (var key in req.query)
    { 
      req.query[key.toLowerCase()] = req.query[key];
    }
    next();
  });

app.get('/word-cloud', (request, response) => {
    var code = request.query.code;

    let redirectUrl = url.format({
        protocol: request.protocol,
        host: request.get('host'),
        pathname: request.originalUrl,
    });
    var parsedUrl = url.parse(querystring.unescape(redirectUrl)); 
    redirectUrl = url.format({
        protocol: parsedUrl.protocol,
        host: parsedUrl.host,
        pathname: parsedUrl.pathname
    });

    if (!code)
    {
        stackOverflow
            .getCode(
                redirectUrl,
                stackOverflowResponse => { 
                    response.redirect(stackOverflowResponse.request.uri.href);
                    
                })
        return;
    }

    stackOverflow
        .getAccessToken(code, redirectUrl, stackOverflowResponse => {
            var data = {};
            var expirableToken = querystring.parse(stackOverflowResponse.body);
            var tagsUrl = stackOverflow.tags({}, expirableToken.access_token, config.key);
            stackOverflow.invoke(tagsUrl.url, tagsUrl.query, data => {
                var transformedData = {};
                data.items.map(item => transformedData[item.name] = item.count); 
                response.render('word-cloud', { data: transformedData }); 
            }, 
            err => console.log(err))
        });
});

app.listen(port, () => console.log(`app running at ${port}`));