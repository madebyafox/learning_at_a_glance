function drawAssess(stimulus, participant, condition, input, block) {
    //-----------------DECLARE GLOBAL VARS-----------------
    var canvas = document.getElementById('canvas');
        context = canvas.getContext('2d'); //create the canvas
    var collider_circles = []; //create the array of colliders (area of interest/tigger zones)
    var lastRegion = -1; //variable to hold the last region the mouse was in
    var pics   = []; //array to store picture objects
    var random_order = []; //random order for subjects
    var sounds = []; //array to store audio objects
    var page = stimulus;

    //-----------------HOUSEKEEPING---------------------
    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false); 
    window.addEventListener("keydown", doKeyDown, true); //add keyboard key listener
    
    //NEXT: if gaze, then hide cursor and display cursor icon according to gaze
    //OR, if osx has gae control, we might be able to use that
    setInterval(function () {
        update(collider_circles, mouse_point);
    }, 100); //set the logging interval
    
    //-----------------SETUP MOUSE STUFF-----------------
    var mouse_point = new SAT.Vector(0, 0); //declare a vector to contain the mouse coordinates
    document.onmousemove = function (mouse){ //define what happens when the mouse moves
            mouse_point.x = mouse.clientX;
            mouse_point.y = mouse.clientY;
        };

    //-----------------SETUP DATA STUFF-----------------
    var data = [[]];
    var titles = ["participant", "condition", "block", "input", "stimulus", "timestamp", "xmousex", "ymousey", "region","region_tested","isAnswer","name_tested","name_answered"];
    data.push(titles);

    //#TODO: does anything in this file need to change for mouse vs. gaze??

    //-----------------NOW DRAW STUFF----------------
    drawStuff(); //draw the stimuli to the canvas
    window.sound_num = random_order[0];//
    sounds[window.sound_num].play();
    
    //document.title = parseInt(window.sound_num);
    //play_shuffled_sounds();
    //sounds[0].play();
    
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
        var radius  = 60;
        var counter = 0;
        var images  = {};
        pics = getStimulus(page);
        for (i = 1; i <= nrows; i++) {
            for (z = 1; z <= ncols; z++) {
                var right = (i / ncols) * winW - (1 / (nrows * 2)) * winW;
                var down = (z / nrows) * winH - (1 / (ncols * 2)) * winH;
                var the_point = new SAT.Vector(right, down);
                //drawCircle(right,down,radius); //so we can see the trigger areas

                //now we create an array of collider objects to trigger events from mouse or gaze
                collider_circles.push(new SAT.Circle(the_point, radius));
                var end_ix = collider_circles.length - 1;
                //console.log('collider_circles.length:', i,z);  

                //place centered image
                place_stimuli(right, down, pics[counter], images[counter], counter); 
                counter += 1;
            } //end inner for
        } //end outer for
    }

    //----------------------
    //CALLED ONCE TO LOAD THE STIMULUS LIST BASED ON PAGE NAME 
    //----------------------
    function getStimulus(stimulus) {
        switch (stimulus) {
        case "fish":
            pics = ["cod", "haddock", "halibut", "herring", "lesser.weaver", "mackeral", "monkfish",                     "salmon", "scab"];
            random_order = [0,1,2,3,4,5,6,7,8];
            break;
        case "flags":
            pics = ["cameroon", "malawi", "morocco", "mozambique", "namibia", "rwanda", "senegal",                       "tanzania", "zambia"];
            random_order = [0,1,2,3,4,5,6,7,8];
            break;
        case "mushrooms":
            pics = ["cortinar", "deadly.fibercap", "death.cap", "destroying.angel", "fly.agaric",                         "ivory.funnel", "livid.enteloma", "sulfur.tuft", "yellow.staining"];
            random_order = [0,1,2,3,4,5,6,7,8];    
            break;
        case "viruses":
            pics = ["coronavirus", "filovirus", "hantavirus", "hepatitusvirus", "herpesvirus",                           "mastadenovirus", "rabiesvirus", "rhinovirus", "smallpoxvirus"];
            random_order = [0,1,2,3,4,5,6,7,8];     
            break;
        case "training":
            pics = ["cat", "cow", "elephant", "goat", "hippopotamus", "monkey", "penguin", "sheep",                       "zebra"];
            random_order = [0,1,2,3,4,5,6,7,8];//TODO manually randomize random order     
            break;
        }
        return pics;
    }

    //----------------------
    //CALLED ONCE TO LOAD EACH IMAGE AND SOUND (BY DRAWSTUFF)
    //----------------------
    function place_stimuli(px_right, px_down, img_name, base_image, counter) {
        base_image = new Image();
        base_image.onload = function () {
            context.drawImage(base_image, px_right - (this.width / 2), px_down - (this.height / 2));
        };
        base_image.src = "img/" + page + "/" + img_name + ".png";
        sounds[counter] = new Audio("img/" + page + "/" + img_name + ".mp3");
    }

    //----------------------
    ///CALLED EVERY FEW MS BASED ON setInterval 
    //----------------------
    function update(collider_circles, mouse_point,isAnswer) {
        var currRegion = -1; //reset the current region to null on each update
        var triggered = 0; //reset the trigger to null on each update

        for (var key in collider_circles) //for each collider 
        {
            //is the pointer in it?
            var isColliding = SAT.pointInCircle(mouse_point, collider_circles[key]);
            if (isColliding) //if so
            {
                currRegion = key; //set the current region = the collider number
            }
        }
        if (currRegion > -1){ //& (e.keycode === 17)){ //if the current region is not whitespace
            //document.title = currRegion; //change doc title 
            //would trig sound here
                if(arguments.length === 3 & isAnswer) {  
                //play next sound
                    var answer_key_hit = 1;
                }
                else {
                    var answer_key_hit = '';
                }
            
        } else //if the current region IS whitespace
        {
            //document.title = "?"; //change the title 
        }
        lastRegion = currRegion; //prepare for next update by setting lastRegion = currentRegion
        var row = [participant, condition, block, input, stimulus, Date.now(), mouse_point.x,                            mouse_point.y, parseInt(currRegion), parseInt(window.sound_num), answer_key_hit,                      pics[parseInt(window.sound_num)],pics[parseInt(currRegion)]];
        //console.log(row);
        data.push(row);
    }

    //----------------------
    ///CALLED EVERYTIME A KEY IS PRESSED 
    //----------------------
    function doKeyDown(e) {                
        switch (e.keyCode) {
            case 32:
            //get the region
            update(collider_circles, mouse_point, true); //region logged as an answer
            //trigger the next sound
            window.sound_num = window.sound_num + 1; 
            sounds[window.sound_num].play();
            console.log('window.sound_num:', window.sound_num);
            break;
            case 13:
            //console.log("ENTER KEY PRESSED");	
					  saveData(data,block,condition,"test",input,stimulus,participant);
            
				
           if (block == 0 && input =="mouse")
 						{
 							block = 0;
 							input="gaze";
 						}
 						else {
 							block = block + 1;
 						} //increment the block
            window.location.href = "blockstart.html?participant=" + participant + "&condition=" + condition                + "&block=" + block + "&input=" + input + "&stimulus=" + stimulus;
            break;
        }
    }
}