/**
 * 帧逻辑
 */
FrameAction = Action.extend({
    frame : null,   //ccSpriteFrame类型
    duration : 0,   //持续时长
    
    action : null,	//额外的action

	start : function(unit){
		var view = unit.components.view;
		view.duration = 0;
		ViewComponent.setFrame(unit, this.frame);
		//add to view-com list
		if(this.action){
			this.action.start(unit);
		}
	},

	update : function(dt, unit){
		var view = unit.components.view;
		view.duration += dt;
		if(this.action){
			this.action.update(dt, unit);
		}
	},
	
	checkEnd : function(unit){
		return unit.components.duration >= this.duration;
	}
});

var anmtVldts = null;
AnimateAction.prototype.create = function(data){
    if(!anmtVldts){
        anmtVldts = [this.create("frames","array",true, 1, 99)];
		this.addType("AnimateAction",function(val, label){
			return this.validateObject(val, anmtVldts, label);
            //&& this.assertArrayContentType(val.frames, "frame", label+"-animate.frames");
		});
    }
    var animate = new AnimateAction();
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