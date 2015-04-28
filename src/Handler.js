/**
 *  逻辑处理器
 *  二进制码mask的说明：
 *  //可击中	1	省略
 *  可硬直	0001
 *  可倒地	0010
 *  可抓取	0100
 *  可反弹	1000
 */

Handler = cc.Class.extend({
	run : function(source){}
});

HitHandler = Handler.extend({
	run : function(source, targets){
		var maskA = source.currAction.mask;
		var maskB = 0;
		for(var i in targets){
			maskB = maskA & targets[i].mask;
			if(maskB==0){			//霸体
				
			}else if(maskB==1){	//硬直
				
			}else if(maskB==2){	//倒地
				
			}else if(maskB==4){	//抓取
				
			}else{
				
			}
			//targets[i].runState("hurt");
		}
	}
});
