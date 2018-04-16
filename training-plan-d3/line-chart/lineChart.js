(function (global, stackOverflow, jquery, parameters) {
    var width = jquery(global).width();
    var height = jquery(global).height();

    var svg = d3.select('body')
        .append('svg')
        .attr({
            width: width,
            height: height
        });

    var line = d3.svg.line()
        .x(d => d.month*3)
        .y(d => h-d.sales)
        .interpolate('linear');

    svg.append('g')
        .attr({
            'class': 'line-group'
        });

    function drawLine(){
        

        var queue = d3.queue();
        

        stackOverflow
            .viaAuthenticationByCallBack((accessToken, key)  => {
                const urls = [
                    stackOverflow.tagsInfo({ fromDate: '2017-03-02', toDate: '2017-06-01' }),
                    stackOverflow.tagsInfo({ fromDate: '2017-06-02', toDate: '2017-09-01' }),
                    stackOverflow.tagsInfo({ fromDate: '2017-09-02', toDate: '2017-12-01' }),
                    stackOverflow.tagsInfo({ fromDate: '2017-12-02', toDate: '2018-03-01' }),
                ];

                urls.forEach(url => {
                    queue.defer(d3.json, `${url}&accessToken=${accessToken}&key=${key}`);
                    queue.awaitAll(function(error, dataSets) {
                        if (error) throw error;
                        
                        console.log(dataSets);
                      });
                });
            });
        

        var path = svg
                .select('g.line-group')
                .selectAll('path.tech')
                .data([])
                .enter()
                .append('path')
                .attr({
                    'class': 'tech',
                    d: line([]),
                    'stroke': 'purple',
                    'stroke-width': 2,
                    'fill': 'none'
                });
    }
    
    drawLine();

} (this, stackOverflow, $, parameters));