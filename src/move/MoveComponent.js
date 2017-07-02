/**
 * 单位运动属性
 */
MoveComponent = Component.extend({
	name : "move",
	ratio : 1,		//速度比例系数
	dx : 0,			//dx,dy,dz 代表移动增量
	dy : 0,
	dz : 0
});

MoveComponent.prototype.create = function(){
	return new MoveComponent();
};

MoveComponent.prototype.clone = function(moveComponent){
	var p = new MoveComponent();
	p.ratio = moveComponent.ratio;
	return p;
};