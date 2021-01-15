function latestCases(country){

    var document_width = document.getElementById('latestCaseDiv').offsetWidth
    // set the dimensions and margins of the graph
    var margin = {top: 50, right: 20, bottom: 70, left: 0.10152284*document_width},
    width = document.getElementById('latestCaseDiv').offsetWidth - margin.left - margin.right,
    height = document.getElementById('latestCaseDiv').offsetHeight - margin.top - margin.bottom;

    d3.selectAll("#latestCasesNode").selectAll('*').remove()
        
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
    d3.csv(`../CountryData/cases_per_day_diff_${country}.csv`, function(error, data) {

        // set the ranges
        var x = d3.scaleBand()
            .range([0, width])
            .padding(0.1);
        var y = d3.scaleLinear()
            .range([height, 0]);

        if (error) throw error;

        delete data['columns'];

        last_entry = data[data.length - 1]

        data = [Math.abs(last_entry['confirmed']),Math.abs(last_entry['active']), Math.abs(last_entry['recovered']), Math.abs(last_entry['deaths'])]

        ordinals = ['confirmed', 'recovered', 'deaths', 'active']

        // Scale the range of the data in the domains
        x.domain(ordinals.map(function(d,i) { 
            return ordinals[i]; 
        }));
        y.domain([0, d3.max(data, function(d,i) { 
            return 1.1*Math.max(data[i], data[i+1]); 
        })]);

        var colors = ['#C87F4C', '#65A17D', '#67AED5', '#CB9386'];

        // append the rectangles for the bar chart
        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d,i) { return x(ordinals[i]) + 0.04376*width; })
            .attr("width", x.bandwidth()/4)
            .attr('rx', 10)
            .attr("y", function(d,i) { 
                return y(data[i]); 
            })
            .attr("height", function(d,i) { 
                return height - y(data[i]); 
            })
            .style('fill', function(d,i){
                return colors[i]
            });

        var titles = ['Confirmed', 'Active', 'Recoveries', 'Deaths']

        console.log(height)


        svg.selectAll('svg')
            .data(titles)
            .enter()
            .append('text')
            .attr('class','.text1')
            .text(function(d,i){
                return titles[i];
            })
            .style('fill','white')
            .attr('x', function(d,i){
                return x(ordinals[i]) + 0.04564*width;
            })
            .attr('y', function(d,i){
                return 1.0967*height;
            })
            .style('font-size', '80%');


        svg.selectAll('svg')
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
                return 1.0483*height;
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