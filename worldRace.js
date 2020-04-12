function worldRace(){

    const svgRace = d3.selectAll('#worldRace').attr('width',document.getElementById('divBoxRace').offsetWidth);
        //Using this selection to update the SVG everytime the function is called
    svgRace.selectAll("*").remove();

    d3.tsv("world_covid.tsv", function(data) {
        console.log(data[0]);
    
    });
    


}

worldRace();