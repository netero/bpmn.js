BPMN={
	diagrams: new Array(),
	errors:{
		configNullContainer:"Please provide config.container property",
		configNullSkeleton:"Please provide config.skeleton property",
		skeletonNullProcess:"Please provide skeleton.process property",
		skeletonNullWidth:"Please provide skeleton.width property",
		skeletonNullHeight:"Please provide skeleton.height property",
		containerNotExists:"There is no an element with id: {0} in this page."
	},
	elemTypes:[
		{id:0,name:"Event start"},
		{id:1,name:"Event normal end"},
		{id:2,name:"Event terminate end"},
		{id:3,name:"Human task"},
		{id:4,name:"Service task"},
		{id:5,name:"Gateway normal"},
		{id:6,name:"Gateway parallel"},
		{id:7,name:"Gateway complex"}
	],
	exists:function(container){
		for(var i=0;i<this.diagrams.length;i++){
			if(this.diagrams[i].container==container){
				return i;
			}
		}
		return -1;
	},
	draw:function(config){
		//validating required elements inside config object
		if(config.container==null || config.container=="") throw new Error(this.errors["configNullContainer"]);
		if(config.skeleton==null)throw new Error(this.errors["configNullSkeleton"]);
		
		//validating required elements inside config.skeleton object
		if(config.skeleton.process==null || config.skeleton.process=="") throw new Error(this.errors["skeletonNullProcess"]);
		if(config.skeleton.width==null) throw new Error(this.errors["skeletonNullWidth"]);
		if(config.skeleton.height==null) throw new Error(this.errors["skeletonNullHeight"]);
		
		//starting to draw the diagram
		if(document.getElementById(config.container)!=null){
			this.clear(config.container);
			this.diagrams[this.diagrams.length]=config;
		}
		else{
			throw new Error(this.errors["containerNotExists"].replace("{0}",config.container));
		}
	},
	clear:function(container){
		var idDiag=this.exists(container);
		if(idDiag>-1){
			this.diagrams.splice(idDiag,1);
			if(document.getElementById(container)!=null){
				document.getElementById(container).innerHTML="";
			}
		}
	}
}