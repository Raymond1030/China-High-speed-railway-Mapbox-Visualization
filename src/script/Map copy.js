mapboxgl.accessToken = 'pk.eyJ1IjoicmF5bW9uZDEwMzAiLCJhIjoiY2t3ZzNoNWs2MGtyaDJvcXFrZzJ1d21jdSJ9.1eFm7AWAzW9YlorcnsCKXg';//Mapbox Token

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/raymond1030/cl3mmvbfb001f14p8dlpdbo6j/draft',

    center: [113.8, 29.646], // starting position [lng, lat]
    zoom: 4.5,// starting zoom
    // maxZoom: 15,
    pitch: 45,
    localIdeographFontFamily: "'Noto Sans', 'Noto Sans CJK SC', sans-serif"
});
map.addControl(new mapboxgl.NavigationControl({
    visualizePitch: true
}));

//加载图标
let image = new Image(25, 25);
image.src = './svg/火车站.svg',
    image.onload = () => {
        map.addImage("station_Big", image);
    }
let image1 = new Image(10, 10);
image1.src = './svg/小火车站.svg',
    image1.onload = () => {
        map.addImage("station", image1);
    }
function addPointLayer(id, data) {
    //点图层
    map.addLayer({
        'id': id,
        'type': 'symbol',
        //对应上边的数据源id
        'source': {
            "type": "geojson",
            "data": data,

        },
        'layout': {
            //设置图标的名称
            'icon-image': 'station',
            'visibility': 'visible',
            "icon-allow-overlap": false,
        },
        'paint': {


            'icon-opacity': 0,

        }
    })
}

function addSymbolPointLayer(id, data) {
    //点图层
    map.addLayer({
        'id': id,
        'type': 'symbol',
        //对应上边的数据源id
        'source': {
            "type": "geojson",
            "data": data,

        },
        'layout': {
            //设置图标的名称
            'icon-image': 'station_Big',
            'visibility': 'visible',
            "icon-allow-overlap": true,
            //设置显示文字的字段
            'text-field': ['get', '车站'],
            "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
            "text-radial-offset": 0.06,
            "text-allow-overlap": true,
            // "icon-text":['get','事件']
            "text-padding": 10,
            "text-variable-anchor": ["top-right", "bottom-right", "right", "top-left", "bottom-left"],
            "text-size": 12.5,
            "text-letter-spacing": 0,
            "text-line-height": 1.2,
            "text-max-width": 10,
        },
        'paint': {

            "text-color": "#062b65",
            "text-halo-color": "#ffffff",
            "text-halo-blur": 0,
            "text-halo-width": 1.3,
            'icon-opacity': 0,

        }
    })
}
function addLineLayer(id, data, color) {
    map.addLayer(
        {
            'id': id,
            'type': 'line',
            'source': {
                "type": "geojson",
                "data": data,

            },
            'layout': {
                // 'line-join': 'round',
                'line-cap': 'butt',
                'visibility': 'visible',
                // 'text-field':"name"

            },
            'paint': {
                // 'line-color': '#888',
                'line-color': color,
                'line-width': 1,
                'line-opacity': 0,
                'line-opacity-transition': {
                    duration: 1500
                }
            }
        }
    )
}

