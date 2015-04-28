
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    deep: null,
    animation: null,
    _runAnima: null,
    _targetPos: null,
    _frameIndex: 0,
    _enemy:[],
    _gravity:0,
    _currentAction:null,
    _currentActionIndex:0,
    _currentFrame:0,
    
    _unit : null,
    _lock : true,
    
    initAct : function(){
    	Factory.createAction(data_walkAction);
    	var standAct = Factory.createActionState(data_walkState);
    	_unit = new Unit();
    	_unit.body = deep;
    	_unit.currAction = standAct;
    	standAct.owner = _unit;
    	_unit.frameIndex = 0;
    },
    
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        // add background
        var bg = new cc.Sprite(background_png);
        bg.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(bg, 0);

        cc.spriteFrameCache.addSpriteFrames(deep_0_plist);
        deep = new cc.Sprite("#deep_stand_0.png");
        deep.attr({
        	x: 150,
        	y: 250
        });
        //deep._flippedX = true;
        deep._scaleX = -1;
        this.addChild(deep, 1);
        
        this.initAct();
        
        var selfPointer = this;
        var listener = cc.EventListener.create({
        	event: cc.EventListener.TOUCH_ONE_BY_ONE,
        	//event: cc.EventListener.TOUCH_ALL_AT_ONCE,
        	swallowTouches: true,
        	onTouchBegan: function (touch, event) {
        		var locationInNode = deep.convertToNodeSpace(touch.getLocation());
        		var s = deep.getContentSize();
        		var rect = cc.rect(0, 0, s.width, s.height);

        		if (cc.rectContainsPoint(rect, locationInNode)) {
        			//cc.log("点中精灵：" + locationInNode.x + "," + locationInNode.y);
        			
        			//标注1：这一句在JSB中报错：Invail Native Object，在chrome中没问题
        			//		网上说action要retain()，估计与内存管理有关
        			//deep.runAction(cc.animate(animation).repeatForever());	
        			cc.log(touch.getID());
        			selfPointer._lock = false;
        			return true;
        		}
        		
        		//selfPointer.nextAction();
        		
        		//返回值是true，往下传递，触发onTouchMoved和onTouchEnded，false则不传递
        		cc.log("id:"+touch.getID() + ", pos:[" + touch.getLocation().x + "," + touch.getLocation().y + "]");
        		return false;
        	},
        	onTouchMoved: function (touch, event) {
        		cc.log("移动:" + touch.getLocation().x + "," + touch.getLocation().y );
        	},
        	onTouchEnded: function (touch, event) {
        		cc.log("释放:" + touch.getLocation().x + "," + touch.getLocation().y );
        	}
        });
        cc.eventManager.addListener(listener, this);
        
        if ('touches' in cc.sys.capabilities) {
        	cc.log("touchs");
        }else{
        	cc.log("not touchs");
        }
        cc.log(bg.getContentSize().width + "," + bg.getContentSize().height + "  " + size.width + "," + size.height);
        
        //标注2：这一句在JSB和chrome下都没问题
        //deep.runAction(cc.animate(animation).repeatForever());
        
        //this.schedule(this.customAnimateRun, 0.2, -1, 0);
        //this.schedule(this.customAnimateRun, 0.12, -1, 0);
        this.scheduleUpdate();
        return true;
    },
    
    runAnimateInit:function(){
    	
    	/**	自定义动画 **/
    	
    	var standAnimate = new game.animate({
    		name:"stand",
    		isRepeat:true,
    		frames:["deep_stand_0.png","deep_stand_1.png","deep_stand_2.png","deep_stand_3.png"]
    	});
    	game.addAnimate(standAnimate);
    	
    	var runAnimate = new game.animate({
    		name:"run",
    		isRepeat:true,
    		frames:["deep_run_0.png","deep_run_1.png","deep_run_2.png","deep_run_1.png"]
    	});
    	game.addAnimate(runAnimate);
    	
    	var attackAnimate = new game.animate({
    		name:"attack",
    		isRepeat:true,
    		frames:["deep_att_1.png","deep_att_2.png","deep_att_2.png"]
    	});
    	game.addAnimate(attackAnimate);
    	
    	var hurtAnimate = new game.animate({
    		name:"hurt",
    		isRepeat:true,
    		frames:["deep_hurt_0.png","deep_hurt_1.png","deep_hurt_2.png","deep_hurt_3.png","deep_hurt_4.png","deep_hurt_5.png","deep_hurt_4.png","deep_hurt_4.png"]
    	});
    	game.addAnimate(hurtAnimate);
    	
    	return;
    },
    
    update:function(dt){
    	if(!this._lock){
    		_unit.run(dt);
    	}
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

var iterObj = function(attr){
	var str = "";
	for(var i in attr){
		if(typeof(attr[i]) != 'function'){
			str += i + ":" + attr[i] + "\n\r";
		}else{
			str += i + ":" + attr[i] + "\n";
		}
	}
	return str;
}
