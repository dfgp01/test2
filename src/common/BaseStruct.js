/**
 * 基础数据结构体
 */
Node = cc.Class.extend({
	prep : null,
	next : null
});

CollideTeam = cc.Class.extend({
	type : 0,
	mask : 0,
	members : 0
});

Rect = cc.Class.extend({
	x : 0,
	y : 0,
	xMax : 0,
	yMax : 0,
	width : 0,
	height : 0
});

Position = {
	x : 0,
	y : 0
};