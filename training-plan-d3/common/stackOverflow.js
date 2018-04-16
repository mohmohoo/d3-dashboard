var stackOverflow = (function (jquery) {
    const commonUrl = 'https://api.stackexchange.com/2.2/';
    const channelUrl = 'http://172.17.186.83';
    let initialised = false;
    const key = 'htVlePLe1gyb*8bBdut9nQ(('; 

    function getDateParam(name, date)
    {
        if (date)
        {
            return `${name}=${Math.floor((new Date(date)).getTime()/1000)}&`;
        }

        return '';
    }

    function tags({ page, pagesize, fromdate, todate, order, min, max, sort, inname, site })
    {
        const fromDateStr = getDateParam('fromdate', fromdate);
        const toDateStr = getDateParam('toDate', todate);

        return `${commonUrl}tags?${fromDateStr}${toDateStr}order=${order}&sort=${sort}&site=${site}&pagesize=${pagesize}`;
    }

    function viaAuthentication(url, onSuccess, onfail)
    {
        if (!initialised)
        {
            SE.init({
                clientId: 12257,
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
                    console.log(authenticateUrl);
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

    return {
        tags,
        viaAuthentication
    };
} ($));