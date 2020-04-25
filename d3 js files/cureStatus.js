function cureStatus(){

    var width = document.getElementById('statusDiv').offsetWidth
    var height = document.getElementById('statusDiv').offsetHeight

    console.log('status width')

    var svg = d3.selectAll('#statusNode')
                .append('g')
                .attr('width', width)
                .attr('height', height)


    var rect_array = [1]

    // svg.selectAll('g')
    //     .data(rect_array)
    //     .enter()
    //     .append('rect')
    //     .attr('y', 10)
    //     .attr('x', 40)
    //     .attr("rx", 6)
    //     .attr("ry", 6)
    //     .attr('width', width/1.3)
    //     .attr('height', height/2)
    //     .style('fill', 'black');

    var myimage = svg.append('image')
        .attr('xlink:href', './images/biohazard.png')
        .attr('width', 40)
        .attr('height', 200)
        .attr('x', 50)
        .attr('y', -50);

    var myimage2 = svg.append('image')
        .attr('xlink:href', './images/biohazard.png')
        .attr('width', 40)
        .attr('height', 200)
        .attr('x', 230)
        .attr('y', -50);

    var myimage3 = svg.append('image')
        .attr('xlink:href', './images/bio2.jpg')
        .attr('width', 60)
        .attr('height', 200)
        .attr('x', width/2.35)
        .attr('y', -50);


    

}