function latestCases(){
    // set the dimensions and margins of the graph
    var margin = {top: 50, right: 20, bottom: 70, left: 80},
    width = document.getElementById('latestCaseDiv').offsetWidth - margin.left - margin.right,
    height = document.getElementById('latestCaseDiv').offsetHeight - margin.top - margin.bottom;

    d3.selectAll("#latestCasesNode").selectAll('*').remove()

    // set the ranges
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
    var y = d3.scaleLinear()
        .range([height, 0]);
        
    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#latestCasesNode").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", 
        "translate(" + margin.left + "," + margin.top + ")");

    // get the data
    d3.csv("cases_per_day_diff.csv", function(error, data) {

        delete data['columns'];

        last_entry = data[data.length - 1]

        data = [last_entry['confirmed'], last_entry['recovered'], last_entry['deaths'], last_entry['active'] ]

        ordinals = ['confirmed', 'recovered', 'deaths', 'active']

        if (error) throw error;

        // Scale the range of the data in the domains
        x.domain(ordinals.map(function(d,i) { return ordinals[i]; }));
        y.domain([0, d3.max(data, function(d,i) { return data[i]; })]);

        // append the rectangles for the bar chart
        svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d,i) { return x(ordinals[i]); })
        .attr("width", x.bandwidth())
        .attr("y", function(d,i) { return y(data[i]); })
        .attr("height", function(d,i) { return height - y(data[i]); });

        // add the x Axis
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll('text').style('fill', 'white');

        // add the y Axis
        svg.append("g")
        .call(d3.axisLeft(y))
        .selectAll('text').style('fill','white');

        svg.append('g')
            .append('text')
            .text("Today - " + last_entry['date'])
            .attr('x', width/2)
            .style('fill', 'white')

    });
}