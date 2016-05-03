var colors = ['#F44336','#673AB7','#009688','#FFEB3B','#FF9800','#9E9E9E'];
var colors9 = ['gray','#ffffe5','#fff7bc','#fee391','#fec44f','#fe9929','#ec7014','#cc4c02','#993404','#662506'];
var scale_maxDate =new Date(2015, 10, 30);
var newFilter = true;
var colorScale = d3.scale.ordinal().domain(["Afder","Doolo","Fafan","Jarar","Korahe","Liben","Nogob","Shabelle","Siti"])
                                   .range(['#ffffe5','#f7fcb9','#d9f0a3','#addd8e','#78c679','#41ab5d','#238443','#006837','#004529']);
var a3a2 = [
  {
    "Baarey":"Afder","Dolobay":"Afder","Goro Baqaqsa":"Afder","Guradamole":"Afder","Hargele":"Afder","Hargele Hospital":"Afder","Jarati":"Afder","Kersadula":"Afder","Raso":"Afder","Serer/Elkere":"Afder","West Imi":"Afder",
    "Boh":"Doolo","Danot":"Doolo","Daratoole":"Doolo","Geladin":"Doolo","Warder":"Doolo","Warder Hospital":"Doolo",
	"Aw-bare":"Fafan","Babile":"Fafan","Goljano":"Fafan","Gursum":"Fafan","Hareshen":"Fafan","Jijiga":"Fafan","Jijiga Council":"Fafan","Karamara Hospital":"Fafan","Kebribeyah":"Fafan","Tuli-guuleed":"Fafan",
    "Ararso":"Jarar","Aware":"Jarar","Birkot":"Jarar","Degehabur":"Jarar","Degehamedo":"Jarar","Dhagahabour Council":"Jarar","Dhagahabour Hospital":"Jarar","Gashamo":"Jarar","Gunagado":"Jarar","Yocale":"Jarar",
    "Dhobaweyn":"Korahe","Kebridehar":"Korahe","Kebridehar Council":"Korahe","Kebridehar Hospital":"Korahe","Marsin":"Korahe","Shekosh":"Korahe","Shilabo":"Korahe",
	"Dhagasoftu":"Liben","Dolo Odo":"Liben","Filtu":"Liben","Filtu Hospital":"Liben","Hudet":"Liben","Moyale":"Liben","Mubarak":"Liben",
	"Dhuhun":"Nogob","Fik":"Nogob","Fik Hospital":"Nogob","Gerbo":"Nogob","Hamero":"Nogob","Kubi":"Nogob","Lagahida":"Nogob","Meyumuluka":"Nogob","Segeg":"Nogob","Selahad":"Nogob",
    "Adadle":"Shabelle","Denan":"Shabelle","Elweyn":"Shabelle","Ferfer":"Shabelle","Gode":"Shabelle","Gode Council":"Shabelle","Gode Hospital":"Shabelle","Imey bari":"Shabelle","Kelafo":"Shabelle","Mustahil":"Shabelle",
    "Afdem":"Siti","Ayisha":"Siti","Dembel":"Siti","Erer":"Siti","Hadhigala":"Siti","Miesso":"Siti","Shinile":"Siti"
  }
];								   
								   
var timecount_chart = dc.barChart("#time_count");
var timestats_chart = dc.compositeChart("#time_stats");
var timestats2_chart = dc.compositeChart("#time_stats2");
var woreda = dc.rowChart("#woreda");
var disease = dc.rowChart("#disease");
var zone = dc.pieChart("#zone");

var mapChart = dc.leafletChoroplethChart('#zone-map');

	var dateFormat = d3.time.format("%Y-%m-%d");
    data_eth.forEach(function (e) {
        e.dt = dateFormat.parse(e.dt);
    });

var cf_eth = crossfilter(data_eth);

var dateDimension_eth = cf_eth.dimension(function(d){ return d.dt; });
var diseaseDimension_eth = cf_eth.dimension(function(d){ return d.ds; });
var zoneDimension_eth = cf_eth.dimension(function(d){ return d.a2; });
var zonemapDimension_eth = cf_eth.dimension(function(d){ return d.a2; });
var woredaDimension_eth = cf_eth.dimension(function(d){ return d.a3; });

