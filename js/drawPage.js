function drawPage(stimulus, participant, condition, input, block) {
    //-----------------DECLARE GLOBAL VARS-----------------
    var canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d'); //create the canvas
    var collider_circles = []; //create the array of colliders (area of interest/tigger zones)
    var lastRegion = -1; //variable to hold the last region the mouse was in
    var pics = []; //array to store picture objects
    var sounds = []; //array to store audio objects
    var images = [];
    var places = []; //array to hold background highlights
		var page = stimulus;
		var cursor = document.getElementById('cursor');
		var isFix;
		
    //-----------------HANDLE GAZE CONDITION------------
		if (input =='gaze'){
	  		var clientOrigin = {
	  		  left: window.screenLeft,
	  		  top: window.screenTop
	  		} //not sure why we need to do this

				var gaze_point = new SAT.Vector(0,0); //declare vector to contain gaze coords
				console.log("SET TO GAZEPOINT");
				
			  setInterval(function () { //call the update with gaze_point as input
		        update(collider_circles, gaze_point,isFix);
		    }, 100); //set the logging interval

	  		EyeTribe.loop(function(frame){
	  		  // dump.innerHTML = frame.dump();
					locateCursor(frame);	 
				  gaze_point.x = frame.average.x;
					gaze_point.y = frame.average.y;
					isFix = frame.isFixated;
					console.log(frame);
					
				})
				
			 	function locateCursor(frame) {
	  		    locateElement(cursor, frame.average);
	  		}
	  		function locateElement(element, position)
				{
	  		  element.style.display = 'block';
	  		  element.style.left = (position.x - clientOrigin.left - element.clientWidth / 2) + 'px';
	  		  element.style.top = (position.y - clientOrigin.top - element.clientHeight / 2) + 'px';
	  		}
					
		}
    //-----------------HANDLE MOUSE CONDITION-----------
		else //ONLY display the eyes in the gaze condition
		{
    	cursor.style.display = 'none';

	    //-----------------SETUP MOUSE STUFF-----------------
	    var mouse_point = new SAT.Vector(0, 0); //declare a vector to contain the mouse coordinates
	    document.onmousemove = function (mouse) { //define what happens when the mouse moves
	        mouse_point.x = mouse.clientX;
	        mouse_point.y = mouse.clientY;
	    };

		  setInterval(function () {
	        update(collider_circles, mouse_point);
	    }, 100); //set the logging interval

		}

    //-----------------HOUSEKEEPING---------------------
    window.addEventListener('resize', resizeCanvas, false); // resize the canvas to fill browser window dynamically
    window.addEventListener("keydown", doKeyDown, true); //add keyboard key listener
   

    //-----------------SETUP DATA STUFF-----------------
    var data = [[]];
    var titles = ["participant","condition","block","input","stimulus","region","triggered","timestamp","X","Y","Fixation"];
    data.push(titles);
		//isFix is only populated for mouseGaze blocks
		
    //-----------------NOW DRAW STUFF----------------
    drawStuff(); //draw the stimuli to the canvas
		
    //----------------------
    //ONLY CALLED IF WINDOW IS RESIZED (AUTOMATICALLY BASED ON EVENT LISTENER)
    //----------------------
    function resizeCanvas() {
        drawStuff(); //redraw the content if the window is resized
    }

    //----------------------
    //CALLED ONCE ON PAGE LOAD + ON EVERY RESIZE
    //----------------------
    function drawStuff() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        var winW = window.innerWidth;
        var winH = window.innerHeight;
        var nrows = 3;
        var ncols = 3;
        var radius = 60;
        var counter = 0;
        pics = getStimulus(page);
        for (i = 1; i <= nrows; i++) {
            for (z = 1; z <= ncols; z++) {
                var right = (i / ncols) * winW - (1 / (nrows * 2)) * winW;
                var down = (z / nrows) * winH - (1 / (ncols * 2)) * winH;
                var the_point = new SAT.Vector(right, down);
                places[counter]=drawCircle(right,down,radius); //so we can see the trigger areas

                //now we create an array of collider objects to trigger events from mouse or gaze
                collider_circles.push(new SAT.Circle(the_point, radius));
                var end_ix = collider_circles.length - 1;
                //console.log('collider_circles.length:', i,z);  

                place_stimuli(right, down, pics[counter], counter); //place centered image
                counter += 1;
            } //end inner for
        } //end outer for
    }
		
    //----------------------
    //DEBUGGING HELPER FOR DRAWING COLLIDER CIRCLES
    //----------------------
    function drawCircle(px_right,px_down,radius){
        var c=document.getElementById("canvas");
        var ctx=c.getContext("2d");
        ctx.beginPath();
        ctx.arc(px_right,px_down,radius,0,2*Math.PI);
        ctx.stroke();
    }

    //----------------------
    //CALLED ONCE TO LOAD THE STIMULUS LIST BASED ON PAGE NAME 
    //----------------------
    function getStimulus(stimulus) {
        switch (stimulus) {
        case "fish":
            pics = ["cod", "haddock", "halibut", "herring", "lesser.weaver", "mackeral", "monkfish", "salmon", "scab"];
            break;
        case "flags":
            pics = ["cameroon", "malawi", "morocco", "mozambique", "namibia", "rwanda", "senegal", "tanzania", "zambia"];
            break;
        case "mushrooms":
            pics = ["cortinar", "deadly.fibercap", "death.cap", "destroying.angel", "fly.agaric", "ivory.funnel", "livid.enteloma", "sulfur.tuft", "yellow.staining"];
            break;
        case "viruses":
            pics = ["coronavirus", "filovirus", "hantavirus", "hepatitusvirus", "herpesvirus", "mastadenovirus", "rabiesvirus", "rhinovirus", "smallpoxvirus"];
            break;
        case "training":
            pics = ["cat", "cow", "elephant", "goat", "hippopotamus", "monkey", "penguin", "sheep", "zebra"];
            break;
        }
        return pics;
    }

    //----------------------
    //CALLED ONCE TO LOAD EACH IMAGE AND SOUND (BY DRAWSTUFF)
    //----------------------
    function place_stimuli(px_right, px_down, img_name, counter) {
        images[counter] = new Image();
        images[counter].onload = function () {
            context.drawImage(images[counter], px_right - (this.width / 2), px_down - (this.height / 2));
        }
        images[counter].src = "img/" + page + "/" + img_name + ".png";        
				sounds[counter] = new Audio("img/" + page + "/" + img_name + ".mp3");	 
	  }

    //----------------------
    ///CALLED EVERY FEW MS BASED ON setInterval 
    //----------------------
    function update(collider_circles, point,isFix) {
        var currRegion = -1; //reset the current region to null on each update
        var triggered = 0; //reset the trigger to null on each update

        for (var key in collider_circles) //for each collider 
        {
						var isColliding = SAT.pointInCircle(point, collider_circles[key]); //is the pointer in it?
            if (isColliding) //if so
            {                
								currRegion = key; //set the current region = the collider number
								console.log(currRegion);
							  // document.getElementById("d"+key).style.background="red";
								document.getElementById("d"+key).innerHTML="<img src=img/highlight.png>";
						}
						else {
							document.getElementById("d"+key).innerHTML="";
						}
				}
				
        if (currRegion > -1) //if the current region is not whitespace
        {
            document.title = currRegion; //change doc title 
            if (currRegion != lastRegion) //if the current region is DIFFERENT from the last region
            {
                sounds[currRegion].play(); //TRIGGER THE SOUND! YAY!
                triggered = 1; //note that it was triggered 
            }
						
        } 
				else //if the current region IS whitespace
        {
            // document.getElementById(lastRegion).style.display="none";
						document.title = "?" //change the title 
        }
        lastRegion = currRegion; //prepare for next update by setting lastRegion = currentRegion
				// document.getElementById(lastRegion).style.display="none";
        var row = [participant, condition, block, input, stimulus, parseInt(currRegion), triggered, Date.now(), point.x, point.y,isFix];
        // console.log(row);
       data.push(row);
    }

    //----------------------
    ///CALLED EVERYTIME A KEY IS PRESSED 
    //----------------------
    function doKeyDown(e) {
				switch (e.keyCode) {
        case 13:
          //  console.log(" KEY PRESSED");
          saveData(data,block,condition,"learn",input,stimulus,participant);
          window.location.href = "assess.html?participant=" + participant + "&condition=" + condition + "&block=" + block + "&input=" + input + "&stimulus=" + stimulus;
            break;
        }
    }
}