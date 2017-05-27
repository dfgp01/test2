/**
 * 单位运动属性
 */
MoveProperty = Property.extend({
	name : "move",
	ratio : 1,		//速度比例系数
	dx : 0,			//dx,dy,dz 代表移动增量
	dy : 0,
	dz : 0
});

MoveProperty.prototype.create = function(){
	return new MoveProperty();
};

MoveProperty.prototype.clone = function(moveProperty){
	var p = new MoveProperty();
	p.ratio = moveProperty.ratio;
	return p;
};