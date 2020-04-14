function sortByProperty(property){  
    return function(a,b){  
       if(parseInt(a[property]) < parseInt(b[property]))  
          return 1;  
       else if(parseInt(a[property]) > parseInt(b[property]))  
          return -1;  
   
       return 0;  
    }  
 }

 function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function top6(){

    var svgRace = d3.selectAll('#Top6').attr('width',document.getElementById('top6Div').offsetWidth);
        //Using this selection to update the SVG everytime the function is called
    svgRace.selectAll("*").remove();

    d3.tsv("world_covid.tsv", function(data) {
        var sorted_data = data.sort(sortByProperty('confirmed'));
        var sorted_3_first = [sorted_data[0], sorted_data[1], sorted_data[2]];
        var sorted_3_second = [sorted_data[3], sorted_data[4], sorted_data[5]];

        var svgRace = d3.selectAll('#Top6')
                        .attr('height', document.getElementById('top6Div').offsetHeight)

        width = document.getElementById('top6Div').offsetWidth
        height = document.getElementById('top6Div').offsetHeight

        svgRace.append('g')
            .data(['Highest 6 infected (Confirmed)'])
            .append('text')
            .text(['Highest 6 infected (Confirmed)'])
            .style('fill', 'white')
            .style('font-size', '16px')
            .attr('x', width/5)
            .attr('y', 0.05405*height);

        svgRace.selectAll('body')
            .data(sorted_3_first)
            .enter()
            .append('text')
            .text(function(d,i){
                console.log(d['name'])
                return d['name'];
            })
            .style('fill', 'white')
            .attr('y',0.24*height)
            .attr('text-anchor','left')
            .attr('x', function(d,i){
                return i*100 + width/6;
            });

        svgRace.selectAll('body')
            .data(sorted_3_first)
            .enter()
            .append('text')
            .text(function(d,i){
                return numberWithCommas(d['confirmed']);
            })
            .style('fill', 'white')
            .attr('y',0.33*height)
            .attr('text-anchor','left')
            .attr('x', function(d,i){
                return i*100 + width/6;
            });

        svgRace.selectAll('body')
            .data(sorted_3_second)
            .enter()
            .append('text')
            .text(function(d,i){
                if(d['name'] =='United Kingdom'){
                    return 'UK'
                }
                return d['name'];
            })
            .style('fill', 'white')
            .attr('y',0.56*height)
            .attr('text-anchor','left')
            .attr('x', function(d,i){
                return i*100 + width/6;
            });

        svgRace.selectAll('body')
            .data(sorted_3_second)
            .enter()
            .append('text')
            .text(function(d,i){
                return numberWithCommas(d['confirmed']);
            })
            .style('fill', 'white')
            .attr('y',0.64*height)
            .attr('text-anchor','left')
            .attr('x', function(d,i){
                return i*100 + width/6;
            });
    
    });
}