function Map_MouseOnEvent_Poi(id) {

    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        anchor: 'bottom',//强制向上 
        maxWidth: '500px',
    });
    console.log(map);
    map.on('click', id, function (e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';
        // var gdp, population;

        var province = e.features[0].properties.省份;

        //各省当年GDP和人口数据
        if (province_arr.indexOf(province) == -1) {
            console.log("不存在重复")
            var data = [];
            data = GetGDP_Population(province)
            province_arr.push(province);
            gdp_arr.push(data[0]);
            population_arr.push(data[1]);

            dataset_GDP.push([province].concat(GetGDP_array(province)))
            dataset_Population.push([province].concat(GetPopulation_array(province)))

            console.log(province_arr);
            console.log(gdp_arr);
            console.log(population_arr);

            SetPieAndLineOption(type);
        }
        else {
            alert("该省份已选择！");
        }
        var divV = document.getElementById("card-body");
        var divV2 = document.getElementById("type-button");
        console.log(divV.style.visibility)
        if (divV.style.visibility == "hidden") {

            divV.style.visibility = "visible";
            divV2.style.visibility = "visible";
        }
        map.flyTo({ center: [115, 29.646] });

    });


    map.on('mouseenter', id, function (e) {
        // Change the cursor style as a UI indicator.
        // map.getCanvas().style.cursor = 'pointer';

        var coordinates = e.features[0].geometry.coordinates.slice();
        console.log(coordinates)
        var position = e.features[0].geometry.coordinates;
        var name = e.features[0].properties.车站;
        var pv = e.features[0].properties.省份;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(coordinates)
            .setHTML('<strong>车站：' + name + '站' + '</strong><br>' +
                '<strong>省份：' + pv + '</strong><br>')
            .addTo(map);


    });

    map.on('mouseleave', id, function () {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });
}


function Map_MouseOnEvent_Line(id) {

    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        anchor: 'bottom',//强制向上 
        maxWidth: '500px',
    });
    console.log(map);
    // map.on('click', id, function (e) {
    //     // Change the cursor style as a UI indicator.
    //     map.getCanvas().style.cursor = 'pointer';
    //     // var gdp, population;

    //     var province = e.features[0].properties.省份;

    //     //各省当年GDP和人口数据
    //     if (province_arr.indexOf(province) == -1) {
    //         console.log("不存在重复")
    //         var data = [];
    //         data = GetGDP_Population(province)
    //         province_arr.push(province);
    //         gdp_arr.push(data[0]);
    //         population_arr.push(data[1]);

    //         dataset_GDP.push([province].concat(GetGDP_array(province)))
    //         dataset_Population.push([province].concat(GetPopulation_array(province)))

    //         console.log(province_arr);
    //         console.log(gdp_arr);
    //         console.log(population_arr);

    //         SetPieAndLineOption(type);
    //     }
    //     else {
    //         alert("该省份已选择！");
    //     }
    //     var divV = document.getElementById("card-body");
    //     var divV2 = document.getElementById("type-button");
    //     console.log(divV.style.visibility)
    //     if (divV.style.visibility == "hidden") {

    //         divV.style.visibility = "visible";
    //         divV2.style.visibility = "visible";
    //     }
    //     map.flyTo({ center: [115, 29.646] });

    // });


    map.on('mouseenter', id, function (e) {
        // Change the cursor style as a UI indicator.
        // map.getCanvas().style.cursor = 'pointer';

        var name = e.features[0].properties.name;
      
        popup.setLngLat(e.lngLat)
            .setHTML('<strong>' + name  + '</strong><br>'
            )
            .addTo(map);


    });

    map.on('mouseleave', id, function () {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });
}

function Line_PopupShow(Ln)
{
    var name = Ln.features[0].properties.name;
    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        anchor: 'bottom',//强制向上 
        maxWidth: '500px',
    });
    // console.log(map);
    console.log(Ln.features[0].geometry.coordinates[0][0])
    popup.setLngLat(Ln.features[0].geometry.coordinates[0][0])
        .setHTML('<strong>' + name + '</strong><br>')
        .addTo(map);
    setTimeout(function () {
            popup.remove();
    }, 3000)
}

