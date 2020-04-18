function lineGraph(){

    var svg = d3.selectAll("#lineNode"),
        margin = {top: 120, right: 50, bottom: 110, left: 100},
        margin2 = {top: 430, right: 20, bottom: 30, left: 40},
        width = document.getElementById('lineDiv').offsetWidth - margin.left - margin.right,
        height = document.getElementById('lineDiv').offsetHeight - margin.top - margin.bottom,
        height2 = document.getElementById('lineDiv').offsetHeight - margin2.top - margin2.bottom;

    svg.selectAll('*').remove()

    var parseDate = d3.timeParse("%Y-%m-%d");

    var x = d3.scaleTime().range([0, width]),
        x2 = d3.scaleTime().range([0, width]),
        y = d3.scaleLinear().range([height, 0]),
        y2 = d3.scaleLinear().range([height2, 0]);

    var xAxis = d3.axisBottom(x),
        xAxis2 = d3.axisBottom(x2),
        yAxis = d3.axisLeft(y);

    var brush = d3.brushX()
        .extent([[0, 0], [width, height2]])
        .on("brush end", brushed);

    var zoom = d3.zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([[0, 0], [width, height]])
        .extent([[0, 0], [width, height]])
        .on("zoom", zoomed);

        var line = d3.line()
            .x(function (d) { return x(d.date); })
            .y(function (d) { return y(parseInt(d.confirmed)); });

        var line_recovered = d3.line()
            .x(function (d) { return x(d.date); })
            .y(function (d) { return y(parseInt(d.recovered)); });

        var line_active = d3.line()
            .x(function (d) { return x(d.date); })
            .y(function (d) { return y(parseInt(d.active)); });

        var line_deaths = d3.line()
            .x(function (d) { return x(d.date); })
            .y(function (d) { return y(parseInt(d.deaths)); });

        var clip = svg.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", width)
            .attr("height", height)
            .attr("x", 0)
            .attr("y", 0); 


        var Line_chart = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("clip-path", "url(#clip)");


        var focus = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    d3.csv("cases_per_day_agg.csv", type, function (error, data) {
    if (error) throw error;
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function (d) { return parseInt(d.confirmed); })]);
    x2.domain(x.domain());
    y2.domain(y.domain());

        focus.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .style('stroke', 'white');

        focus.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis)
            .style('stroke', 'white');

        Line_chart.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line)
            .style('stroke','white');

        Line_chart.append("path")
            .datum(data)
            .attr("class", "line_recovered")
            .attr("d", line_recovered)
            .style('stroke', '#EAD8BD');

        Line_chart.append("path")
            .datum(data)
            .attr("class", "line_active")
            .attr("d", line_active)
            .style('stroke','#5A8895');

        Line_chart.append("path")
            .datum(data)
            .attr("class", "line_deaths")
            .attr("d", line_deaths)
            .style('stroke', '#0E77B4');



    //     context.append("path")
    //         .datum(data)
    //         .attr("class", "line")
    //         .attr("d", line2);


    //   context.append("g")
    //       .attr("class", "axis axis--x")
    //       .attr("transform", "translate(0," + height2 + ")")
    //       .call(xAxis2);

    //   context.append("g")
    //       .attr("class", "brush")
    //       .call(brush)
    //       .call(brush.move, x.range());

    svg.append("rect")
        .attr("class", "zoom")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoom);


        var columns = ['Confirmed', 'Active', 'Recovered', 'Deaths']

        // svg.append('rect')
        //     .style('stroke','white')
        //     .style('fill','grey')
        //     .attr('width', 100)
        //     .attr('height',100)
        //     .attr('x', 10)
        //     .attr('y', 10)
        //     .attr("transform","translate(100,100)");

        svg.selectAll('#lineNode')
            .append('g')
            .data(columns)
            .enter()
            .append('text')
            .text(function(d,i){
                return columns[i];
            })
            .style('fill','white')
            .attr('x',200)
            .attr('y', function(d,i){
                return 25*i + 130
            });

        var colors = ['white', '#EAD8BD', '#5A8895', '#0E77B4'];

        
        svg.selectAll('#lineNode')
            .append('g')
            .data(colors)
            .enter()
            .append('line')
            .attr('x1', 180)
            .attr('x2', 160)
            .attr('y1',function(d,i){
                return 25*i +127;
            })
            .attr('y2',function(d,i){
                return 25*i +127;
            })
            .style('stroke', function(d,i){
                return colors[i];
            })
            .style('stroke-width',2);


        Line_chart.append('line')
            .attr('class', 'line_indicator')
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('y1', 0)
            .attr('y2', height)
            .style('stroke', 'white'); 

        d3.selectAll('#lineNode')          
            .on('mousemove', function(d){
                d3.selectAll('.line_indicator')
                    .attr('transform', 'translate(' + d3.mouse(this)[0] + ',' + 0 + ')');
            })
            // .on('click', function(d){
            //     d3.selectAll('.line_indicator')
            //         .attr('transform', 'translate(' + d3.mouse(this)[0] + ',' + 0 + ')');
            // })
            .call(drag);

    });


    function brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
    var s = d3.event.selection || x2.range();
    x.domain(s.map(x2.invert, x2));
    Line_chart.select(".line").attr("d", line);
    focus.select(".axis--x").call(xAxis);
    svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
        .scale(width / (s[1] - s[0]))
        .translate(-s[0], 0));
    }

    function zoomed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
    var t = d3.event.transform;
    x.domain(t.rescaleX(x2).domain());
    Line_chart.select(".line").attr("d", line);
    Line_chart.select(".line_recovered").attr("d", line_recovered);
    Line_chart.select(".line_active").attr("d", line_active);
    Line_chart.select(".line_deaths").attr("d", line_deaths);
    focus.select(".axis--x").call(xAxis);
    context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
    }

    function type(d) {
    d.date = parseDate(d.date);
    d.confirmed = parseInt(d.confirmed);
    d.recovered = parseInt(d.recovered);
    d.active = parseInt(d.active);
    d.deaths = parseInt(d.deaths);
    return d;
    }

var drag = d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);

function dragstarted(d) {
    d3.selectAll('.line_indicator').style("stroke", "white");
  }

  function dragged(d) {

    d3.selectAll('.line_indicator')
                    .attr('transform', 'translate(' + d3.event.x + ',' + 0 + ')')

    // d3.select(this).raise().attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
  }

  function dragended(d) {
    d3.selectAll('.line_indicator').attr("stroke", 'white');
  }
}