//Complete rewrite of the script! YAY!
//If you have some spare time, then you can turn this script into an API.

//This first bit of code emulates the php GET variable.
//It was taken from: http://ideasandpixels.com/get-post-variables-with-javascript
var $_GET = {};

document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
    function decode(s) {
        return decodeURIComponent(s.split("+").join(" "));
    }

    $_GET[decode(arguments[1])] = decode(arguments[2]);
});
//This variable contains the current list
var currentlist = $_GET["list"];

function onloadList(){
	
	
	//Show the current list on the page
	document.getElementById('workingList').innerHTML = "List " + currentlist;
	
	//This bit of code will detect if the localstorage is empty
	//If localstorage is empty, the script will automatically set default values.
	
	if(Lockr.get("List" + currentlist) == undefined || Lockr.get("List" + currentlist) == ""){
		Lockr.set("List" + currentlist,[]);
	}
	if(Lockr.get("User" + currentlist) == undefined || Lockr.get("User" + currentlist) == ""){
	}
	else{
		editDisplay('Usernameinput', 'none');
		editDisplay('confirmUsernameinput', 'block');
		document.getElementById("PUTUSERNAMEHERE").innerHTML = Lockr.get("User" + currentlist);
	
	}
	//This line will call the 'show' script
	editList("show");
}
////////////////
// Index.html //
////////////////

//The following function is for showing links to the lists on the frontpage.
//It is also meant to set the amount of links on the frontpage.

function ListLinks(action, additionalinfo){
	if (action == "show"){
		
		//The first bit will detect if the settings are undefined and if so, it'll define them
		if(Lockr.get("settings") == undefined || Lockr.get("settings") == ""){
			Lockr.set("settings", [{"name":"amountoflinks","value":4}]);
		}
		
		var amountOfLinks = Lockr.get('settings');
		amountOfLinks = amountOfLinks[0].value;
		for(var i=1; i < amountOfLinks+1; i++){
			document.getElementById("lists").innerHTML += "<li><span class='aeff'><a href='list.html?list=" + i + "'><span data-hover='Edit'>List " + i + "</span></a></span>";
		}
	}
	if(action == "set"){
		var currentSetting = Lockr.get('settings');
		currentSetting[0].value = parseInt(additionalinfo);
		Lockr.set("settings", currentSetting);
	}
}

////////////////////
//Page Maintanance//
////////////////////


//Clear the text fields, please.

function clearTextFields(){
	var elements = document.getElementsByTagName("input");
	for (var ii=0; ii < elements.length; ii++) {
		if (elements[ii].type == "text") {
   			 elements[ii].value = "";
  		}
	}
	document.getElementById("description").innerHTML = "<br><br><br>";
}

///////////////////////////
//The actual list script.//
///////////////////////////

//The following script's purpose is to create a new object
function listEntry(id, productname, priceprefix, price, shop, productURL, img, descr, favourite){
	this.id = id;
	this.productname = productname;
	this.priceprefix = priceprefix;
	this.price = price;
	this.shop = shop;
	this.productURL = productURL;
	this.img = img;
	this.descr = descr;
	this.favourite = favourite;
}