var symbol_point_data;
var small_point_data;
//加载地图
map.on('load', async () => {

    //1.新建图层


    // Add a layer showing the POIs.
    var symbol_point_data = getJson("高铁站重点POI.json")
    var small_point_data = getJson("高铁站_小.json")
    //Add a layer showing the Lines

    line_Jingguang = getJson("京广铁路.json")
    line_Jingjiu = getJson("京九铁路.json")
    line_GS_HK=getJson("广深港高速铁路.json")
    line_BeijingShanghai=getJson("京沪高铁.json")
    line_Guiguang=getJson("贵广高铁.json")
    line_HuKun=getJson("沪昆高铁.json")
    line_HangShen=getJson("杭深线.json")
    line_Hurong=getJson("沪蓉线.json")
    line_LongHai=getJson("陇海线.json")
    line_Qingzang=getJson("青藏线.json")
    line_Lanxin=getJson("兰新线.json")
    line_Jingha=getJson("京哈铁路.json")
    line_TN=getJson("太原-南宁通道.json")

    line_data1 = getJson("1.json")
    line_data2 = getJson("3.json")
    line_data3 = getJson("2新.json")
    addLineLayer('GSHK', line_GS_HK, '#bfd819')
    addLineLayer('Jjiu', line_Jingjiu, '#bfd819')
    addLineLayer('JG', line_Jingguang, '#bfd819')
    addLineLayer('BJSH',line_BeijingShanghai, '#bfd819')
    addLineLayer('GuiG',line_Guiguang, '#bfd819')
    addLineLayer('HuKun',line_HuKun, '#bfd819')
    addLineLayer('HangShen',line_HangShen, '#bfd819')
    addLineLayer('HuRong',line_Hurong, '#bfd819')
    addLineLayer('Longhai',line_LongHai, '#bfd819')
    addLineLayer('Qingzang',line_Qingzang, '#bfd819')
    addLineLayer('Lanxin',line_Lanxin, '#bfd819')
    addLineLayer('Jingha',line_Jingha, '#bfd819')
    addLineLayer('TaiNan',line_TN, '#bfd819')

    addLineLayer('1', line_data1, '#185ADB')
    addLineLayer('2', line_data2, '#B4FE98')
    addLineLayer('3', line_data3, '#bfd819')

    setTimeout(function () {
        map.setPaintProperty('JG', 'line-opacity', 1);
    }, 1000)
    setTimeout(function(){
      Line_PopupShow(line_Jingguang)
    },3000)

    setTimeout(function () {
        map.setPaintProperty('Jjiu', 'line-opacity', 1);
    }, 5000)
    setTimeout(function(){
      Line_PopupShow(line_Jingjiu)
    },7000)

    setTimeout(function () {
        map.setPaintProperty('TaiNan', 'line-opacity', 1);
    }, 5000)
    setTimeout(function(){
      Line_PopupShow(line_TN)
    },7000)

    setTimeout(function () {
        map.setPaintProperty('HuRong', 'line-opacity', 1);
    }, 9000)
    setTimeout(function(){
      Line_PopupShow(line_Hurong)
    },11000)

    setTimeout(function () {
        map.setPaintProperty('HuKun', 'line-opacity', 1);
    }, 9000)
    setTimeout(function(){
      Line_PopupShow(line_HuKun)
    },11000)

    setTimeout(function () {
        map.setPaintProperty('Longhai', 'line-opacity', 1);
    }, 9000)
    setTimeout(function(){
      Line_PopupShow(line_LongHai)
    },11000)

    setTimeout(function () {
        map.setPaintProperty('BJSH', 'line-opacity', 1);
    }, 13000)
    setTimeout(function(){
      Line_PopupShow(line_BeijingShanghai)
    },15000)

    setTimeout(function () {
        map.setPaintProperty('GuiG', 'line-opacity', 1);
    }, 17000)
    setTimeout(function(){
      Line_PopupShow(line_Guiguang)
    },19000)

    setTimeout(function () {
        map.setPaintProperty('HangShen', 'line-opacity', 1);
    }, 21000)
    setTimeout(function(){
      Line_PopupShow(line_HangShen)
    },23000)


    setTimeout(function () {
        map.setPaintProperty('Lanxin', 'line-opacity', 1);
    }, 22000)
    setTimeout(function(){
      Line_PopupShow(line_Lanxin)
    },24000)


    setTimeout(function () {
        map.setPaintProperty('Qingzang', 'line-opacity', 1);
    }, 26000)
    setTimeout(function(){
      Line_PopupShow(line_Qingzang)
    },28000)

    setTimeout(function () {
        map.setPaintProperty('Jingha', 'line-opacity', 1);
    }, 26000)
    setTimeout(function(){
      Line_PopupShow(line_Jingha)
    },28000)

    setTimeout(function () {
        map.setPaintProperty('GSHK', 'line-opacity', 1);
    }, 30000)
    setTimeout(function(){
      Line_PopupShow(line_GS_HK)
    },32000)

    //1、2、3阶段进行渐变
    setTimeout(function () {
        map.setPaintProperty('1', 'line-opacity', 1);
    }, 32000);
    setTimeout(function () {
        map.setPaintProperty('2', 'line-opacity', 1);
    }, 35000);
    setTimeout(function () {
        map.setPaintProperty('3', 'line-opacity', 1);
    }, 38000);

    setTimeout(function () {
        addPointLayer('Smallpoints', small_point_data)
        map.setPaintProperty('Smallpoints', 'icon-opacity', 1);
    }, 40000);
    setTimeout(function () {      
        addSymbolPointLayer('Symbolpoints', symbol_point_data)
        map.setPaintProperty('Symbolpoints', 'icon-opacity', 1);
    }, 42000);

    Map_MouseOnEvent_Line('JG');
    Map_MouseOnEvent_Poi('Symbolpoints');
    Map_MouseOnEvent_Poi('Smallpoints');

});

