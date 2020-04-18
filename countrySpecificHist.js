

function countrySpecificHist(country){

    if(country == 'all'){


        d3.csv("cases_per_day_diff.csv", function(data_entry) {

        delete data_entry['columns'];

        console.log(data_entry[3].confirmed);


        let data = []
        let ordinals = []

        for(let i = 0;i < data_entry.length; i++){
        data.push({
            value: data_entry[i].confirmed,
            value_rec: data_entry[i].recovered,
            value_active: data_entry[i].active,
            value_dead: data_entry[i].deaths,
            city: 'test' + i
        })

        ordinals.push(data_entry[i].date)
        }

        let margin = {
            top: 20,
            right: 50,
            bottom: 0,
            left: 100
            },
            width = document.getElementById('histogramDiv').offsetWidth - margin.left - margin.right,
            height = document.getElementById('histogramDiv').offsetHeight - margin.top - margin.bottom,
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
        svg.append('rect')
        .attr('class', 'zoom-panel')
        .attr('width', width)
        .attr('height', height)

        // x axis
        let xAxis = svg.append('g')
        .style('stroke','white')
        .style('stroke-width',1)
        .attr('class', 'xAxis')
        .style('font-size','10px')
        .attr('transform', `translate(0, ${height})`)
        .call(
            d3.axisBottom(xScale).tickFormat((d, e) => {
            return ordinals[d]
            })
        )

        // y axis
        let yAxis = svg.append('g')
                    .attr('class', 'y axis')
                    .style('stroke','white')
                    .call(d3.axisLeft(yScale))

        let bars = svg.append('g')
                    .attr('clip-path','url(#my-clip-path)')
                    .selectAll('.bar')
                    .data(data)
                    .enter()
                    .append('rect')
                    .attr('class', 'bar')
                    .attr('x', function(d, i){
                    return xScale(i) - xBand.bandwidth()*0.9/2
                    })
                    .attr('y', function(d, i){
                    return yScale(parseInt(d.value))
                    })
                    .style('fill', 'EAD8BD')
                    .style('opacity', 0.7)
                    .attr('width', xBand.bandwidth()*0.9)
                    .attr('height', function(d){
                    return height - yScale(d.value)
                    });

        
        let bars2 = svg.append('g')
                    .attr('clip-path','url(#my-clip-path)')
                    .selectAll('.bar')
                    .data(data)
                    .enter()
                    .append('rect')
                    .attr('class', 'bar')
                    .attr('x', function(d, i){
                    return xScale(i) - xBand.bandwidth()*0.9/2
                    })
                    .attr('y', function(d, i){
                    return yScale(parseInt(d.value_active))
                    })
                    .attr('width', xBand.bandwidth()*0.9)
                    .attr('height', function(d){
                    return height - yScale(d.value)
                    })
                    .style('fill','5A8895')
                    .style('opacity',0.7)

        let bars3 = svg.append('g')
            .attr('clip-path','url(#my-clip-path)')
            .selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', function(d, i){
            return xScale(i) - xBand.bandwidth()*0.9/2
            })
            .attr('y', function(d, i){
            return yScale(parseInt(d.value_rec))
            })
            .attr('width', xBand.bandwidth()*0.9)
            .attr('height', function(d){
            return height - yScale(d.value)
            })
            .style('fill','#9ECAE1')
            .style('opacity',0.7)

        let bars4 = svg.append('g')
            .attr('clip-path','url(#my-clip-path)')
            .selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', function(d, i){
            return xScale(i) - xBand.bandwidth()*0.9/2
            })
            .attr('y', function(d, i){
            return yScale(parseInt(d.value_dead))
            })
            .attr('width', xBand.bandwidth()*0.9)
            .attr('height', function(d){
            return height - yScale(d.value)
            })
            .style('fill','0E77B4')
            .style('opacity',0.7)


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

        var columns = ['Confirmed', 'Active', 'Recovered', 'Deaths']

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
            .attr('x',100)
            .attr('y', function(d,i){
                return 25*i + 30
            });

        var colors = ['#EAD8BD', '#5A8895', '#9ECAE1', '#0E77B4'];

        
        svg.selectAll('#histogramNode')
            .append('g')
            .data(colors)
            .enter()
            .append('line')
            .attr('x1', 80)
            .attr('x2', 60)
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

    }
    
}
