/**
 * 用于定义常量的
 */

var constant = {
	ACTION_STATE : {
		IDLE : 0,
		WALK : 1,
		FALL : 2,
		LIE_DOWN : 3,
		HITTED : 4,
		BUSY : 5,
		DEAD : 6,
		RELEASE : 7,
		ATTACK : 8
	}
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