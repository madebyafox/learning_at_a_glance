

//----------------------
///CALLED ON ENTER KEY PRESS TO DOWLOAD CSV DATA 
//----------------------
function saveData(data)
{
	var csvContent = "data:text/csv;charset=utf-8,";
	data.forEach(function(infoArray, index){

	   dataString = infoArray.join(",");
	   csvContent += index < data.length ? dataString+ "\n" : dataString;

	});
	var encodedUri = encodeURI(csvContent);
	var link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", "my_data.csv");

	link.click(); // This will download the data file named "my_data.csv".

}


//----------------------
///CALLED MANY PAGES TO PARSE QUERY STRING
//----------------------
function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}