//This script gets all of the factors needed to make a list entry
//Sidenote: the variable img is actually the url to the image.
//Uploading images isn't supported and will likely never be supported. My server has only 17GB of hard drive space (VM)
function editList(action, additionalInfo){
	var currentSavedList = Lockr.get("List" + currentlist);
	if(action == "add"){
		var id = currentSavedList.length;
		var productname = document.getElementById("productname").value;
		var price2 = document.getElementById("price2");
		var priceprefix = price2.options[price2.selectedIndex].value;
		var price = document.getElementById("price").value;
		var shop = document.getElementById("shop").value;
		var productURL = document.getElementById("productURL").value;
		var img = document.getElementById("img").value;
		var descr = document.getElementById("description").innerHTML;
		
		//This script is to determine if the 'favourite' checkbox is checked.
		//In case that that's true, the variable will get replaced by a heart icon.
		//In case that isn't true, it'll be replace by an empty string.
		var favourite = document.getElementById("favourite");
		if(favourite.checked){
			favourite = "&#10084;";		
		}
		else{
			favourite = "";		
		}
		var NewListEntry = new listEntry(id, productname, priceprefix, price, shop, productURL, img, descr, favourite);
		currentSavedList.push(NewListEntry);
		Lockr.set("List" + currentlist, currentSavedList);
		editDisplay('addbox', 'none')
		document.getElementById('edit').disabled = false;
		clearTextFields();
		editList("show");
	}
	
	//This part is for when the user wants to edit an entry
	if (action == "edit") {
		var ioetbc = document.getElementById("ioetbc").value;
		ioetbc = parseInt(ioetbc);
		ioetbc = ioetbc -1;
		//ioetbc = index of entry to be changed
		var valueToEdit = document.getElementById("valueToChange").value;
		valueToEdit = valueToEdit.replace('Edit', '');
		var newValue = "";
		if (valueToEdit == "favourite") {
			if(document.getElementById("favourite1").checked){
				newValue = "&#10084;";
			}
			else{
					newValue = "";
			}
		}
		else{
			newValue = document.getElementById("changeTo").value;
		}
		currentSavedList[ioetbc][valueToEdit] = newValue;
		Lockr.set("List" + currentlist, currentSavedList);
		editDisplay('editbox', 'none')
		document.getElementById('add').disabled = false;
		clearTextFields();
		editList("show");	
	}
	if (action == "import") {
		var newList = prompt("Please paste the list code to ","this section.");
		newList = atob(newList);
		newList = JSON.parse(newList);
		Lockr.set("List" + currentlist, newList);
		editList("show");
	}
	if (action == "export"){
		currentSavedList = JSON.stringify(currentSavedList);
		var decodedlist = btoa(currentSavedList);
		prompt("Copy the list code down here", decodedlist);
	}
	if(action == "flush"){
		var confirmdelete = window.confirm("This will unrecoverably delete your list. Continue?");
		if(confirmdelete){
		Lockr.set("List" + currentlist, []);
		editList("show");
		}
	}
	if(action == "show"){
		var html = "<ul>";
		if (additionalInfo == "view"){
			currentSavedList = $_GET['listcode'];
		}
		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                        for(var i=0;i<currentSavedList.length; i++){
                                var i2 = i+1;
                                html += "<li>";
                                html += "<details>";
                                html += "<summary> ";
                                html +=  i2 + ". " + currentSavedList[i].productname; 
                                html += "</summary>";
                                html += "<hr>Price:<br>" + currentSavedList[i].priceprefix + "&euro;" + currentSavedList[i].price + "<hr>";
                                html += "Shop:<br>" + currentSavedList[i].shop + "<hr>";           
                                html += replaceURLWithHTMLLinks("Link: " + currentSavedList[i].productURL + "<br>");
                                html += "<hr>" + currentSavedList[i].descr + "<hr>";

                                html += currentSavedList[i].favourite + "<br>";


                                html += '<button class="remove" id="' + i  + '" onclick="editList(\'remove\', this.id)">Remove</button>';
                        }
                }
		else{
			for(var i=0;i<currentSavedList.length; i++){
				var i2 = i+1;
				html += "<li>";
				if(additionalInfo != "toVar"){html += "<details>";}
				if(additionalInfo != "toVar"){html += "<summary> ";}
				html +=  i2 + ". " + currentSavedList[i].productname; 
				if(additionalInfo != "toVar"){html += "</summary>";}
				html += "<br>Price: " + currentSavedList[i].priceprefix + "&euro;" + currentSavedList[i].price + " | ";
				html += "Shop: " + currentSavedList[i].shop + "<br>";		
				html += replaceURLWithHTMLLinks("Link: " + currentSavedList[i].productURL + "<br>");
				html += "<hr>" + currentSavedList[i].descr + "<br>";
				if(additionalInfo != "toVar"){html += "<img src='" + currentSavedList[i].img + "' alt='Product Image' style='width:20%;'><br>";}
				if(additionalInfo != "toVar"){html += currentSavedList[i].favourite + "<br>";}
				if(additionalInfo == "" || additionalInfo == undefined){
					
					html += '<button class="remove" id="' + i  + '" onclick="editList(\'remove\', this.id)">&#9842;</button>';
				
				}
				if(additionalInfo != "toVar"){html += "</details>";}
				html += "</li>";
			
			}
		}
		html += "</ul>";
		if(additionalInfo == "toVar"){
			return html;
		}
		document.getElementById("listitems").innerHTML = html; 
		
	}
	if(action == "remove"){
		additionalInfo = parseInt(additionalInfo);
		currentSavedList.splice(additionalInfo, 1);
		Lockr.set("List" + currentlist, currentSavedList);
		editList("show");	
	}
}
//The following function is to detect if the user wanted to change if the item is favourite
function checkForFavouriteEdit(state){
	if (state == "Editfavourite") {
		editDisplay('changeTo', 'none');
		editDisplay('changeFavourite', 'block');
	}
	else{
		editDisplay('changeTo', 'block');
		editDisplay('changeFavourite', 'none');
	}
}

//This function is to simply show and hide an object.
function editDisplay(element, action){
	document.getElementById(element).style.display = action;
}

//The following bit is to convert plain text to hyperlinks. It wasn't written by me.
//Replaces plain URLS with am <a> tag
function replaceURLWithHTMLLinks(text){
    var exp = /(\b(https|http|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(exp,"<span class='aeff'><a href='$1' target='_blank'><span data-hover='Goto link'>$1</span></a></span>"); 
}

//This is some code to show credits.
function credits(){
	head = "<h1>Credits</h1>";
	c = "Base script: http://code-maven.com/todo-in-html-and-javascript<br>";
	c += "Various scripts: http://stackoverflow.com<br>";
	c += "<h2>Style</h2>";
	c += "Buttons: http://www.bestcssbuttongenerator.com/<br>";
	c += "Background: http://uigradients.com<br>";
	c += "Hyperlinks: http://codepen.io/ibrahimjabbari/pen/Hnkcw<br>";
	c = replaceURLWithHTMLLinks(c);
	var myWindow = window.open("", "Credits", "width=500,height=540");
	myWindow.document.write("<link rel='stylesheet' href='style.css'>" + head + c);
}
function changeUsername(username){
	Lockr.set("User" + currentlist, username);
	document.getElementById("PUTUSERNAMEHERE").innerHTML = username;
	editDisplay('Usernameinput', 'none'); 
	editDisplay('confirmUsernameinput', 'block');
}
function shareEmail(){
	
}
//The name says it all, this is used to physically print the list or print it to a file.
function printWithPaper(){
	var UserName = Lockr.get("User" + currentlist);
	var list = editList("show", "toVar");
	alert("Pro tip: you can save the list by selecting 'Print to File'");
	document.body.innerHTML = "<h1>" + UserName + "'s list</h1><br>" + list;
	document.body.style.background = "white";
	window.print();
	location.reload();
	//The alert is because I needed to execute something for some reason before the page would reload.
	alert("Thank you for using YourList!");
	location.reload();
}
