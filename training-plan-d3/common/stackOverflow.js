var stackOverflow = (function (jquery) {
    const commonUrl = 'https://api.stackexchange.com/2.2/';
    //const channelUrl = 'http://172.17.186.83';
    const channelUrl = 'http://localhost';
    let initialised = false;
    const key = 'htVlePLe1gyb*8bBdut9nQ(('; 
    const clientId = 12257;
    function getDateParam(name, date)
    {
        return date 
            ? `${name}=${Math.floor((new Date(date)).getTime()/1000)}&`
            : '';
    }

    function tags({ page, pagesize, fromdate, todate, order, min, max, sort, inname, site })
    {
        const fromDateStr = getDateParam('fromdate', fromdate);
        const toDateStr = getDateParam('toDate', todate);

        return `${commonUrl}tags?${fromDateStr}${toDateStr}order=${order}&sort=${sort}&site=${site}&pagesize=${pagesize}`;
    }

    function tagsInfo({ 
        page = 1, 
        pageSize = 100, 
        fromDate = '2013-01-01', 
        toDate = '2018-01-01', 
        order = 'desc', 
        min = 1,
        max = 9999999,
        sort = 'popular',
        tags = 'javascript;', 
        site = 'stackoverflow' })
    {
        const fromDateStr = getDateParam('fromdate', fromDate);
        const toDateStr = getDateParam('toDate', toDate);
        return `${commonUrl}tags/${tags}/info?order=${order}&sort=${sort}&site=${site}&page=${page}&pagesize=${pageSize}&fromDate=${fromDate}&toDate=${toDate}&min=${min}&max=${max}`;
    }

    function viaAuthenticationByUrl(url, onSuccess, onfail)
    {
        if (!initialised)
        {
            SE.init({
                clientId: clientId,
                key: key,
                channelUrl: channelUrl,
                complete: function (data) { 
                  console.log('Init success');
                }
            });

            initialised = true;
        }
        
        SE.authenticate({
            success: data => 
                {
                    const authenticateUrl = `${url}&accessToken=${data.accessToken}&key=${key}`;
                    jquery
                        .ajax({
                            url: authenticateUrl,
                            type: 'get'
                        })
                        .done(res  => onSuccess(res))
                        .fail(error => onfail(error));
                },
            error: err => onfail(err),
            networkUsers: true
        });
    }

    function viaAuthenticationByCallBack(callBack)
    {
        if (!initialised)
        {
            SE.init({
                clientId: clientId,
                key: key,
                channelUrl: channelUrl,
                complete: function (data) { 
                  console.log('Init success');
                }
            });

            initialised = true;
        }
        
        SE.authenticate({
            success: data => callBack(data.accessToken, key),
            error: err => console.log(err),
            networkUsers: true
        });
    }

    return {
        tags,
        tagsInfo,
        viaAuthenticationByUrl,
        viaAuthenticationByCallBack
    };
} ($));