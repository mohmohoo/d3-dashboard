var drawCloud = (function () {
    'use strict';
    $.ajax({
        url: 'https://api.stackexchange.com/2.2/tags?order=desc&sort=popular&site=stackoverflow&pagesize=100',
        type: 'get'
      }).done(function(res) {
          var word_count = {};
          res.items.map(item => word_count[item.name] = item.count);
          console.log(Object.keys(word_count).length);
          drawWordCloud(word_count);
      });
      
    function drawWordCloud(word_count){
      var svg_location = "#chart";
      var width = $(document).width();
      var height = $(document).height();

      var fill = d3.scale.category20();

      var word_entries = d3.entries(word_count);

      var xScale = d3.scale.linear()
         .domain([0, d3.max(word_entries, function(d) {
            return d.value;
          })
         ])
         .range([10,100]);

      d3.layout.cloud().size([width, height])
        .timeInterval(20)
        .words(word_entries)
        .fontSize(function(d) { return xScale(+d.value); })
        .text(function(d) { return d.key; })
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
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
            .style("font-size", function(d) { return xScale(d.value) + "px"; })
            .style("font-family", "Impact")
            .style("fill", function(d, i) { return fill(i); })
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
              return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.key; });
      }

      d3.layout.cloud().stop();
    }

    return {
        drawWordCloud: drawWordCloud
    };
} ());