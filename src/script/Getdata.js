
function GetGDP_Population(province) {
    var gdp; //GDP
    var population; //人口

    //test
    console.log(province)
    console.log(GDPdata[province])
    gdp = GDPdata[province][10];
    population = populatuondata[province][10];
    //

    return [gdp, population];
}
function GetGDP_array(province) {
    var pro_gdp = GDPdata[province];
    return pro_gdp
}
function GetPopulation_array(province) {
    var pro_population = populatuondata[province];
    return pro_population
}

function getJson(rawsrc) {//src路径
    var json;
    var src="./shapefile/"+rawsrc
    var result = $.ajax({
        async: false,
        type: "get", //使用get方式
        url: src, //json文件相对于这个HTML的路径
        dataType: "json",
        success: function (data) {
            //这个data就是json数据
            console.log(data);
            json = data;
            return data;
        },
        error: function () {
            console.log("请求失败");
        },
    });
    return json;
}
