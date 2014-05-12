///////////////////////////////////////////////////////////////////////////////////////////////
//  QMEDIA FILE SYSTEM
///////////////////////////////////////////////////////////////////////////////////////////////
	
	
	function QmediaFile() 													// CONSTRUCTOR
	{
		qmf=this;																// Point to obj
		this.host="//qmediaplayer.com/";										// Get host
		this.email=this.GetCookie("email");										// Get email from cookie
		this.curFile="";														// Current file
		this.password=this.GetCookie("password");								// Password
		this.butsty=" style='border-radius:10px;color#666;padding-left:6px;padding-right:6px' ";	// Button styling
		this.deleting=false;													// Not deleting
	}
	
	QmediaFile.prototype.Load=function() 									//	LOAD FILE
	{
		var str="<br/>"
		str+="If you want to load only projects you have created, type your email address. To load any project, leave it blank. If you want to load a private project, you will need to type in its password. The email is not required.<br>"
		str+="<br/><blockquote><table cellspacing=0 cellpadding=0 style='font-size:11px'>";
		str+="<tr><td><b>Email</b></td><td><input"+this.butsty+"type='text' id='email' size='20' value='"+this.email+"'/></td></tr>";
		str+="<tr><td><b>Password&nbsp;&nbsp;</b></td><td><input"+this.butsty+"type='password' id='password' size='20' value='"+this.password+"'/></td></tr>";
		str+="</table></blockquote><div style='font-size:12px;text-align:right'><br>";	
		str+="<button"+this.butsty+"id='logBut'>Login</button>";	
		str+="<button"+this.butsty+"id='cancelBut'>Cancel</button></div>";	
		this.ShowLightBox("Login",str);
		var _this=this;															// Save context
		
		$("#cancelBut").button().click(function() {								// CANCEL BUTTON
			$("#lightBoxDiv").remove();											// Close
			});
	
		$("#logBut").button().click(function() {								// LOGIN BUTTON
			_this.ListFiles();													// Get list of files
			});
	}	

	QmediaFile.prototype.Delete=function(undelete) 							//	DELETE FILE
	{
		var str="<br/>"
		str+="Type your email address and password.<br>"
		str+="<br/><blockquote><table cellspacing=0 cellpadding=0 style='font-size:11px'>";
		str+="<tr><td><b>Email</b></td><td><input"+this.butsty+"type='text' id='email' size='20' value='"+this.email+"'/></td></tr>";
		str+="<tr><td><b>Password&nbsp;&nbsp;</b></td><td><input"+this.butsty+"type='password' id='password' size='20' value='"+this.password+"'/></td></tr>";
		str+="</table></blockquote><div style='font-size:12px;text-align:right'><br>";	
		str+="<button"+this.butsty+"id='logBut'>Login</button>";	
		str+="<button"+this.butsty+"id='cancelBut'>Cancel</button></div>";	
		this.ShowLightBox("Login",str);
		var _this=this;															// Save context
		
		$("#cancelBut").button().click(function() {								// CANCEL BUTTON
			$("#lightBoxDiv").remove();											// Close
			});
	
		$("#logBut").button().click(function() {								// LOGIN BUTTON
			_this.ListFiles( undelete ? "undelete" : "delete"	);				// Get list of files
			});
	}	

	QmediaFile.prototype.Save=function(saveAs) 								//	SAVE FILE TO DB
	{
		var str="<br/>"
		if (saveAs)																// If save as...
			curShow=this.curFile="";											// Force a new file to be made
		str+="Type your email address. To load any project. Type in a password to protect it. Set the private checkbox if you want to make the project private only to you. <br>"
		str+="<br/><blockquote><table cellspacing=0 cellpadding=0 style='font-size:11px'>";
		str+="<tr><td><b>Email</b><span style='color:#990000'> *</span></td><td><input"+this.butsty+"type='text' id='email' size='20' value='"+this.email+"'/></td></tr>";
		str+="<tr><td><b>Password</b><span style='color:#990000'> *</span>&nbsp;&nbsp;</b></td><td><input"+this.butsty+"type='password' id='password' size='20' value='"+this.password+"'/></td></tr>";
		str+="<tr><td><b>Private?&nbsp;&nbsp;</b></td><td><input"+this.butsty+"type='checkbox' id='private'/></td></tr>";
		str+="</table></blockquote><div style='font-size:12px;text-align:right'><br>";	
		str+="<button"+this.butsty+"id='saveBut'>Save</button>";	
		str+="<button"+this.butsty+"id='cancelBut'>Cancel</button></div>";	
		this.ShowLightBox("Save project",str);
		var _this=this;															// Save context
		
		$("#saveBut").button().click(function() {								// SAVE BUTTON
			var dat={};
			_this.password=$("#password").val();								// Get current password
			_this.email=$("#email").val();										// Get current email
			var pri= $("#private").prop("checked") ? 1 : 0						// Get private
			
			if (!_this.password && !_this.email) 								// Missing both
				 return _this.LightBoxAlert("Need email and password");			// Quit with alert
			else if (!_this.password) 											// Missing password
				 return _this.LightBoxAlert("Need password");					// Quit with alert
			else if (!_this.email) 												// Missing email
				 return _this.LightBoxAlert("Need email");						// Quit with alert

			_this.SetCookie("password",_this.password,7);						// Save cookie
			_this.SetCookie("email",_this.email,7);								// Save cookie
			$("#lightBoxDiv").remove();											// Close
			var url=_this.host+"saveshow.php";									// Base file
			dat["id"]=curShow;													// Add id
			dat["email"]=_this.email;											// Add email
			dat["password"]=_this.password;										// Add password
			dat["private"]=pri;													// Add private
			dat["script"]="LoadShow("+JSON.stringify(curJson,null,'\t')+")";	// Add jsonp-wrapped script
			if (curJson.title)													// If a title	
				dat["title"]=AddEscapes(curJson.title);							// Add title
			trace(dat)
			$.ajax({ url:url,dataType:'text',type:"POST",crossDomain:true,data:dat,  // Post data
				success:function(d) { 			
					if (d == -1) 												// Error
				 		AlertBox("Error","Sorry, there was an error loading that project.(1)");		
					else if (d == -2) 											// Error
				 		AlertBox("Error","Sorry, there was an error saving that project. (2)");		
					else if (d == -3) 											// Error
				 		AlertBox("Wrong password","Sorry, the password for this project does not match the one you supplied.");	
				 	else if (d == -4) 											// Error
				 		AlertBox("Error","Sorry, there was an error updating that project. (4)");		
				 	else if (!isNaN(d)){										// Success if a number
				 		curShow=this.curFile=d;									// Set current file
						Sound("ding");											// Ding
						Draw();												// Redraw menu
						}
					},
				error:function(xhr,status,error) { trace(error) },				// Show error
				});		
			});
	
		$("#cancelBut").button().click(function() {								// CANCEL BUTTON
			$("#lightBoxDiv").remove();											// Close
			});
	}
	
	QmediaFile.prototype.LoadFile=function(id) 								//	LOAD A FILE FROM DB
	{
		id=id.substr(3);														// Strip off prefix
		$("#lightBoxDiv").remove();												// Close
		var url=this.host+"loadshow.php";										// Base file
		url+="?id="+id;															// Add id
		if (this.password)														// If a password spec'd
			url+="&password="+this.password;									// Add to query line
		this.curFile=id;														// Set as current file
		$.ajax({ url:url, dataType:'jsonp'});									// Get data and pass to LoadProject() in Edit
	}	
		
	QmediaFile.prototype.DeleteFile=function(id, status) 					//	FLAG A FILE AS  DELETED/ UN-DELETED IN DB
	{
		var dat={};
		id=id.substr(3);														// Strip off prefix
		$("#lightBoxDiv").remove();												// Close
		var url=this.host+"saveshow.php";										// Base file
		dat["id"]=id;															// Add id
		dat["password"]=this.password;											// Add password
		dat["deleted"]=status;													// Delete or undelete (1=delete, 0=undelete)
		$.ajax({ url:url,dataType:'text',type:"POST",crossDomain:true,data:dat, // Post data
				success:function(d) { 			
				if (d == -3) 	AlertBox("Wrong password","Sorry, the password for this project does not match the one you supplied.");	
				else			Sound("ding");
				}
		});																		// Get data and pass to LoadProject()
	}	

	QmediaFile.prototype.ListFiles=function(deleting) 						//	LIST PROJECTS IN DB
	{
		this.password=$("#password").val();										// Get current password
		this.email=$("#email").val();											// Get current email
		if (deleting) {
			if (!this.password && !this.email) 									// Missing both
				 return this.LightBoxAlert("Need email and password");			// Quit with alert
			else if (!this.password) 											// Missing password
				 return this.LightBoxAlert("Need password");					// Quit with alert
			else if (!this.email) 												// Missing email
				 return this.LightBoxAlert("Need email");						// Quit with alert
			}
		this.SetCookie("password",this.password,7);								// Save cookie
		this.SetCookie("email",this.email,7);									// Save cookie
		this.deleting=deleting;													// Deleting status
		var url=this.host+"listshow.php";										// Base file
		if (this.email)															// If email
			url+="?email="+this.email+"&deleted=";								// Add email and deleted to query line
		else																	// Just deleted
			url+="?deleted=";													// Add to query line
		
		url+=(deleting == "undelete") ? 1 : 0									// Add deleted status
		$.ajax({ url:url, dataType:'jsonp', complete:function() { Sound('click'); } });	// Get data and pass qmfListFiles()
	}
	
	function qmfListFiles(files)											// CALLBACK TO List()
	{
		var trsty=" style='height:20px;cursor:pointer' onMouseOver='this.style.backgroundColor=\"#dee7f1\"' ";
		trsty+="onMouseOut='this.style.backgroundColor=\"#f8f8f8\"' onclick='";
		if (qmf.deleting == "delete")		 trsty+="qmf.DeleteFile(this.id,1)'";	// Delete
		else if (qmf.deleting == "undelete") trsty+="qmf.DeleteFile(this.id,0)'";	// Undelete
		else								 trsty+="qmf.LoadFile(this.id)'";		// Load
		qmf.password=$("#password").val();										// Get current password
		qmf.SetCookie("password",qmf.password,7);								// Save cookie
		qmf.email=$("#email").val();											// Get current email
		qmf.SetCookie("email",qmf.email,7);										// Save cookie
		$("#lightBoxDiv").remove();												// Close old one
		str="<br>Choose project from the list below.<br>"
		str+="<br><div style='width:100%;max-height:300px;overflow-y:auto'>";
		str+="<table style='font-size:12px;width:100%;padding:0px;border-collapse:collapse;'>";
		str+="<tr></td><td><b>Title </b></td><td><b>Date&nbsp;&&nbsp;time</b></td><td><b>&nbsp;&nbsp;&nbspId</b></tr>";
		str+="<tr><td colspan='3'><hr></td></tr>";
		for (var i=0;i<files.length;++i) 										// For each file
			str+="<tr id='qmf"+files[i].id+"' "+trsty+"><td>"+files[i].title+"</td><td>"+files[i].date.substr(5,11)+"</td><td align=right>"+files[i].id+"</td></tr>";
		str+="</table></div><div style='font-size:12px;text-align:right'><br>";	
		str+=" <button"+qmf.butsty+"id='cancelBut'>Cancel</button></div>";	
		
		if (qmf.deleting)														// If deleting
			qmf.ShowLightBox("Delete a project",str);							// Show lightbox
		else																	// Loading
			qmf.ShowLightBox("Load a project",str);								// Show lightbox
		this.deleting=false;													// Done deleting
		
		
		$("#cancelBut").button().click(function() {								// CANCEL BUTTON
			$("#lightBoxDiv").remove();											// Close
			});
						
		$("#loadBut").button().click(function() {								// LOAD BUTTON
			$("#lightBoxDiv").remove();											// Close
			});
	}

