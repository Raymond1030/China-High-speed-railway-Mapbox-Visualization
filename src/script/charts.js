

//柱状图 id='bar'
var app = {}

var Bar_container = echarts.init(
    document.getElementById('bar'),'chalk');//chalk主题
var gdp_arr = [];
var population_arr = []
var province_arr = []

function SetBarOption() {
    var option

    const posList = [
        'left',
        'right',
        'top',
        'bottom',
        'inside',
        'insideTop',
        'insideLeft',
        'insideRight',
        'insideBottom',
        'insideTopLeft',
        'insideTopRight',
        'insideBottomLeft',
        'insideBottomRight'
    ];
    app.configParameters = {
        rotate: {
            min: -90,
            max: 90
        },
        align: {
            options: {
                left: 'left',
                center: 'center',
                right: 'right'
            }
        },
        verticalAlign: {
            options: {
                top: 'top',
                middle: 'middle',
                bottom: 'bottom'
            }
        },
        position: {
            options: posList.reduce(function (map, pos) {
                map[pos] = pos;
                return map;
            }, {})
        },
        distance: {
            min: 0,
            max: 100
        }
    };
    app.config = {
        rotate: 90,
        align: 'left',
        verticalAlign: 'middle',
        position: 'insideBottom',
        distance: 15,
        onChange: function () {
            const labelOption = {
                rotate: app.config.rotate,
                align: app.config.align,
                verticalAlign: app.config.verticalAlign,
                position: app.config.position,
                distance: app.config.distance
            };
            myChart.setOption({
                series: [
                    {
                        label: labelOption
                    },
                    {
                        label: labelOption
                    },
                    {
                        label: labelOption
                    },
                    {
                        label: labelOption
                    }
                ]
            });
        }
    };
    const labelOption = {
        show: true,
        position: app.config.position,
        distance: app.config.distance,
        align: app.config.align,
        verticalAlign: app.config.verticalAlign,
        rotate: app.config.rotate,
        formatter: '{c}  {name|{a}}',
        fontSize: 16,
        rich: {
            name: {}
        }
    };
    option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        title: {
            text: '各省份GDP、人口',
            textStyle: {
                fontSize: 12
            }
        },
        legend: {
            data: ['GDP', '人口'],
            right: 3

        },
        color: ['#91cc75', '#ee6666'],
        toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar', 'stack'] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        xAxis: [
            {
                type: 'category',
                axisTick: { show: false },
                data: province_arr
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: 'GDP',
                type: 'bar',
                barGap: 0,
                label: labelOption,
                emphasis: {
                    focus: 'series'
                },
                data: gdp_arr
            },
            {
                name: '人口',
                type: 'bar',
                label: labelOption,
                emphasis: {
                    focus: 'series'
                },
                data: population_arr
            }
        ],
        legend: {
            show: true,
            data: ['GDP', '人口']
        }

    }

    Bar_container.setOption(option);
}
function SetPieOption() {
    option = {
        angleAxis: {
            type: 'category',
            data: province_arr,
        },
        radiusAxis: {},
        polar: {},
        series: [
            {
                type: 'bar',
                data: population_arr,
                coordinateSystem: 'polar',
                name: '人口',
                stack: 'a',
                emphasis: {
                    focus: 'series'
                }
            },
            {
                type: 'bar',
                data: gdp_arr,
                coordinateSystem: 'polar',
                name: 'GDP（亿元）',
                stack: 'a',
                emphasis: {
                    focus: 'series'
                }
            },

        ],
        legend: {
            show: true,
            data: ['人口', 'GDP']
        }
    }
    Bar_container.setOption(option);
}