var dateGroup_eth = dateDimension_eth.group().reduceSum(function(d) {return d.cs;});
var deathGroup_eth = dateDimension_eth.group().reduceSum(function(d) {return d.dh;});
var caseGroup_eth = dateDimension_eth.group().reduceSum(function(d) {return d.cs;});
var outpGroup_eth = dateDimension_eth.group().reduceSum(function(d) {return d.op;});
var inpGroup_eth = dateDimension_eth.group().reduceSum(function(d) {return d.ip;});
var zonemapGroup_eth = zonemapDimension_eth.group().reduceSum(function(d) {return d.cs;});
var zoneGroup_eth = zoneDimension_eth.group().reduceSum(function(d) {return d.cs;});
var woredaGroup_eth = woredaDimension_eth.group().reduceSum(function(d) {return d.cs;});
var diseaseGroup_eth = diseaseDimension_eth.group().reduceSum(function(d) {return d.cs;});

var deathAll_eth = cf_eth.groupAll().reduceSum(function(d){ return d.dh; });
var caseAll_eth = cf_eth.groupAll().reduceSum(function(d){ return d.cs; });
var inpAll_eth = cf_eth.groupAll().reduceSum(function(d){ return d.ip; });
var outpAll_eth = cf_eth.groupAll().reduceSum(function(d){ return d.op; });

			
var xScaleRange = d3.time.scale().domain([new Date(2014, 12, 1), scale_maxDate]);

function formatDate(value) {
   var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
   return monthNames[value.getMonth()] + " " + value.getDate();
};

timecount_chart
        .width($('#time_count').width())
        .height(120)
        .dimension(dateDimension_eth)
        .group(dateGroup_eth)
        .x(xScaleRange)
		.xUnits(d3.time.weeks)
		/*.compose([
            dc.barChart(timecount_chart).group(dateGroup_eth,'Dates').colors(colors[1]).centerBar(true).gap(1)
		])*/
		.centerBar(true)
		.gap(1)
        .xAxisLabel("Date")
        .yAxisLabel("Cases")
        .xAxis().ticks(12);
timecount_chart.yAxis().ticks(5);

timestats_chart
        .width($('#time_stats').width())
        .height(150)
        .dimension(dateDimension_eth)
        .x(d3.time.scale().domain([new Date(2014, 12, 1), scale_maxDate]))
		.xUnits(d3.time.weeks)
        .rangeChart(timecount_chart)
        .elasticY(true)
        .compose([
            dc.barChart(timestats_chart).group(caseGroup_eth,'Cases').colors('#fec44f').centerBar(true).gap(3),
			dc.barChart(timestats_chart).group(deathGroup_eth,'Deaths').colors('#e31a1c').centerBar(false).gap(3)
        ])
        .brushOn(false)
        .xAxisLabel("Date")
        .yAxisLabel("Cases")
        .legend(dc.legend().x($('#time_stats').width()-150).y(0).gap(5))
        .xAxis().ticks(6)
timestats_chart.yAxis().ticks(5);
        
timestats2_chart
        .width($('#time_stats').width())
        .height(150)
        .dimension(dateDimension_eth)
        .x(d3.time.scale().domain([new Date(2014, 12, 1), scale_maxDate]))
		.xUnits(d3.time.weeks)
        .elasticY(true)
        .compose([
            dc.barChart(timestats2_chart).group(outpGroup_eth, 'Out-P').colors('#ffeda0').centerBar(true).gap(3), 
            dc.barChart(timestats2_chart).group(inpGroup_eth, 'In-P').colors('#fc4e2a').centerBar(false).gap(3)           
        ])
        .brushOn(false)
        .xAxisLabel("Date")
        .yAxisLabel("Patients")
        .legend(dc.legend().x($('#time_stats2').width()-150).y(0).gap(5))
        .xAxis().ticks(6);
timestats2_chart.yAxis().ticks(5);
		     
woreda.width($('#woreda').width()).height(250)
		.width($('#woreda').width())
        .dimension(woredaDimension_eth)
        .group(woredaGroup_eth)
        .elasticX(true)
		.data(function(group) {
			return group.top(12).filter(function(d) {
                return d.value != 0;
            });
        })
		.colors(function(d){ console.log(colorScale(a3a2[0][d])); return colorScale(a3a2[0][d]); })
		/*.on('filtered',function(chart,filter){
                if(newFilter == true){
                    newFilter = false;
                    zone.filter(filter);
					mapChart.filter(filter);
                } else {
                    newFilter = true;
                }                
            })*/
		.xAxis().ticks(2)
		;
		