//图层选择框
var toggleableLayerIds = ['points', 'route'];
for (var i = 0; i < toggleableLayerIds.length; i++) {
    var id = toggleableLayerIds[i];

    var link = document.createElement('a');
    link.href = '#';
    link.className = 'active';
    link.id = id
    if (id == 'points') {
        link.textContent = '高铁站';
    }
    else if (id == 'route') {
        link.textContent = '铁路线'
    }

    console.log(link.textContent)
    link.onclick = function (e) {
        var clickedLayer = this.id;
        console.log(clickedLayer)

        e.preventDefault();
        e.stopPropagation();

        if (clickedLayer == 'points') {
            clickedLayer = ['Symbolpoints', 'Smallpoints'];
        }
        else if (clickedLayer == 'route') {
            clickedLayer = ['1', '2', '3'];
        }
        clickedLayer.forEach(element => {
            var visibility = map.getLayoutProperty(element, 'visibility');

            if (visibility === 'visible') {
                map.setLayoutProperty(element, 'visibility', 'none');
                this.className = '';
            } else {
                this.className = 'active';
                map.setLayoutProperty(element, 'visibility', 'visible');
            }
        });

    };



    var layers = document.getElementById('menu');
    layers.appendChild(link);
}

//重新加载动画
function Map_animation() {
    Clear()
    map.setPaintProperty('GSHK','line-opacity',0)
    map.setPaintProperty('Jjiu','line-opacity',0)
    map.setPaintProperty('JG','line-opacity',0)
    map.setPaintProperty('BJSH','line-opacity',0)
    map.setPaintProperty('GuiG','line-opacity',0)
    map.setPaintProperty('HuKun','line-opacity',0)
    map.setPaintProperty('HangShen','line-opacity',0)
    map.setPaintProperty('HuRong','line-opacity',0)
    map.setPaintProperty('Longhai','line-opacity',0)
    map.setPaintProperty('Qingzang','line-opacity',0)
    map.setPaintProperty('Lanxin','line-opacity',0)
    map.setPaintProperty('Jingha','line-opacity',0)
    map.setPaintProperty('TaiNan','line-opacity',0)

    map.setPaintProperty('1', 'line-opacity', 0);
    map.setPaintProperty('2', 'line-opacity', 0);
    map.setPaintProperty('3', 'line-opacity', 0);
    map.setPaintProperty('Smallpoints', 'icon-opacity', 0);
    map.setPaintProperty('Symbolpoints', 'icon-opacity', 0);
    map.setLayoutProperty('Symbolpoints', 'visibility', 'none');



    setTimeout(function () {
        map.setPaintProperty('JG', 'line-opacity', 1);
    }, 1000)
    setTimeout(function(){
      Line_PopupShow(line_Jingguang)
    },3000)

    setTimeout(function () {
        map.setPaintProperty('Jjiu', 'line-opacity', 1);
    }, 5000)
    setTimeout(function(){
      Line_PopupShow(line_Jingjiu)
    },7000)

    setTimeout(function () {
        map.setPaintProperty('TaiNan', 'line-opacity', 1);
    }, 5000)
    setTimeout(function(){
      Line_PopupShow(line_TN)
    },7000)

    setTimeout(function () {
        map.setPaintProperty('HuRong', 'line-opacity', 1);
    }, 9000)
    setTimeout(function(){
      Line_PopupShow(line_Hurong)
    },11000)

    setTimeout(function () {
        map.setPaintProperty('HuKun', 'line-opacity', 1);
    }, 9000)
    setTimeout(function(){
      Line_PopupShow(line_HuKun)
    },11000)

    setTimeout(function () {
        map.setPaintProperty('Longhai', 'line-opacity', 1);
    }, 9000)
    setTimeout(function(){
      Line_PopupShow(line_LongHai)
    },11000)

    setTimeout(function () {
        map.setPaintProperty('BJSH', 'line-opacity', 1);
    }, 13000)
    setTimeout(function(){
      Line_PopupShow(line_BeijingShanghai)
    },15000)

    setTimeout(function () {
        map.setPaintProperty('GuiG', 'line-opacity', 1);
    }, 17000)
    setTimeout(function(){
      Line_PopupShow(line_Guiguang)
    },19000)

    setTimeout(function () {
        map.setPaintProperty('HangShen', 'line-opacity', 1);
    }, 21000)
    setTimeout(function(){
      Line_PopupShow(line_HangShen)
    },23000)


    setTimeout(function () {
        map.setPaintProperty('Lanxin', 'line-opacity', 1);
    }, 22000)
    setTimeout(function(){
      Line_PopupShow(line_Lanxin)
    },24000)


    setTimeout(function () {
        map.setPaintProperty('Qingzang', 'line-opacity', 1);
    }, 26000)
    setTimeout(function(){
      Line_PopupShow(line_Qingzang)
    },28000)

    setTimeout(function () {
        map.setPaintProperty('Jingha', 'line-opacity', 1);
    }, 26000)
    setTimeout(function(){
      Line_PopupShow(line_Jingha)
    },28000)

    setTimeout(function () {
        map.setPaintProperty('GSHK', 'line-opacity', 1);
    }, 30000)
    setTimeout(function(){
      Line_PopupShow(line_GS_HK)
    },32000)

    //1、2、3阶段进行渐变
    setTimeout(function () {
        map.setPaintProperty('1', 'line-opacity', 1);
    }, 32000);
    setTimeout(function () {
        map.setPaintProperty('2', 'line-opacity', 1);
    }, 35000);
    setTimeout(function () {
        map.setPaintProperty('3', 'line-opacity', 1);
    }, 38000);

    setTimeout(function () {
        map.setLayoutProperty('Symbolpoints', 'visibility', 'visible');
        map.setPaintProperty('Smallpoints', 'icon-opacity', 1);
    }, 40000);
    setTimeout(function () {
        // addSymbolPointLayer('Symbolpoints', symbol_point_data)

        map.setLayoutProperty('Symbolpoints', 'visibility', 'visible');
        map.setPaintProperty('Symbolpoints', 'icon-opacity', 1);
    }, 42000);

}