var pro_gdp_data = [];
var pro_population_data = [];
//各省GDP对比的折线图
function SetLineCOption() {
    console.log(pro_gdp_data)
    option = {
        title: {
            text: '各省份GDP变化图',
            textStyle: {
                fontSize: 12
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: province_arr,
            right: 3
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            top: 10,
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['1995', '2000', '2005', '2010', '2015', '2020'],
        },
        yAxis: {
            type: 'value',
            //   data:pro_gdp_data
        },
        series: pro_gdp_data

    };
    Bar_container.setOption(option);
}


var type = 'GDP';//'GDP'或'人口'
var dataset_GDP = [
    ['GDP'].concat(['1995', '2000', '2005', '2010', '2015', '2020']),
]
var dataset_Population = [['population'].concat(['1995', '2000', '2005', '2010', '2015', '2020']),]
function SetPieAndLineOption(type) {
    //饼图和折线图
    var series_data = [];
    for (let index = 0; index < province_arr.length; index++) {
        series_data.push(
            {
                type: 'line',
                smooth: true,
                seriesLayoutBy: 'row',
                emphasis: { focus: 'series' }
            }
        );

    }
    console.log(type)
    console.log(province_arr)
    console.log(series_data)
    var dataset_type = [];
    var D_type;
    var id_type;
    if (type == 'GDP') {
        dataset_type = dataset_GDP;
        id_type = 'GDP';
        D_type = '亿元'
    }
    else if (type == '人口') {
        dataset_type = dataset_Population;
        id_type = 'population';
        D_type = '万人';
    }
    console.log(dataset_type)
    console.log(id_type)
    console.log(type)
    // console.log(series_data)
    // console.log(dataset_GDP)
    option = {
        title: {
            text: '各省份' + type + '图',
            top: 2,
            textStyle: {
                fontSize: 14,
            }
        },
        legend: {
            top: 20,
            right: 0,
        },
        tooltip: {
            trigger: 'axis',
            showContent: false
        },
        dataset: {
            source: dataset_type
        },
        xAxis: { type: 'category' },
        yAxis: { gridIndex: 0, 
            name: type + '(' + D_type + ')', type: 'value' 
        },
        grid: { 
            top: '60%',
        bottom:'10%',
        
        right: 2 },
        series: series_data.concat([
            {
                type: 'pie',
                id: 'pie',
                radius: '30%',
                center: ['50%', '25%'],
                emphasis: {
                    focus: 'self'
                },
                label: {
                    formatter: '{b}: {@2020} '+D_type+'({d}%)'
                },
                encode: {
                    itemName: id_type,
                    value: '2020',
                    tooltip: '2020'
                },
                top: '10%'
            }
        ])
    };
    Bar_container.on('updateAxisPointer', function (event) {
        const xAxisInfo = event.axesInfo[0];
        if (xAxisInfo) {
            const dimension = xAxisInfo.value + 1;
            Bar_container.setOption({
                series: {
                    id: 'pie',
                    label: {
                        formatter: '{b}: {@[' + dimension + ']} '+D_type+' ({d}%)'
                    },
                    encode: {
                        value: dimension,
                        tooltip: dimension
                    }
                }
            });
        }
    });
    Bar_container.setOption(option);
    console.log(Bar_container)
}

function ChangeType() {
    if ('GDP' == type) {
        type = '人口';
        document.getElementById('changetype').innerHTML = '切换到GDP视图';
    }
    else if ('人口' == type) {
        type = 'GDP';
        document.getElementById('changetype').innerHTML = '切换到人口视图';
    }
    SetPieAndLineOption(type);
}
function Clear()
{
    Bar_container = echarts.init(document.getElementById('bar')).dispose();//销毁前一个实例
    Bar_container = echarts.init(document.getElementById('bar'),'chalk');//构建下一个实例
    gdp_arr = [];
    population_arr = []
    province_arr = []
    pro_gdp_data = [];
    pro_population_data = [];
    type = 'GDP';//'GDP'或'人口'

    if ('人口' == type) {
        type = 'GDP';
        document.getElementById('changetype').innerHTML = '切换到人口视图';
    }
    dataset_GDP = [
        ['GDP'].concat(['1995', '2000', '2005', '2010', '2015', '2020']),
    ]
    dataset_Population = [['population'].concat(['1995', '2000', '2005', '2010', '2015', '2020']),]

    var divV = document.getElementById("card-body");
    var divV2 = document.getElementById("type-button");
    console.log(divV.style.visibility)
    if (divV.style.visibility == "visible") {

        divV.style.visibility = "hidden";
        divV2.style.visibility = "hidden";
    }
    map.flyTo({ center: [113.8, 29.646] });

}