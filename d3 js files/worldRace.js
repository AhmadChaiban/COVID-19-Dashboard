function aggregate(json_array, country){
    console.log(country)
    if(country == 'all'){
        var total_confirmed = 0
        var total_recovered = 0
        var total_deaths = 0
        for(i=0; i<json_array.length;i++){
            total_confirmed += parseInt(json_array[i]['confirmed']);
            total_recovered += parseInt(json_array[i]['recovered']);
            total_deaths += parseInt(json_array[i]['deaths']);
        }
        var total_active = total_confirmed - total_recovered - total_deaths;
        return [total_confirmed, total_recovered, total_deaths, total_active];
    }
    else{
        for(i=0; i<json_array.length; i++){
            if(json_array[i]['name'] == country){
                return [json_array[i]['confirmed'], json_array[i]['recovered'], json_array[i]['deaths'], json_array[i]['active']]
            }
        }
    }
}


function worldRace(country){
        //Using this selection to update the SVG everytime the function is called
    d3.selectAll('#worldRace').selectAll('*').remove()

    d3.tsv("../world_covid.tsv", function(data) {
        
        var aggregation = aggregate(data, country)
        console.log(aggregation)

        // set the dimensions and margins of the graph
        var margin = {top: 10, right: 30, bottom: 0, left: 30},
            width = document.getElementById('worldRaceDiv').offsetWidth - margin.left - margin.right,
            height = document.getElementById('worldRaceDiv').offsetHeight*0.8 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.selectAll("#worldRace")
            .append("svg")
                .attr("width", document.getElementById('worldRaceDiv').offsetWidth + margin.left + margin.right)
                .attr("height", document.getElementById('worldRaceDiv').offsetHeight*1.2 + margin.top + margin.bottom)
            .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

        // X axis
        var domain_array = ['Confirmed', 'Recovered', 'Deaths', 'Active'];
        // var colors = ["rgb(33,113,181)","rgb(8,81,156)","rgb(8,48,107)","rgb(3,19,43)"]
        var colors = ["rgb(171, 250, 98)", "rgb(251, 222, 89)", "rgb(151, 250, 162)", "rgb(138, 251, 201)"]
        var x = d3.scaleBand()
            .range([ 0, width ])
            .domain(domain_array)
            .padding(1);

        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .style('fill', 'white')
            .style('stroke-width',0.5);

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, aggregation[0]])
            .range([ height, 90]);
        // svg.append("g")
        //     .style('stroke','white')
        //     .call(d3.axisLeft(y));

        // Lines
        svg.selectAll("myline")
        .data(aggregation)
        .enter()
        .append("line")
            .attr("x1", function(d,i) { return x(domain_array[i]); })
            .attr("x2", function(d,i) { return x(domain_array[i]); })
            .attr("y1", function(d,i) { return y(aggregation[i]); })
            .attr("y2", y(0))
            .attr("stroke", function(d,i){
                return colors[i]
            })
            .style('stroke-width', 5);

        // Circles
        svg.selectAll("mycircle")
        .data(aggregation)
        .enter()
        .append("circle")
            .attr("cx", function(d,i) { return x(domain_array[i]); })
            .attr("cy", function(d,i) { return y(aggregation[i]); })
            .attr("r", "4")
            .style("fill", "#69b3a2")
            .attr("stroke", "black");

        svg.selectAll('body')
            .data(aggregation)
            .enter()
            .append('text')
            .text(function(d,i){
                return numberWithCommas(aggregation[i]);
            })
            .style('fill','white')
            .attr('x', function(d,i){ return x(domain_array[i]) + 10})
            .attr('y', function(d,i){ return y(aggregation[i])})
            .style('font-size', 0.05*width + 'px');

        svg.selectAll('body')
            .data(['text'])
            .enter()
            .append('text')
            .text(function(d){
                if(country == 'all'){
                    return 'COVID-19 Worldwide Race'
                }
                else{
                    return `COVID-19 ${country} Race`
                }
            })
            .attr('x', width/12)
            .attr('y', 0.05*height)
            .style('fill','white')
            .style('font-size', 0.07*width + 'px');
        

    });
}
