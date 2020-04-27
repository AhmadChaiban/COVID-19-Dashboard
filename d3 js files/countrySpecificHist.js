

function countrySpecificHist(country){

    var parseDate = d3.timeParse("%Y-%m-%d");

        d3.csv(`../CountryData/cases_per_day_diff_${country}.csv`, function(error ,data_entry) {

        delete data_entry['columns'];

        let data = []
        let ordinals = []

        for(let i = 0;i < data_entry.length; i++){
        data.push({
            value: data_entry[i].confirmed,
            value_rec: data_entry[i].recovered,
            value_active: data_entry[i].active,
            value_dead: data_entry[i].deaths,
        })

        ordinals.push(parseDate(data_entry[i].date))
        }

        let margin = {
            top: 20,
            right: 50,
            bottom: 0,
            left: 80
            },
            width = document.getElementById('histogramDiv').offsetWidth - margin.left - margin.right,
            height = document.getElementById('histogramDiv').offsetHeight*0.9 - margin.top - margin.bottom,
            radius = (Math.min(width, height) / 2) - 10,
            node

        d3.selectAll('#histogramNode').selectAll('*').remove()        

        var svg = d3.select('#histogramNode')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.left + margin.right )
                    .append('g')
                    .attr('transform', `translate(${margin.left}, ${margin.top})`)
                    // .call(
                    //     d3.zoom()
                    //     .translateExtent([[0,0], [width, height]])
                    //     .extent([[0, 0], [width, height]])
                    //     .on('zoom', zoom)
                    // )
        

        // the scale
        let x = d3.scaleLinear().range([0, width])
        let y = d3.scaleLinear().range([height, 0])
        let color = d3.scaleOrdinal(d3.schemeCategory10)
        let xScale = x.domain([-1, ordinals.length])
        let yScale = y.domain([0, d3.max(data, function(d,i){return parseInt(data[i].value)})])
        // for the width of rect
        let xBand = d3.scaleBand().domain(d3.range(-1, ordinals.length)).range([0, width])

        // zoomable rect
        // svg.append('rect')
        // .attr('class', 'zoom-panel')
        // .attr('width', width)
        // .attr('height', height)

        // x axis
        let xAxis = svg.append('g')
        .style('stroke-width',1)
        .attr('class', 'xAxis')
        .style('font-size','10px')
        .attr('transform', `translate(0, ${height})`)
        .call(
            d3.axisBottom(xScale).tickFormat((d,i) => {
            split_date = String(ordinals[d]).split(' ')
            // console.log(split_date)
            if(undefined != ordinals[d]){
                return split_date[1] + ' ' + split_date[2] 
            }
            })
        )
        .selectAll('text').style('fill','white').attr('transform', `translate(0,10) rotate(-45)`)

        var drag = d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);

        // var fakeClick = function(svg) {
        //     var event = document.createEvent('MouseEvents');
        //     event.initMouseEvent('click');
        //     svg.dispatchEvent(event);
        // };

        function dragstarted(d) {
            
          }
        
          function dragged(d) {
            d3.select(this).style('opacity',0.4);
                        svg.append('g')
                            .append('text')
                            .text(function(d){
                                new_date = String(ordinals[i]).split(' ')
                                return `(${data[i]['value']} , ${new_date[1]} ${new_date[2]})`;
                            })
                            .style('stroke','black')
                            .style('stroke-width', 1.5)
                            .attr('x', xScale(i) - 50*xBand.bandwidth()*0.9/2)
                            .attr('y', yScale(parseInt(d.value)))
                            .attr('class','detailText');
                            
          }

          
          function dragended(d) {

          }

        // y axis
        let yAxis = svg.append('g')
                    .attr('class', 'y axis')
                    // .style('stroke','white')
                    .call(d3.axisLeft(yScale))
                    .selectAll('text').style('fill','white')

        let bars = svg.append('g')
                    .attr('clip-path','url(#my-clip-path)')
                    .selectAll('.bar')
                    .data(data)
                    .enter()
                    .append('rect')
                    .attr('class', 'bar')
                    .attr('id', 'bar1')
                    .attr('x', function(d, i){
                    return xScale(i) - xBand.bandwidth()*0.9/2
                    })
                    .attr('y', function(d, i){
                    return yScale(parseInt(d.value))
                    })
                    .style('fill', 'EAD8BD')
                    .style('opacity', 1)
                    .attr('width', xBand.bandwidth()*0.9)
                    .attr('height', function(d){
                    return Math.abs(height - yScale(d.value))
                    })
                    .on('mouseover', function(d,i){
                        d3.select(this).style('opacity',0.4);
                        svg.append('g')
                            .append('text')
                            .text(function(d){
                                new_date = String(ordinals[i]).split(' ')
                                return `(${data[i]['value']} , ${new_date[1]} ${new_date[2]})`;
                            })
                            .style('stroke','black')
                            .style('stroke-width', 1.5)
                            .attr('x', xScale(i) - 50*xBand.bandwidth()*0.9/2)
                            .attr('y', yScale(parseInt(d.value)))
                            .attr('class','detailText');
                    })
                    .on('click', function(d,i){
                        d3.select(this).style('opacity',0.4);
                        svg.append('g')
                            .append('text')
                            .text(function(d){
                                new_date = String(ordinals[i]).split(' ')
                                return `(${data[i]['value']} , ${new_date[1]} ${new_date[2]})`;
                            })
                            .style('stroke','black')
                            .style('stroke-width', 1.5)
                            .attr('x', xScale(i) - 50*xBand.bandwidth()*0.9/2)
                            .attr('y', yScale(parseInt(d.value)))
                            .attr('class','detailText');
                    })
                    .on('mouseout', function(d,i){
                        d3.selectAll('.detailText').remove()
                        d3.select(this).style('opacity',1)
                    })
                    // .call(drag)
                    .attr('visibility', 'visible')

        
        let bars2 = svg.append('g')
                    .attr('clip-path','url(#my-clip-path)')
                    .selectAll('.bar')
                    .data(data)
                    .enter()
                    .append('rect')
                    .attr('class', 'bar')
                    .attr('id', 'bar2')
                    .attr('x', function(d, i){
                    return xScale(i) - xBand.bandwidth()*0.9/2
                    })
                    .attr('y', function(d, i){
                    return yScale(parseInt(d.value_active))
                    })
                    .attr('width', xBand.bandwidth()*0.9)
                    .attr('height', function(d){
                    return height - yScale(d.value_active)
                    })
                    .style('fill','0E77B4')
                    .style('opacity',1)
                    .on('mouseover', function(d,i){
                        d3.select(this).style('opacity',0.4);
                        svg.append('g')
                            .append('text')
                            .text(function(d){
                                new_date = String(ordinals[i]).split(' ')
                                return `(${data[i].value_active} , ${new_date[1]} ${new_date[2]})`;
                            })
                            .style('stroke','black')
                            .style('stroke-width', 1.5)
                            .attr('x', xScale(i) - 50*xBand.bandwidth()*0.9/2)
                            .attr('y', yScale(parseInt(d.value_active)))
                            .attr('class','detailText');
                    })
                    .on('mouseout', function(d,i){
                        d3.selectAll('.detailText').remove()
                        d3.select(this).style('opacity',1)
                    })
                    .attr('visibility', 'visible')
                    // .call(drag);                    ;



        let bars3 = svg.append('g')
            .attr('clip-path','url(#my-clip-path)')
            .selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('id', 'bar3')
            .attr('x', function(d, i){
            return xScale(i) - xBand.bandwidth()*0.9/2
            })
            .attr('y', function(d, i){
            return yScale(parseInt(d.value_rec))
            })
            .attr('width', xBand.bandwidth()*0.9)
            .attr('height', function(d){
                return height - yScale(d.value_rec)
            })
            .style('fill','white')
            .style('opacity',1)
            .on('mouseover', function(d,i){
                d3.select(this).style('opacity',0.4);
                svg.append('g')
                    .append('text')
                    .text(function(d){
                        new_date = String(ordinals[i]).split(' ')
                        return `(${data[i].value_rec} , ${new_date[1]} ${new_date[2]})`;
                    })
                    .style('stroke','black')
                    .style('stroke-width', 1.5)
                    .attr('x', xScale(i) - 50*xBand.bandwidth()*0.9/2)
                    .attr('y', yScale(parseInt(d.value_rec)))
                    .attr('class','detailText');
            })
            .on('mouseout', function(d,i){
                d3.selectAll('.detailText').remove()
                d3.select(this).style('opacity',1)
            })
            .attr('visibility', 'visible');


        let bars4 = svg.append('g')
            .attr('clip-path','url(#my-clip-path)')
            .selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('id', 'bar4')
            .attr('x', function(d, i){
            return xScale(i) - xBand.bandwidth()*0.9/2
            })
            .attr('y', function(d, i){
            return yScale(parseInt(d.value_dead))
            })
            .attr('width', xBand.bandwidth()*0.9)
            .attr('height', function(d){
            return Math.abs(height - yScale(d.value_dead))
            })
            .style('fill','black')
            .style('opacity',1)
            .on('mouseover', function(d,i){
                d3.select(this).style('opacity',0.4);
                svg.append('g')
                    .append('text')
                    .text(function(d){
                        new_date = String(ordinals[i]).split(' ')
                        return `(${data[i].value_dead} , ${new_date[1]} ${new_date[2]})`;
                    })
                    .style('stroke','red')
                    .style('stroke-width', 1)
                    .attr('x', xScale(i) - 50*xBand.bandwidth()*0.9/2)
                    .attr('y', yScale(parseInt(d.value_dead)))
                    .attr('class','detailText');
            })
            .on('mouseout', function(d,i){
                d3.selectAll('.detailText').remove()
                d3.select(this).style('opacity',1)
            })
            .attr('visibility', 'visible');


        let defs = svg.append('defs')

        // use clipPath
        defs.append('clipPath')
            .attr('id', 'my-clip-path')
            .append('rect')
            .attr('width', width)
            .attr('height', height)

        let hideTicksWithoutLabel = function() {
        d3.selectAll('.xAxis .tick text').each(function(d){
            if(this.innerHTML === '') {
            this.parentNode.style.display = 'none'
            }
        })
        }

        var columns = ['Confirmed', 'Active', 'Recovered', 'Deaths', 'Click on each to filter bars']

        // svg.append('rect')
        //     .style('stroke','white')
        //     .style('fill','grey')
        //     .attr('width', 100)
        //     .attr('height',100)
        //     .attr('x', 10)
        //     .attr('y', 10)
        //     .attr("transform","translate(100,100)");


        svg.selectAll('#histogramNode')
            .append('g')
            .data(columns)
            .enter()
            .append('text')
            .text(function(d,i){
                return columns[i];
            })
            .style('fill','white')
            .attr('font-size', '12px')
            .attr('x',function(d,i){
                if (columns[i] == 'Click on each to filter bars'){
                    return 0.095*width;
                }
                return 0.1647*width
            })
            .attr('y', function(d,i){
                return 25*i + 30
            })
            .on('click', function(d,i){
                i = i+1
                if(d3.selectAll('#bar'+i).attr('visibility') == 'hidden'){
                    d3.selectAll('#bar'+i).attr('visibility', 'visible')
                }
                else{
                    d3.selectAll('#bar'+i).attr('visibility', 'hidden')
                }
            })
            .on('mouseover', function(d,i){
                i+=1
                d3.selectAll('#bar'+i).style('opacity',0.4)
            })
            .on('mouseout', function(d,i){
                i+=1
                d3.selectAll('#bar'+i).style('opacity',1)
            });

        var colors = ['#EAD8BD', '#0E77B4', 'white', 'black'];

        
        svg.selectAll('#histogramNode')
            .append('g')
            .data(colors)
            .enter()
            .append('line')
            .attr('x1', 0.13179*width)
            .attr('x2', 0.095*width)
            .attr('y1',function(d,i){
                return 25*i +27;
            })
            .attr('y2',function(d,i){
                return 25*i +27;
            })
            .style('stroke', function(d,i){
                return colors[i];
            })
            .style('stroke-width',2);

        function zoom() {
            if (d3.event.transform.k < 1) {
                d3.event.transform.k = 1
                return
            }

            xAxis.call(
                d3.axisBottom(d3.event.transform.rescaleX(xScale)).tickFormat((d, e, target) => {
                // has bug when the scale is too big
                if (Math.floor(d) === d3.format(".1f")(d)) return ordinals[Math.floor(d)]
                return ordinals[d]
                })
            )

            hideTicksWithoutLabel()

            // the bars transform
            bars.attr("transform", "translate(" + d3.event.transform.x+",0)scale(" + d3.event.transform.k + ",1)")
            bars2.attr("transform", "translate(" + d3.event.transform.x+",0)scale(" + d3.event.transform.k + ",1)")
            bars3.attr("transform", "translate(" + d3.event.transform.x+",0)scale(" + d3.event.transform.k + ",1)")
            bars4.attr("transform", "translate(" + d3.event.transform.x+",0)scale(" + d3.event.transform.k + ",1)")

            
        }

    });

    function type(d) {
        d.date = parseDate(d.date);
        d.confirmed = + parseInt(d.confirmed);
        d.recovered = + parseInt(d.recovered);
        d.active = + parseInt(d.active);
        d.deaths = + parseInt(d.deaths);
        return d;
    }

}
