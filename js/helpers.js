//----------------------
///CALLED ON ENTER KEY PRESS TO DOWLOAD CSV DATA 
//----------------------
function saveData(data,block,condition,mode,input,stimulus,participant){

  console.log("participant:" + participant);
  console.log("condition "+ condition);
  console.log("block "+ block);
  console.log("input "+ input);
  console.log("stimulus "+ stimulus);

	var csvContent = "data:text/csv;charset=utf-8,";
	data.forEach(function(infoArray, index){

	   dataString = infoArray.join(",");
	   csvContent += index < data.length ? dataString+ "\n" : dataString;

	});
	var encodedUri = encodeURI(csvContent);
	var link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", "block"+block+"_c"+condition+"_"+mode+"_"+input+"_"+stimulus+"_"+participant+".csv");

	link.click(); // This will download the data file

}

//----------------------
///CALLED MANY PAGES TO PARSE QUERY STRING
//----------------------
function getQueryVariable(variable){
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}