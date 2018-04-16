var drawCloud = (function (thisObj, stackoverflowLinks, jquery) {
    'use strict';
    const queryStringParams = (new URL(thisObj.location)).searchParams;
    const params = {
      page: queryStringParams.get("page") || 1,
      pagesize: queryStringParams.get("pagesize") || 100,
      fromdate: queryStringParams.get("fromdate"),
      todate: queryStringParams.get("todate"),
      order: queryStringParams.get("order") || 'desc',
      min: queryStringParams.get("min") || 1,
      max: queryStringParams.get("max") || 100,
      sort: queryStringParams.get("sort") || 'popular',
      inname: queryStringParams.get("inname") || '',
      site: queryStringParams.get("site") || 'stackoverflow',
    };

    function init() {
      console.log(params);
      const url = stackOverflow.tags(params);
      
      stackOverflow
        .viaAuthenticationByUrl(url, 
          res => {
            var word_count = {};
            res.items.map(item => word_count[item.name] = item.count);
            drawWordCloud(word_count);
          }, 
        (error) => console.log(error));
    }

    function drawWordCloud(word_count){
      var svg_location = "#chart";
      var width = jquery(document).width();
      var height = jquery(document).height();

      var fill = d3.scale.category20();

      var word_entries = d3.entries(word_count);

      var xScale = d3.scale.linear()
         .domain([0, d3.max(word_entries, d => d.value)])
         .range([10,100]);

      d3.layout.cloud().size([width, height])
        .timeInterval(20)
        .words(word_entries)
        .fontSize(d => xScale(+d.value))
        .text(d => d.key)
        .rotate(() => ~~(Math.random() * 2) * 90)
        .font("Impact")
        .on("end", draw)
        .start();

      function draw(words) {
        d3.select(svg_location).append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + [width >> 1, height >> 1] + ")")
          .selectAll("text")
            .data(words)
          .enter().append("text")
            .style("font-size", d => xScale(d.value) + "px")
            .style("font-family", "Impact")
            .style("fill", (d, i) => fill(i))
            .attr("text-anchor", "middle")
            .attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
            .text(d => d.key);
      }

      d3.layout.cloud().stop();
    }

    init({});
} (this, stackOverflow, $));