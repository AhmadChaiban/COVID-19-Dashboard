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

        data = [last_entry['confirmed'],last_entry['active'], last_entry['recovered'], last_entry['deaths']]

        ordinals = ['confirmed', 'recovered', 'deaths', 'active']

        if (error) throw error;

        // Scale the range of the data in the domains
        x.domain(ordinals.map(function(d,i) { return ordinals[i]; }));
        y.domain([0, d3.max(data, function(d,i) { return data[i]; })]);

        var colors = ['#EAD8BD', '#5A8895', '#9ECAE1', '#0E77B4'];

        // append the rectangles for the bar chart
        svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d,i) { return x(ordinals[i]) + 0.04376*width; })
        .attr("width", x.bandwidth()/4)
        .attr('rx', 10)
        .attr("y", function(d,i) { return y(data[i]); })
        .attr("height", function(d,i) { return height - y(data[i]); })
        .style('fill', function(d,i){
            return colors[i]
        });

        var titles = ['Confirmed', 'Active', 'Recoveries', 'Deaths']

        svg.selectAll('#latestCasesNode')
            .data(titles)
            .enter()
            .append('text')
            .text(function(d,i){
                return titles[i];
            })
            .style('fill','white')
            .attr('x', function(d,i){
                return x(ordinals[i]) + 0.04564*width;
            })
            .attr('y', function(d,i){
                return y(-8000);
            })
            .style('font-size', '80%');


        svg.selectAll('#latestCasesNode')
            .data(data)
            .enter()
            .append('text')
            .text(function(d,i){
                return data[i];
            })
            .style('fill','white')
            .attr('x', function(d,i){
                return x(ordinals[i]) + 0.04564*width;
            })
            .attr('y', function(d,i){
                return y(-4500);
            })
            .style('font-size', '80%');


        // add the x Axis
        // svg.append("g")
        // .attr("transform", "translate(0," + height + ")")
        // .call(d3.axisBottom(x))
        // .selectAll('text').style('fill', 'white');

        // add the y Axis
        // svg.append("g")
        // .call(d3.axisLeft(y))
        // .selectAll('text').style('fill','white');
        var parseDate = d3.timeParse("%Y-%m-%d");

        var todayDate = String(parseDate(last_entry['date'])).split(' ');


        svg.append('g')
            .append('text')
            .text("Latest Cases | " + todayDate[1]+' '+todayDate[2] + ' ' + todayDate[3])
            .attr('x', width/3)
            .style('fill', 'white')

    });
}