///////////////////////////////////////////////////////////////////////////////////////////////
//  HELPERS
///////////////////////////////////////////////////////////////////////////////////////////////

	QmediaFile.prototype.SetCookie=function(cname, cvalue, exdays)			// SET COOKIE
	{
		var d=new Date();
		d.setTime(d.getTime()+(exdays*24*60*60*1000));
		var expires = "expires="+d.toGMTString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
	}
	
	QmediaFile.prototype.GetCookie=function(cname) {						// GET COOKIE
		var name=cname+"=",c;
		var ca=document.cookie.split(';');
		for (var i=0;i<ca.length;i++)  {
		  c=ca[i].trim();
		  if (c.indexOf(name) == 0) 
		  	return c.substring(name.length,c.length);
		  }
		return "";
	}

	QmediaFile.prototype.ShowLightBox=function(title, content)				// LIGHTBOX
	{
		var str="<div id='lightBoxDiv' style='position:fixed;width:100%;height:100%;";	
		str+="background:url(images/overlay.png) repeat;top:0px;left:0px';</div>";
		$("body").append(str);														
		var	width=500;
		var x=$("#lightBoxDiv").width()/2-250;
		var y=$("#lightBoxDiv").height()/2-200;
		
		str="<div id='lightBoxIntDiv' class='unselectable' style='position:absolute;padding:16px;width:400px;font-size:12px";
		str+=";border-radius:12px;z-index:2003;"
		str+="border:1px solid; left:"+x+"px;top:"+y+"px;background-color:#f8f8f8'>";
		str+="<img src='images/qlogo32.png' style='vertical-align:-10px'/>&nbsp;&nbsp;";								
		str+="<span id='lightBoxTitle' style='font-size:18px;text-shadow:1px 1px #ccc'><b>"+title+"</b></span>";
		str+="<div id='lightContentDiv'>"+content+"</div>";					
		$("#lightBoxDiv").append(str);	
		$("#lightBoxDiv").css("z-index",2500);						
	}
	
	QmediaFile.prototype.LightBoxAlert=function(msg) 						//	SHOW LIGHTBOX ALERT
	{
		Sound("delete");														// Delete sound
		$("#lightBoxTitle").html("<span style='color:#990000'>"+msg+"</span>");	// Put new
	}
	
	function Sound(sound, mode)												// PLAY SOUND
	{	
		var snd=new Audio();
		if (!snd.canPlayType("audio/mpeg"))
			snd=new Audio(sound+".ogg");
		else	
			snd=new Audio(sound+".mp3");
		if (mode != "init")
			snd.play();
	}

	function AlertBox(title, content)										// ALERT BOX
	{
		$("#alertBoxDiv").remove();												// Remove any old ones
		Sound("delete");														// Delete sound
		$("body").append("<div class='unselectable' id='alertBoxDiv'></div>");														
		var str="<p><img src='images/qlogo32.png' style='vertical-align:-10px'/>&nbsp;&nbsp;";								
		str+="<span style='font-size:18px;text-shadow:1px 1px #ccc;color:#990000'><b>"+title+"</b></span></p>";
		str+="<div style='font-size:14px;margin:16px'>"+content+"</div>";
		$("#alertBoxDiv").append(str);	
		$("#alertBoxDiv").dialog({ width:400, buttons:{"OK": function() { $(this).remove(); }}});	
		$(".ui-dialog-titlebar").hide();
		$(".ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix").css("border","none");
		$(".ui-dialog").css({"border-radius":"14px", "box-shadow":"4px 4px 8px #ccc"});
  		$(".ui-button").css({"border-radius":"30px","outline":"none"});
	}

	function ConfirmBox(content, callback)									// COMFIRM BOX
	{
		Sound("delete");														// Delete sound
		$("#alertBoxDiv").remove();												// Remove any old ones
		$("body").append("<div class='unselectable' id='alertBoxDiv'></div>");														
		var str="<p><img src='images/qlogo32.png' style='vertical-align:-10px'/>&nbsp;&nbsp;";								
		str+="<span style='font-size:18px;text-shadow:1px 1px #ccc;color:#990000'><b>Are you sure?</b></span><p>";
		str+="<div style='font-size:14px;margin:14px'>"+content+"</div>";
		$("#alertBoxDiv").append(str);	
		$("#alertBoxDiv").dialog({ width:400, buttons: {
					            	"Yes": function() { $(this).remove(); callback() },
					            	"No":  function() { $(this).remove(); }
									}});	
		$(".ui-dialog-titlebar").hide();
		$(".ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix").css("border","none");
		$(".ui-dialog").css({"border-radius":"14px", "box-shadow":"4px 4px 8px #ccc"});
 		$(".ui-button").css({"border-radius":"30px","outline":"none"});
 	}

	function GetTextBox(title, content, def, callback)					// GET TEXT LINE BOX
	{
		Sound("click");														// Ding sound
		$("#alertBoxDiv").remove();											// Remove any old ones
		$("body").append("<div class='unselectable' id='alertBoxDiv'></div>");														
		var str="<p><img src='images/qlogo32.png' style='vertical-align:-10px'/>&nbsp;&nbsp;";								
		str+="<span style='font-size:18px;text-shadow:1px 1px #ccc;color:#990000'><b>"+title+"</b></span><p>";
		str+="<div style='font-size:14px;margin:14px'>"+content;
		str+="<p><input class='is' type='text' id='gtBoxTt' value='"+def+"'></p></div>";
		$("#alertBoxDiv").append(str);	
		$("#alertBoxDiv").dialog({ width:400, buttons: {
					            	"OK": 		function() { callback($("#gtBoxTt").val()); $(this).remove(); },
					            	"Cancel":  	function() { $(this).remove(); }
									}});	
		$(".ui-dialog-titlebar").hide();
		$(".ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix").css("border","none");
		$(".ui-dialog").css({"border-radius":"14px", "box-shadow":"4px 4px 8px #ccc"});
 		$(".ui-button").css({"border-radius":"30px","outline":"none"});
 	}

	function AddEscapes(str)												// ESCAPE TEXT STRING
	{
		if (str) {																// If a string
			str=""+str;															// Force as string
			str=str.replace(/"/g,"\\\"");										// " to \"
			str=str.replace(/'/g,"\\\'");										// ' to \'
			}
		return str;																// Return escaped string
	}
	
	function trace(msg, p1, p2, p3, p4)										// CONSOLE 
	{
		if (p4 != undefined)
			console.log(msg,p1,p2,p3,p4);
		else if (p3 != undefined)
			console.log(msg,p1,p2,p3);
		else if (p2 != undefined)
			console.log(msg,p1,p2);
		else if (p1 != undefined)
			console.log(msg,p1);
		else
			console.log(msg);
	}
