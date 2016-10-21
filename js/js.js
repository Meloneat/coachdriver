/**
 * Created by ShareUS on 2016/10/16.
 */
var map = new BMap.Map("container");//在container容器中创建一个地图,参数container为div的id属性;
/*控件、标注和图层参数--start*/
//缩略控件参数
var navopt = [{type:BMAP_NAVIGATION_CONTROL_LARGE},{type:BMAP_NAVIGATION_CONTROL_SMALL}
                ,{type:BMAP_NAVIGATION_CONTROL_PAN},{type:BMAP_NAVIGATION_CONTROL_ZOOM}]
//信息窗口参数
var infopt = {
    width : 250,     // 信息窗口宽度
    height: 100,     // 信息窗口高度
    title : "Hello"  // 信息窗口标题
}
//折线图形参数
var polyline = new BMap.Polyline([
        new BMap.Point(116.399, 39.910),
        new BMap.Point(116.402, 39.899)
    ],
    {strokeColor:"blue", strokeWeight:6, strokeOpacity:0.5}
);
//图层参数
var traffic = new BMap.TrafficLayer();        // 创建交通流量图层实例
var tilelayer = new BMap.TileLayer();         // 创建自定义地图层实例
/*控件、标注和图层参数--end*/

/*设置控件位置--start*/

/*设置控件位置--end*/

/*自定义控件-start*/
function ZoomControl(){
    this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
    this.defaultOffset = new BMap.Size(60,10);
}
ZoomControl.prototype = new BMap.Control();
ZoomControl.prototype.initialize = function(map){
// 创建一个DOM元素
    var div = document.createElement("div");
// 添加文字说明
    div.appendChild(document.createTextNode("放大"));
    // 设置样式
    div.style.cursor = "pointer";
    div.style.border = "1px solid gray";
    div.style.backgroundColor = "white";
    // 绑定事件，点击一次放大两级
    div.onclick = function(e){
        map.zoomIn();
    }

    // 添加DOM元素到地图中
    map.getContainer().appendChild(div);
    // 将DOM元素返回
    return div;
}
/*自定义控件--end*/

/*自定义函数--start*/
map.addEventListener("click", function(e)   {
    PO_LNG = e.point.lng;
    PO_LAT = e.point.lat;
    console.warn("点击的坐标：" + e.point.lng + ", " + e.point.lat);
    console.warn("点击的坐标：" + PO_LNG + ", " + PO_LAT);
    var polyline_click = new BMap.Polyline([
            new BMap.Point(116.399, 39.910),
            new BMap.Point(PO_LNG, PO_LAT)
        ],
        {strokeColor:"green", strokeWeight:6, strokeOpacity:0.8}
    );
    ;
    map.addOverlay(polyline_click);

});
//自定义图层
/**********图层的自定义方法介绍****************************
 TileLayer实例的getTilesUrl方法需要实现，用来告诉API取图规则。
 getTilesUrl方法的参数包括tileCoord和zoom，其中tileCoord为图
 块的编号信息，zoom为图块的级别，每当地图需要显示特定级别的
 特定位置的图块时就会自动调用此方法（很重要，因为后期可能要
 建立各类热图）
 ********************************************************/
tilelayer.getTilesUrl = function(e){
    return NULL;
}


/*自定义函数--end*/

/*自定义标注图形-start*/
function addMarker(point, index){  // 创建图标对象
    var myIcon = new BMap.Icon("markers.png", new BMap.Size(23, 25), {
// 指定定位位置。
// 当标注显示在地图上时，其所指向的地理位置距离图标左上
// 角各偏移10像素和25像素。您可以看到在本例中该位置即是
        // 图标中央下端的尖角位置。
        offset: new BMap.Size(10, 25),
        // 设置图片偏移。
        // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您
        // 需要指定大图的偏移位置，此做法与css sprites技术类似。
        imageOffset: new BMap.Size(0, 0 - index * 25)   // 设置图片偏移
    });
// 创建标注对象并添加到地图
    var marker = new BMap.Marker(point, infopt);
    map.addOverlay(marker);
}
/*自定义标注图形-end*/

/*程序入口*/
//创建地图
var point = new BMap.Point(116.404, 39.915);//定位
map.centerAndZoom(point,16);				//将point移到浏览器中心，并且zoom级别为15;
var marker = new BMap.Marker(point);        // 创建标注
var infoWindow = new BMap.InfoWindow("World", infopt);  // 创建信息窗口对象
//        map.setZoom(3);                     //设置缩放等级3-19.
//        window.setTimeout(function(){
//
//            map.panTo(new BMap.Point(116.409, 39.918));
//
//        }, 2000);
/*添加控件--start*/
map.addControl(new BMap.NavigationControl(navopt[1]));  //地图平移缩放控件
map.addControl(new BMap.OverviewMapControl());          //缩略地图控件
map.addControl(new BMap.ScaleControl());                //比例尺控件
map.addControl(new BMap.MapTypeControl());              //地图类型控件
//map.addControl(new BMap.CopyrightControl());            //版权控件
map.addControl(new BMap.GeolocationControl());          //定位控件,针对移动端
map.addControl(new ZoomControl());                      //自定义控件，可以放大地图两级
/*添加控件--end*/

/*添加覆盖物--start*/
map.addOverlay(marker);                               // 将标注添加到地图中
map.addOverlay(polyline);                             // 将折线添加到地图中
map.openInfoWindow(infoWindow, map.getCenter());      // 将信息窗口添加到地图中
/*添加覆盖物--end*/

/*添加图层--start*/
map.addTileLayer(traffic);                          //将图层添加到地图上
/*添加图层--end*/

//增加标注拖拽
marker.addEventListener("click", function(){           //标注点击弹跳出文字框
    alert("hi");
});
marker.enableDragging();                    //可以拖拽标注
marker.addEventListener("dragend", function(e){ //增加点击监听事件
    alert("当前位置：" + e.point.lng + ", " + e.point.lat);
})

map.enableKeyboard();                      //开启键盘

console.warn("34")
console.log("是否使用高分辨率底图：" + map.highResolutionEnabled());
console.log("地图容器Element：" + map.getContainer());
console.log("当前地图中心点：" + map.getSize());