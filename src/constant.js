/**
 * 用于定义常量的
 */

var constant = {};

constant.state = {
	//state key
	IDLE : "0",
	MOVE : "move",
	JUMP : "jump",
	FALL : "fall",
	ATTACK : "attack",
	LIE_DOWN : "lieDown",
	_HURT : "hurt"
};

constant.actType = {
	NORMAL : 0,
	ATTACK : 1
};

constant.nodeType = {
	ACTION : "action",
	FUNC : "func",
	STATE : "state"
};

constant.eventType = {
	ATTACK : "attack",
	HIT : "hit",
	HURT : "hurt",
	RELEASE_SKILL : "release_skill",
	DEAD : "dead"
};

constant.eventPriority = {
		HIGHEST_PRIORITY : 0,
		LOWEST_PRIORITY : 99
};