disease.width($('#disease').width()).height(428)
        .dimension(diseaseDimension_eth)
        .group(diseaseGroup_eth)
        .elasticX(true)
		.data(function(group) {
			return group.top(12).filter(function(d) {
                return d.value != 0;
            });;
		})
		.colors('#feb24c')
		//.xAxisLabel("Cases")
        .xAxis("Cases").ticks(2);
		
disease.renderlet(function(e){
		var html = "";
		e.filters().forEach(function(l){
			html += l+", ";
		});
		$('#diseasefilter').html(html);
	});		
		
/*zone.width($('#zone').width()).height(350)
        .dimension(zoneDimension_eth)
        .group(zoneGroup_eth)
        .elasticX(true)
        .xAxis().ticks(5);*/
		
zone.width($('#zone').width()).height(250)
        .dimension(zoneDimension_eth)
        .group(zoneGroup_eth)
		.innerRadius(10)
        //.externalLabels(-20)
        //.externalRadiusPadding(0)
		.colors(function(d){ console.log(d); return colorScale(d); })
		.legend(dc.legend().x(5).y(110).itemHeight(13).gap(2))
		.renderLabel(true)
		.on('filtered',function(chart,filter){
                if(newFilter == true){
                    newFilter = false;
                    mapChart.filter(filter);
					//woreda.filter(filter);
                } else {
                    newFilter = true;
                }                
            })
		/*.renderlet(function(e){
                var html = "";
                e.filters().forEach(function(l){
                    html += l+", ";
                });
                $('#mapfilter').html(html);
        })*/;
		
mapChart.width($('#zone-map').width()).height(220)
            .dimension(zonemapDimension_eth)
            .group(zonemapGroup_eth)
            .center([7.2,43.3])
            .zoom(5)    
            .geojson(zonepoly)
			/*.featureStyle({
                'fillOpacity': 0.5,
            })*/ 
			.colors(colors9)
            .colorDomain([0, 9])
            .colorAccessor(function (d) {
                var c=0;
                if(d>10000){
                    c=9;
                } else if (d>=5000) {
                    c=8;
                } else if (d>=2500) {
                    c=7;
                } else if (d>=1000) {
                    c=6;
				} else if (d>=500) {
                    c=5;
				} else if (d>=250) {
                    c=4;
                } else if (d>=100) {
                    c=3;
                } else if (d>=25) {
                    c=2;
				}  else if (d>0) {
                    c=1;
                } 
                return c;
            })
            .featureKeyAccessor(function(feature){
                console.log(feature.properties['ZONENAME']);
                return feature.properties['ZONENAME'];
            }).popup(function(feature){
                return feature.properties['ZONENAME'];
            })
            .renderPopup(true)
            .featureOptions({
                'fillColor': 'black',
                'color': 'gray',
                'opacity':0.5,
                'fillOpacity': 0,
                'weight': 2
            })
			.on('filtered',function(chart,filter){
                if(newFilter == true){
                    newFilter = false;
                    zone.filter(filter);
					//woreda.filter(filter);
                } else {
                    newFilter = true;
                }                
            });

			console.log(mapChart);
			
dc.dataCount('#deathtotal')
	.dimension(cf_eth)
	.group(deathAll_eth);

dc.dataCount('#casetotal')
	.dimension(cf_eth)
	.group(caseAll_eth);

dc.dataCount('#outptotal')
	.dimension(cf_eth)
	.group(outpAll_eth);

