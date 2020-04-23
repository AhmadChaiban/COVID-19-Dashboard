function lineGraph(){

    var svg = d3.selectAll("#lineNode"),
        margin = {top: 20, right: 60, bottom: 70, left: 80},
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

    svg.append("rect")
        .attr("class", "zoom")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoom);

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
            .selectAll('text')
                .attr('transform', 'translate(0,10) rotate(-45)')
                .style('fill', 'white');

        focus.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis)
            .selectAll('text')
                .style('fill', 'white');

        Line_chart.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line)
            .attr('id','lineCursor')
            .style('stroke','white')
            .attr('visibility','visible');

        Line_chart.append("path")
            .datum(data)
            .attr("class", "line_recovered")
            .attr("d", line_recovered)
            .attr('id','lineCursor')
            .style('stroke', '#EAD8BD')
            .attr('visibility','visible');

        Line_chart.append("path")
            .datum(data)
            .attr("class", "line_active")
            .attr("d", line_active)
            .attr('id','lineCursor')
            .style('stroke','#5A8895')
            .attr('visibility','visible');

        Line_chart.append("path")
            .datum(data)
            .attr("class", "line_deaths")
            .attr("d", line_deaths)
            .attr('id','lineCursor')
            .style('stroke', '#0E77B4')
            .attr('visibility','visible');

        // svg.append('rect')
        //     .style('stroke','white')
        //     .style('fill','grey')
        //     .attr('width', 100)
        //     .attr('height',100)
        //     .attr('x', 10)
        //     .attr('y', 10)
        //     .attr("transform","translate(100,100)");

        var colors = ['white', '#5A8895', '#EAD8BD', '#0E77B4'];

        
        Line_chart.selectAll('#lineNode')
            .append('g')
            .data(colors)
            .enter()
            .append('line')
            .attr('x1', 0.15*width)
            .attr('x2', 0.1*width)
            .attr('y1',function(d,i){
                return 25*i +32;
            })
            .attr('y2',function(d,i){
                return 25*i +32;
            })
            .style('stroke', function(d,i){
                return colors[i];
            })
            .style('stroke-width',2);

        var bisect = d3.bisector(function(d) { return d.date; }).right;


        Line_chart.append('line')
            .attr('class', 'line_indicator')
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('y1', 0)
            .attr('y2', height)
            .style('stroke', 'white'); 

        // d3.selectAll('#lineNode')       
        //     .on('mousemove', function(d){
        //         d3.selectAll('.line_indicator')
        //             .attr('transform', 'translate(' + d3.mouse(this)[0] + ',' + 0 + ')');

        //         console.log(x(d3.mouse(this)[0]))

        //     })
        //     // .on('click', function(d){
        //     //     d3.selectAll('.line_indicator')
        //     //         .attr('transform', 'translate(' + d3.mouse(this)[0] + ',' + 0 + ')');
        //     // })
        //     .call(drag);

        var line_classes = ['.line','.line_active', '.line_recovered','.line_deaths']

        var mouseG = svg.append("g")
        .attr("class", "mouse-over-effects")
        .attr('transform', 'translate(+80,+20)');
        // .call(zoom);
      
        mouseG.append("path") // this is the black vertical line to follow mouse
            .attr("class", "mouse-line")
            .style("stroke", "white")
            .style("stroke-width", "1px")
            .style("opacity", "0");            
        // var line_active = document.getElementsByClassName('line ');

        var columns = []

        for(i=0;i<line_classes.length;i++){
            if(d3.selectAll(line_classes[i]).attr('visibility') == 'visible'){
                columns.push(i)
            }
        }
      
        var mousePerLine = mouseG.selectAll('.mouse-per-line')
            .data(columns)
            .enter()
            .append("g")
            .attr("class", "mouse-per-line")
            .attr('id', function(d,i){
                return 'mouseLine'+i;
            });
      
        mousePerLine.append("circle")
            .attr("r", 10)
            .style("stroke", function(d) {
                return 'white';
            })
            .style("fill", "none")
            .style("stroke-width", "0.5px")
            .style("opacity", "0");
      
        mousePerLine.append("text")
            .attr("transform", "translate(10,3)");
      
          mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
            .attr('width', width) // can't catch mouse events on a g element
            .attr('height', height)
            .attr('fill', 'none')
            .attr('pointer-events', 'all')
            .on('mouseout', function() { // on mouse out hide line, circles and text
              d3.select(".mouse-line")
                .style("opacity", "0");
              d3.selectAll(".mouse-per-line circle")
                .style("opacity", "0");
              d3.selectAll(".mouse-per-line text")
                .style("opacity", "0");
            })
            .on('mouseover', function() { // on mouse in show line, circles and text
              d3.select(".mouse-line")
                .style("opacity", "1");
              d3.selectAll(".mouse-per-line circle")
                .style("opacity", "1");
              d3.selectAll(".mouse-per-line text")
                .style("opacity", "1");
            })
            .on('mousemove', function() { // mouse moving over canvas
              var mouse = d3.mouse(this);
              d3.select(".mouse-line")
                .attr("d", function() {
                  var d = "M" + mouse[0] + "," + height;
                  d += " " + mouse[0] + "," + 0;
                  return d;
                });

                var lines = [
                                document.getElementsByClassName('line'),
                                document.getElementsByClassName('line_active'),
                                document.getElementsByClassName('line_recovered'),
                                document.getElementsByClassName('line_deaths')
                            ]
                d3.selectAll(".mouse-per-line")
                    .attr("transform", function(d,i) {
                    var xDate = x.invert(mouse[0]),
                        bisect = d3.bisector(function(d) { return data[i].date; }).right;
                        idx = bisect(d, xDate);   

                    
                    var beginning = 0,
                        end = lines[i][0].getTotalLength(),
                        target = null;
        
                    while (true){
                        target = Math.floor((beginning + end) / 2);
                        pos = lines[i][0].getPointAtLength(target);
                        if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                            break;
                        }
                        if (pos.x > mouse[0])      end = target;
                        else if (pos.x < mouse[0]) beginning = target;
                        else break; //position found
                    }

                    var columns = []

                    for(j=0;j<line_classes.length;j++){
                        if(d3.selectAll(line_classes[j]).attr('visibility') == 'visible'){
                            columns.push(j)
                        }
                    }


                    if(String(d3.selectAll(line_classes[i]).attr('visibility')) == 'visible'){                    
                    
                    d3.select(this).select('text')
                        .text(y.invert(pos.y).toFixed(0) + ' ' + String(x.invert(pos.x)).split(' ')[1] + ' ' +String(x.invert(pos.x)).split(' ')[2])
                        .style('fill','white')
                        .attr('transform', function(d){
                            // if (i%2 == 0)
                            //     return 'translate(-140,0)'
                            // else
                            //     return 'translate(0,0)'
                            return 'translate(-140,0)'
                        });  
                        
                        return "translate(" + (mouse[0]) + "," + pos.y +")";
                    }
                    
                    });

            });

            var columns = ['Confirmed', 'Active', 'Recovered', 'Deaths']


                mouseG.selectAll('#lineNode')
                    .append('g')
                    .data(columns)
                    .enter()
                    .append('text')
                    .text(function(d,i){
                        return columns[i];
                    })
                    .style('fill','white')
                    .style('font-size', '12px')
                    .attr('x',0.18*width)
                    .attr('y', function(d,i){
                        return 25*i + 35
                    }).on('click', function(d,i){
                        if(d3.selectAll(line_classes[i]).attr('visibility') == 'hidden'){
                            d3.selectAll(line_classes[i]).attr('visibility', 'visible')
                            d3.selectAll('#mouseLine'+i).attr('visibility','visible')
                            
                        }
                        else{
                            d3.selectAll(line_classes[i]).attr('visibility', 'hidden')
                            d3.selectAll('#mouseLine'+i).attr('visibility','hidden')

                        }
                    })
                    .on('mouseover', function(d,i){
                        d3.selectAll(line_classes[i]).style('opacity',0.4)
                    })
                    .on('mouseout', function(d,i){
                        d3.selectAll(line_classes[i]).style('opacity',0.7)
                    });

    });


    function brushed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "mouse-over-effects") return; // ignore brush-by-zoom
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