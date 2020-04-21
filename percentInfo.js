function worldPercent(){

    var width = document.getElementById('statusDiv').offsetWidth;
    var height = document.getElementById('statusDiv').offsetHeight;

    d3.selectAll('#statusNode').selectAll('*').remove()

    var svg = d3.selectAll('#statusNode')
                .append('g')
                .attr('width', width)
                .attr('height', height);

    d3.tsv("world_covid.tsv", function(data) {

        var aggregation = aggregate(data);

        var percent_of_world_infected = (aggregation[0]/7794798739) * 100;

        var percent_str = (percent_of_world_infected + '').substr(0,6) + '%'

        svg.selectAll('#statusNode')
            .data(percent_str)
            .enter()
            .append('text')
            .text(percent_str)
            .attr('x', 0.1881*width)
            .attr('y', 90)
            .style('fill', 'white')
            .style('font-size', 0.1567*width + 'px')

        svg.selectAll('#statusNode')
            .data(percent_str)
            .enter()
            .append('text')
            .text('Of People have been infected')
            .attr('x', 0.1567*width)
            .attr('y', 120)
            .style('fill', 'white')
            .style('font-size', 0.0501*width+'px')

    });

}