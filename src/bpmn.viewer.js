BPMN={
	diagrams: new Array(),
	errors:{
		configNullContainer:"Please provide config.container property",
		configNullSkeleton:"Please provide config.skeleton property",
		skeletonNullProcess:"Please provide skeleton.process property",
		skeletonNullWidth:"Please provide skeleton.width property",
		skeletonNullHeight:"Please provide skeleton.height property",
		containerNotExists:"There is no an element with id: {0} in this page.",
		elemIdNotValid:"Please provide the id of element. Array index: {0}",
		elemTypeNotValid:"Please provide a valid type for element with id {0}"
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
		//Must be in the pool - if(config.skeleton.process==null || config.skeleton.process=="") throw new Error(this.errors["skeletonNullProcess"]);
		if(config.skeleton.width==null) throw new Error(this.errors["skeletonNullWidth"]);
		if(config.skeleton.height==null) throw new Error(this.errors["skeletonNullHeight"]);
		
		//defining default variables
		if(config.textMargin==null || isNaN(config.textMargin))config.textMargin=7;
		
		
		//starting to draw the diagram
		var elemContainer=document.getElementById(config.container);
		if(elemContainer!=null){
			this.clear(config.container);
			this.diagrams[this.diagrams.length]=config;
			
			//setting background of container
			elemContainer.style.backgroundColor=config.skeleton.style.containerBackground;
			elemContainer.style.display="block";
			elemContainer.style.position="absolute";
			elemContainer.style.overflow="auto";
			
			//setting the size of container
			if(config.width!=null && !isNaN(config.width)){
				elemContainer.style.width=config.width;
			}
			else{
				elemContainer.style.width= config.skeleton.width;
			}
			if(config.height!=null && !isNaN(config.height)){
				elemContainer.style.height=config.height;
			}
			else{
				elemContainer.style.height=config.skeleton.height;
			}
			
			//setting the stage
			var stage = new Kinetic.Stage({
				container: config.container,
				width: config.skeleton.width,
				height: config.skeleton.height
			});
			
			//creating layers
			var poolsLayer=new Kinetic.Layer();
			var lanesLayer=new Kinetic.Layer();
			var phasesLayer=new Kinetic.Layer();
			var elemsLayer=new Kinetic.Layer();
			var logoLayer=new Kinetic.Layer();
			var processLayer=new Kinetic.Layer();
			
			//creating pools ,pashes and lanes
			var pools=config.skeleton.pools;
			for(var i=0;i<pools.length;i++){
				var pool = new Kinetic.Rect({
					x:pools[i].x,
					y:pools[i].y,
				  width: pools[i].width,
				  height: pools[i].height,
				  stroke: 'black',
				  strokeWidth: 3
				});
				
				/*
				*	The folowing lines define the pool 
				*	name and its position
				*/
				var poolName=new Kinetic.Text({
				  text: pools[i].name,
				  fontSize: 30,
				  fontFamily: 'Calibri'
				});
				poolName=new Kinetic.Text({
				  x: pools[i].x+config.textMargin,
				  y:pools[i].y+(pools[i].height+poolName.getWidth())/2,
				  text: pools[i].name,
				  fontSize: 30,
				  fontFamily: 'Calibri',
				  fill: 'black',
				  rotation:Math.PI*-1/2
				});
				
				var poolNameRect = new Kinetic.Rect({
					x:pools[i].x,
					y:pools[i].y,
				  width: 2*config.textMargin+poolName.getHeight(),
				  height: pools[i].height,
				  stroke: 'black',
				  strokeWidth: 3
				});
				
				var startXPos=poolNameRect.getWidth()+pools[i].x;
				var startYPos=pools[i].y;
				var lanes=pools[i].lanes;
				var laneNameRectWidth=0;
				for(var j=0;j<lanes.length;j++){
				
					var laneHeight=lanes[j].percentHeight*pools[i].height/100;
				
					var lane= new Kinetic.Rect({
						x:startXPos,
						y:startYPos,
						width: pools[i].width-poolNameRect.getWidth(),
						height: laneHeight,
						stroke: 'black',
						strokeWidth: 3
					});
					
					
					
					/*
					*	The folowing lines define the lane 
					*	name and its position
					*/
					var laneName=new Kinetic.Text({
						text: lanes[j].role,
						fontSize: 30,
						fontFamily: 'Calibri'
					});
					laneName=new Kinetic.Text({
						x: startXPos+config.textMargin,
						y:startYPos+(laneHeight+laneName.getWidth())/2,
						text: lanes[j].role,
						fontSize: 30,
						fontFamily: 'Calibri',
						fill: 'black',
						rotation:Math.PI*-1/2
					});
					
					var laneNameRect = new Kinetic.Rect({
						x:startXPos,
						y:startYPos,
						width: 2*config.textMargin+laneName.getHeight(),
						height: laneHeight,
						stroke: 'black',
						strokeWidth: 3
					});
					
					laneNameRectWidth=laneNameRect.getWidth();
					
					startYPos+=laneHeight;
					
					lanesLayer.add(lane);
					lanesLayer.add(laneName);
					lanesLayer.add(laneNameRect);
				}
				
				//update the value of startXPos adding the laneNameRect.width()
				startXPos+=laneNameRectWidth;
				startYPos=pools[i].y;
				
				var poolLaneNameRectWidth=laneNameRectWidth+poolNameRect.getWidth();
				
				//Drawing phases
				var phases=pools[i].phases;
				for(var j=0;j<phases.length;j++){
					
					var phaseWidth=phases[j].percentWidth*(pools[i].width-poolLaneNameRectWidth)/100;
					
					var phase= new Kinetic.Rect({
						x:startXPos,
						y:startYPos,
						width: phaseWidth,
						height: pools[i].height,
						stroke: 'black',
						strokeWidth: 3
					});
					
					
					
					/*
					*	The folowing lines define the phase 
					*	name and its position
					*/
					var phaseName=new Kinetic.Text({
						text: phases[j].name,
						fontSize: 30,
						fontFamily: 'Calibri'
					});
					phaseName=new Kinetic.Text({
						x: startXPos+(phaseWidth-phaseName.getWidth())/2,
						y:startYPos+config.textMargin,
						text: phases[j].name,
						fontSize: 30,
						fontFamily: 'Calibri',
						fill: 'black'
					});
					
					startXPos+=phaseWidth;
					
					phasesLayer.add(phase);
					phasesLayer.add(phaseName);
					
					
				}
				
				
				poolsLayer.add(pool);
				poolsLayer.add(poolName);
				poolsLayer.add(poolNameRect);
				
			}
			
			//Drawing elements
			
			var elems=config.skeleton.elems;
			var picsElems= new Array();
			
			for(var i =0;i<elems.length;i++){
				var elem=elems[i];
				var elemType=this.elemTypes[elem.type];
				if(elem.id==null || elem.id=="")throw new Error(this.errors["elemIdNotValid"].replace("{0}",i));
				if(elemType==null)throw new Error(this.errors["elemTypeNotValid"].replace("{0}",elem.id));
				
				
				
				//Drawing events
				if(elemType.id==0 || elemType.id==1 || elemType.id==2 ){
					var fillColor;
					if(elemType.id==0)fillColor='#169109';
					else if(elemType.id==1)fillColor='#a76363';
					else fillColor='#910909';
					
					var event = new Kinetic.Circle({
						x:elem.position.x,
						y:elem.position.y,
						radius: 18,
						fill: fillColor
					});
					
					var eventName=new Kinetic.Text({
						text: elem.name,
						fontSize: 16,
						fontFamily: 'Calibri'
					});
					
					eventName=new Kinetic.Text({
						x: elem.position.x-eventName.getWidth()/2,
						y:elem.position.y + 18 +config.textMargin,
						text: elem.name,
						fontSize: 16,
						fontFamily: 'Calibri',
						fill: 'black'
					});
					
					var group = new Kinetic.Group({
						draggable:config.editable
					});
					group.add(event).add(eventName);
					
					elemsLayer.add(group);
				}
				
			}
			
			stage.add(poolsLayer).add(lanesLayer).add(phasesLayer).add(elemsLayer);
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