/**
 * 用于定义常量的
 */

var Constant = {
	ANIMATE_TYPE : {
		NORMAL : 0,
		LOOP : 1
	},
	ACTION_TYPE : {
		CUSTOM : 0,
		IDLE : 1,
		WALK : 2,
		ATTACK : 8
	},
	ACTION_STATE : {
		STAND : 0,
		WALK : 1,
		FALL : 2,
		LIE_DOWN : 3,
		HITTED : 4,
		BUSY : 5,
		DEAD : 6,
		RELEASE : 7,
		ATTACK : 8
	},
	CMD : {
		UP : 128,
		DOWN : 64,
		LEFT : 32,
		RIGHT : 16,
		ALL_DIRECTION : 240,	//用于判断是否按下了任一方向键，不用每次判断都用 "|"运算
		ATTACK : 8
	}
};


Constant.nodeType = {
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