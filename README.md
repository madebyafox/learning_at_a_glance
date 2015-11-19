# learning_at_a_glance
Protoype gaze-contingent learning system


experiment starts with
	1) index.html >> which displays an informed consent, as asks for a participant ID and condition number
									 these are passed through the querystring to the...
	2) fix.html page, which displays a fixation cross, and passes values through the query string to ...
	3) stimulus.html   (this is the bulk of the old index.html) which conditionally chooses which stimulus block and input method to render based on the input query string, and calls passes the appropriate
	parameters to the drawPage js function
	 --> drawPage renders the canvas stimulus, and on ENTER saves/downloads data, and redirects to 
	4)assess.html  (currently just redisplays stimulus) -- TODO: make assessment.  On ENTER INCREMENTS THE BLOCK # and then redirects to 
	3) fix.html ... which redirects to stimulus and starts the next block