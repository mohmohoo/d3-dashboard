
var drawCloud = (function (jquery) {
    'use strict';

    function init() {
      drawWordCloud(word_count)
    }

    function drawWordCloud(word_count){
      var svg_location = "#vis-area";
      var $svg_location = jquery(svg_location);
      var main = jquery('main'); 
      var width = $svg_location.width();
      var height = $svg_location.height();
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
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet')
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
} ($));