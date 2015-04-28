//an entity defined demo:
var attObj = {
		name : "极速飓风拳",
		acts : [
		        {
		        	name : "prepare",
		        	frames : [1,2,3],
		        	rect : null
		        },
		        {
		        	name : "hit",
		        	frames : [4,5,6],	//此阶段会重复数次，具体重复逻辑在ActionNode中写，Action类只负责包装
		        	rect : [1,1,50,50],
		        	vec : [12,0]		//vec2d的移动逻辑在ActionNode中写，此处只封装数据
		        },
		        {
		        	name : "end",
		        	frames : [7,8],
		        	rect : null
		        }
		        ]
};

var idle_entity = {
	name : "idle",
	frames : [
	          "deep_stand_0.png",
	          "deep_stand_1.png",
	          "deep_stand_2.png",
	          "deep_stand_3.png"
	         ]
}