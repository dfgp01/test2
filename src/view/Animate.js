/**
 * 动画类
 */
Animate = cc.Class.extend({
	isLoop : false, //是否循环播放
    frames : null,   //帧列表
    duration : 0       //持续时长=frames总时长
});

var anmtVldts = null;
Animate.prototype.create = function(data){
    if(!anmtVldts){
        anmtVldts = [this.create("frames","array",true, 1, 99),
		            this.create("isLoop","int",false, NumericalConstant.BOOLEAN_FALSE, NumericalConstant.BOOLEAN_TRUE)];
		this.addType("animate",function(val, label){
			return this.validateObject(val, anmtVldts, label);
            //&& this.assertArrayContentType(val.frames, "frame", label+"-animate.frames");
		});
    }
    var animate = new Animate();
    animate.isLoop = data.isLoop && data.isLoop == NumericalConstant.BOOLEAN_TRUE ? true : false;
    animate.frames = [];
    var fr = null;
    for(var i in data.frames){
        fr = Frame.create(data.frames[i]);
        if(!fr){
            cc.log("Animate.create error.");
            return null;
        }
        animate.frames.push(fr);
    }
    return animate;
};

/**
	 * 创建动画组件
	
	createAnimate : function(data){
		if(!Validator.assertType(data, "animate", "animate")){
			cc.log("createAnimate error.");
			return null;
		}
		data.type = data.type ? data.type : Constant.ANIMATE_ONCE;
		
		var animate = null;
		switch(data.type){
		case Constant.ANIMATE_STATIC:
			animate = new AnimateStaticComponent();
			break;
		case Constant.ANIMATE_ONCE:
			animate = new AnimateComponent();
			break;
		case Constant.ANIMATE_SCROLL:
			animate = new AnimateScrollComponent();
			break;
		}
		
		animate.frames = [];
		for(var i in data.frames){
			var frame = this.createFrame(data.frames[i]);
			if(!frame){
				return null;
			}
			animate.frames.push(frame);
		}
		return animate;
	}, */