dc.dataCount('#inptotal')
	.dimension(cf_eth)
	.group(inpAll_eth);

    function rangesEqual(range1, range2) {
        if (!range1 && !range2) {
            return true;
        }
        else if (!range1 || !range2) {
            return false;
        }
        else if (range1.length === 0 && range2.length === 0) {
            return true;
        }
        else if (range1[0].valueOf() === range2[0].valueOf() &&
            range1[1].valueOf() === range2[1].valueOf()) {
            return true;
        }
        return false;
    }
    // monkey-patch the first chart with a new function
    // technically we don't even need to do this, we could just change the 'filtered'
    // event externally, but this is a bit nicer and could be added to dc.js core someday
    timecount_chart.focusCharts = function (chartlist) {
        if (!arguments.length) {
            return this._focusCharts;
        }
        this._focusCharts = chartlist; // only needed to support the getter above
        this.on('filtered', function (range_chart) {
            if (!range_chart.filter()) {
                console.log('cehck');
                dc.events.trigger(function () {
                    chartlist.forEach(function(focus_chart) {
                        focus_chart.x().domain(focus_chart.xOriginalDomain());
                        $('.datefilter').html(" ");
                    });
                });
            } else chartlist.forEach(function(focus_chart) {
                if (!rangesEqual(range_chart.filter(), focus_chart.filter())) {
                    dc.events.trigger(function () {
                        focus_chart.focus(range_chart.filter());
                        date_range = range_chart.filter();						
			var from_date = new Date(date_range[0])
			var to_date = formatDate(date_range[1])						
			if (from_date.getHours()!=0 || from_date.getMinutes()!=0 || from_date.getSeconds()!=0) {    //if not midnight, add 1 day to from date
				from_date.setDate(from_date.getDate()+1);
			}  
			from_date = formatDate(from_date)
			$('.datefilter').html(from_date + " - " + to_date);
                    });
                }
            });
        });
        return this;
    };
    timecount_chart.focusCharts([timestats_chart,timestats2_chart]);

function remove_empty_bins(source_group) {
    function non_zero_pred(d) {
        return d.value != 0;
    }
    return {
        all: function () {
            return source_group.all().filter(non_zero_pred);
        },
        top: function(n) {
            return source_group.top(Infinity)
                .filter(non_zero_pred)
                .slice(0, n);
        }
    };
}

/*var map = mapChart.map();
    map.scrollWheelZoom.disable();
    //zoomToGeom(geom);

function zoomToGeom(geom){
	console.log(geom);
	var bounds = d3.geo.bounds(geom);
	console.log(bounds);
	map.fitBounds([[bounds[0][1],bounds[0][0]],[bounds[1][1],bounds[1][0]]]);
    }*/

dc.renderAll();

var g = d3.selectAll('#disease').select('svg').append('g');
    
    g.append('text')
        .attr('class', 'x-axis-label')
        .attr('text-anchor', 'middle')
        .attr('x', $('#disease').width()/2)
        .attr('y', 428)
        .text('Cases');

var g = d3.selectAll('#woreda').select('svg').append('g');
    
    g.append('text')
        .attr('class', 'x-axis-label')
        .attr('text-anchor', 'middle')
        .attr('x', $('#disease').width()/2)
        .attr('y', 250)
        .text('Cases');
		
		
$('#intro').click(function(){
    var intro = introJs();
    intro.setOptions({
		steps: [
		  {
			intro: '<div style="width: 380px; "><p><b>1) Click to filter by <i>elements</i>.</b><br>That affects all the other graphs and and the map.</p><p><b>2) Selection of multiple <i>elements</i> is allowed.</b><br>This allows you to combine filters eg. by <i>disease</i> and <i>zone</i>.</p><p><b>3) Click again <i>elements</i> to unfliter one by one.</b><br>Alternatively click "Reset All" to unfilter all.<p><p><b>4) Hover <i>elements</i> to display values.</b><p></div>',
		  },
		  {
			element: '#disease',
			intro: "This row chart displays diseases sorted by prevalence. <br><i>Click on rows to filter by disease, you can select multiple diseases.</i>",
			position: 'right'
		  },
		  {
			element: '#time_count',
			intro: "This bar chart displays total cases by week (with a fixed y axis). <br><i>Click and drag to filter by a specific time period. The period can be dragged. To comeback to the complete period, click on the bar chart outside of the selected period.</i>",
		  },
		  {
			element: '#area-map',
			intro: 'This choropleth map displays the number of cases in the subset aggregated at zone level.<br><img src="img/map-key.png" height="150" align="center"><br><i>Click on the map to filter by zones, you can select multiple zones.</i>',
		  },		  
		  {
			element: '#area-chart',
			intro: "These charts display the different administrative divisions: zones (adm2) on the right hand side (pie chart) and sub-zone (adm3 or other locations) on the left hand side (row chart). <br>The different shades of green stand for different zones. <br><i>Click on rows, slices or legend to filter by administrative area, you can select multiple administrative area.</i>",
			position: 'top'
		  },
		  {
			element: '#results',
			intro: "These bar charts display the selected subset, sum of <i>indicator</i> for the selected disease(s) [2] during the selected period [3] in the selected area(s) [4,5]. <br><i>These bar chart cannot be used to filter data.</i>",
			position: 'right'
		  },
		]
	});
    intro.start();
});