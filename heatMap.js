function heatMap(){

    var svg = d3.selectAll('#node').attr('width',document.getElementById('divBox').offsetWidth);
        //Using this selection to update the SVG everytime the function is called
    svg.selectAll("*").remove();

    var format = d3.format(",");

// Set tooltips
    var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Confirmed: </strong><span class='details'>" + format(d.confirmed) +"<br></span>"
                + "<strong>Recovered: </strong><span class='details'>" + format(d.recovered) +"<br></span>" + "<strong>Deaths: </strong><span class='details'>" + format(d.deaths) +"<br></span>"
                + "<strong>Active: </strong><span class='details'>" + format(d.confirmed - d.recovered - d.deaths) +"<br></span>";
                })

    var margin = {top: 0, right: 0, bottom: 0, left: 10},
                width = document.getElementById('divBox').offsetWidth - margin.left - margin.right,
                height = document.getElementById('divBox').offsetHeight*1.8 - margin.top - margin.bottom;

    var color = d3.scaleThreshold()
        .domain([10000,100000,500000,1000000,5000000,10000000,50000000,100000000,500000000,1500000000])
        .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)","rgb(33,113,181)","rgb(8,81,156)","rgb(8,48,107)","rgb(3,19,43)"]);

    var path = d3.geoPath();

    // const zoom = d3.zoom()
    //     .scaleExtent([1, 40])
    //     .translateExtent([[0,0], [width, height]])
    //     .extent([[0, 0], [width, height]])
    //     .on("zoom", zoommove);

    var zoom = d3.zoom()
        .scaleExtent([1, 100])
        .on('zoom', zoomFn);

    var svg = d3.select("svg")
                .attr("width", width)
                .attr("height", height)
                .append('g')
                .attr('class', 'map');
                // .call(zoom);
              
    function zoomFn() {
        d3.select('#divBox').select('svg').select('g').attr('transform', 'translate(' + d3.event.transform.x + ',' + d3.event.transform.y + ') scale(' + d3.event.transform.k + ')');
    }

    var projection = d3.geoMercator()
                    .scale(0.03939*width/1.5 + 0.104166*height-20)
                    .translate( [width / 2, height / 2.1]);

    var path = d3.geoPath().projection(projection);

    svg.call(tip);

    queue()
        .defer(d3.json, "world_countries.json")
        .defer(d3.tsv, "world_covid.tsv")
        .await(ready);

    function ready(error, data, population) {
    var populationById = {};

    population.forEach(function(d) { 
        
        populationById[d.id] = +d.confirmed;
        populationById[d.id+1] = +d.recovered;
        populationById[d.id+2] = +d.deaths;
    
    });
    data.features.forEach(function(d) { 
        
        d.confirmed = populationById[d.id] 
        d.recovered = populationById[d.id+1]
        d.deaths = populationById[d.id+2]    

    });

    svg.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(data.features)
        .enter().append("path")
        .attr("d", path)
        .style("fill", function(d) { return color(populationById[d.id]*100); })
        .style('stroke', 'white')
        .style('stroke-width', 1.5)
        .style("opacity",1)
        // tooltips
            .style("stroke","white")
            .style('stroke-width', 0.3)
            .on('mouseover',function(d){
            tip.show(d);

            d3.select(this)
                .style("opacity", 1)
                .style("stroke","white")
                .style("stroke-width",3);
            })
            .on('mouseout', function(d){
            tip.hide(d);

            d3.select(this)
                .style("opacity", 0.8)
                .style("stroke","white")
                .style("stroke-width",0.3);
            });

    svg.append("path")
        .datum(topojson.mesh(data.features, function(a, b) { return a.id !== b.id; }))
        // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
        .attr("class", "names")
        .attr("d", path);
    }
}