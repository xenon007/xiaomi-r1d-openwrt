function PieChart (config) {
	/**
	* config
	* id container id
	* wt paper width
	* he paper height
	* cx center x
	* cy center y
	* r radius
	* data=[{value:12, label: '', type = "img url"}]
	* count = {value:123, label:'MB'}
	*
	*/
	var id = config.id,
		wt = config.wt,
		ht = config.ht,
		cx = config.wt / 2,
		cy = config.ht/ 2,
		r = config.r,
		datas = config.datas,
		stroke = config.stroke,
		count = config.count,
		paper = Raphael(id, wt, ht),
		rad = Math.PI / 180;

	this.total = 0;
	this.paper = paper;
	this.table = $(document.getElementById(id+'table'));
	this.chart = paper.set();
	this.datas = datas;
	this.stroke = stroke;
	this.r = r;
	this.cx = cx;
	this.cy = cy;
	this.count = count;
	this.rad = rad;
	this.init();
};

PieChart.prototype.init = function(){
	// this.loading();
};

//增加可配置总数([].total)属性
PieChart.prototype.getTotal = function(){
	// get total
	var datas = this.datas,
		dataTotal = 0;
	if( datas.total ){
		this.total = datas.total;
	}else{
		for (var i = 0, ii = datas.length; i < ii; i++) {
			dataTotal += datas[i].value;
		}
		this.total = dataTotal;
	}
}

PieChart.prototype.drawCount = function(){
	var paper = this.paper;
	var count = this.count;
	var cx = this.cx;
	var cy = this.cy;
	var r = this.r - 4;

	if( count.value == 0 ){
		this.curr =  paper.circle(cx, cy, r)
				.attr({fill:'#f2f2f2', 'fill-opacity': 0.35, "stroke-width": 2, stroke: "#ccc" });
	}else{
		this.curr =  paper.circle(cx, cy, r)
			.attr({fill:'#fff', 'fill-opacity': 0.35, "stroke-width": 0 });
	}

};

PieChart.prototype.drawPie = function(){
	var angle = 0,
		dataTotal = 0,
		start = 0,
		datas = this.datas,
		total = this.total,
		paper = this.paper,
		chart = this.chart,
		r = this.r - 2,
		cx = this.cx,
		cy = this.cy,
		stroke = this.stroke,
		rad = this.rad,
		table = [],
		elTable = $('#piecharttable'),
		process = function (j) {
			var value = datas[j].value,
				value2 = datas[j].value2,
				label = datas[j].label,
				pietype = datas[j].type,
				dColor = datas[j].color,
				percent = total ? (value / total * 100).toFixed(1) : 0,
				r1 = r,
				r2 = r,
				angleplus = 360 * value / total,
				popangle = angle + (angleplus / 2),
				color = dColor ? dColor : Raphael.hsb(start, .8, .9),
				ms = 500,
				delta = 30,
				bcolor = dColor ? Raphael.rgb2hsb(Raphael.getRGB(dColor).r, Raphael.getRGB(dColor).g, Raphael.getRGB(dColor).b) : Raphael.hsb(start, .9, .7),
				pie = sector(cx, cy, r2, angle, angle + angleplus, {
					fill: color,
					stroke: stroke,
					"stroke-width": 0
				});

			pie.id = 'pie_'+j;

			var valueShow = byteFormat(value);
			var value2Show = byteFormat(value2);
			var tableItem = {
				color : color,
				label : StringH.encode4HtmlValue(label),
				percent : percent,
				valueShow : valueShow,
				value2Show : value2Show + '/S'
			};
			table.push(tableItem);
			angle += angleplus;
			chart.push(pie);
			start += .1;
		};

	function sector (cx, cy, r, startAngle, endAngle, params){
		//sector pie item path
		console.log(cx, cy, r, startAngle, endAngle, params);
		var x1 = cx + r * Math.cos(-startAngle * rad),
			x2 = cx + r * Math.cos(-endAngle * rad),
			y1 = cy + r * Math.sin(-startAngle * rad),
			y2 = cy + r * Math.sin(-endAngle * rad);

		if ((endAngle - startAngle) == 360) {
			return paper.circle(cx, cy, r).attr(params);
		}else{
			return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
		}
	}
	// draw pie
	for (var i = 0, len = datas.length; i < len; i++) {
		process(i);
	}
	//draw table
	var tmplTable = '<li class="item"><i class="ico color" style="background:{$color};"></i><span class="name">{$label}</span><span class="value"  style="color:{$color};">{$valueShow}</span><span class="percent">{$percent}%</span></li>';
	var arrTable = [];
	for (var i = 0, len = table.length; i < len; i++) {
		arrTable.push(StringH.tmpl(tmplTable, table[i]));
	};
	this.table.html('<ul class="list">'+ arrTable.join('') +'</ul>');
	//硬盘状态显示可用容量
	if( datas.available ){
		datas.push( datas.available );
		process( datas.length-1 );
	}
};

PieChart.prototype.loaddone = function(){
	this.paper.clear();
};

PieChart.prototype.clear = function(){
	this.paper.clear();
};

PieChart.prototype.update = function(datas, count){
	this.datas = datas;
	this.count = count;
	this.loaddone();
	this.getTotal();
	this.drawPie();
	this.drawCount();
};