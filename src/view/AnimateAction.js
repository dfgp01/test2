/**
 * 动画类
 */
AnimateAction = Action.extend({
	isLoop : false, //是否循环播放
    frames : null,   //帧列表
    duration : 0,      //持续时长=frames总时长

	start : function(unit){
		//在池中拿一个view，根据ID和unit关联，以便在update中可以根据unit获取
	},

	update : function(dt, unit){
		var viewPro = unit.view;
		var frameStates = viewPro.fr;	//这里拿到显示对象，规则后面补。
		if(frameStates.isEnd){
			return;
		}
		frameStates.duration += dt;
		if(frameStates.duration > this.frames[frameStates.index].duration){
			frameStates.duration -= this.frames[frameStates.index].duration;
			frameStates.index++;
			if(frameStates.index >= this.frames.length){
				if(this.isLoop){
					frameStates.index = 0;
				}else{
					frameStates.isEnd = true;
					return;
				}
			}
			frameStates.next = this.frames[frameStates.index].frame;
		}
	},

	end : function(unit){
		//解除和unit的关系
	}
});

var anmtVldts = null;
AnimateAction.prototype.create = function(data){
    if(!anmtVldts){
        anmtVldts = [this.create("frames","array",true, 1, 99),
		            this.create("isLoop","int",false, NumericalConstant.BOOLEAN_FALSE, NumericalConstant.BOOLEAN_TRUE)];
		this.addType("AnimateAction",function(val, label){
			return this.validateObject(val, anmtVldts, label);
            //&& this.assertArrayContentType(val.frames, "frame", label+"-animate.frames");
		});
    }
    var animate = new AnimateAction();
    animate.isLoop = data.isLoop && data.isLoop == NumericalConstant.BOOLEAN_TRUE ? true : false;
    animate.frames = [];
    var fr = null;
    for(var i in data.frames){
        fr = Frame.create(data.frames[i]);
        if(!fr){
            cc.log("AnimateAction.create error.");
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