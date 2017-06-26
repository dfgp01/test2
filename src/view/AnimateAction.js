/**
 * 基础动画逻辑，大致上和SequenceAction相同
 */
AnimateAction = Action.extend({
    frames : null,   //帧列表,FrameAction类型
    duration : 0,      //持续时长=frames总时长

	start : function(unit){
		var view = unit.components.view;
		view.index = 0;
		this.frames[0].start(unit);
	},

	update : function(dt, unit){
		var view = unit.components.view;
		if(this.frames[view.index].checkEnd(unit)){
			view.index++;
			if(view.index < this.frames.length){
				this.frames[view.index].start(unit);
			}
		}else{
			this.frames[view.index].update(dt, unit);
		}
	},
	
	onUpdate : function(dt, view){
		
		view.duration += dt;
		if(view.duration > this.frames[view.index].duration){
			view.index++;
			if(view.index >= this.frames.length){
				//end
				return;
			}
			view.duration -= this.frames[view.index].duration;
			//view.next = this.frames[view.index].frame;
			//add to render list
		}
	},

	end : function(unit){
		//解除和unit的关系
	},
	
	checkEnd : function(unit){
		return unit.component.view.index >= this.frames.length;
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