/**
 * action package
 */

var output = [];

function NomalAttContainer(){
	this.data = null;
	//this.orignData = null;		back-up wheather if some property has change. eg: buff
	this.nodes = [];
	this.nodeIndex = 0;
	this.currentRepeatPhase = 0;		// -1 is when repeats is null
	this.repeatCount = 0;
	this.repeats = [];
	this.frameIndex = 0;
	this.isEnd = false;
	
	this.init = function(){
		this.data = game.property.act.NORMAL_ATT;
		// splice frames to create actNodes
		for(var i=0; i<this.data.frames.length; i++){
			var act = new ActionNode();
			act.frames = this.data.frames[i];
			this.nodes.push(act);
		}
		
		if(this.data.repeat == undefined || this.data.repeat.length == 0){
			this.currentRepeatPhase = -1;
		}else{
			this.currentRepeatPhase = 0;
			for(var i=0; i<this.data.repeat.length; i++){
				var repeat = this.data.repeat[i];
				this.repeats.push(repeat);
			}
			this.repeatCount = this.repeats[this.currentRepeatPhase].count;
		}
	}
	this.start = function(){
		this.nodeIndex = 0;
		this.currentRepeatPhase = 0;
		this.frameIndex = 0;
	}
	this.run = function(){
		this.nodes[this.nodeIndex].frameIndex = this.frameIndex;
		this.nodes[this.nodeIndex].run();
		this.frameIndex++;
		if(this.nodes[this.nodeIndex].isEnd){
			this.nodes[this.nodeIndex].isEnd = false;	//re active
			this.nextAction();
		}
		if(this.nodeIndex > this.nodes.length - 1){
			this.isEnd = true;
		}
	}
	this.nextAction = function(){
		this.frameIndex = 0;
		if(this.currentRepeatPhase == -1){
			this.nodeIndex++;
			return;
		}
		if(this.nodeIndex == this.repeats[this.currentRepeatPhase].end){
			if(this.repeatCount <= 0){
				this.nodeIndex++;
				this.currentRepeatPhase++;
				if(this.currentRepeatPhase >= this.repeats.length){
					this.currentRepeatPhase = -1;
					return;
				}
				this.repeatCount = this.repeats[this.currentRepeatPhase].count;
			}else{
				this.repeatCount--;
				this.nodeIndex = this.repeats[this.currentRepeatPhase].start;
			}
		}else{
			this.nodeIndex++;
		}
		
		
	}
}

function ActionNode(id, name, frames){
	this.frameIndex = 0;
	this.isEnd = false;
	this.id = id;
	this.name = name;
	this.frames = frames;
	this.run = function(){
		if(this.frameIndex > this.frames.length -1){
			this.isEnd = true;
			return;
		}
		//output.push(this.frames[this.frameIndex]);
	}
}