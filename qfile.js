///////////////////////////////////////////////////////////////////////////////////////////////
//  QMEDIA FILE SYSTEM
///////////////////////////////////////////////////////////////////////////////////////////////
	
	
	function QmediaFile() 													// CONSTRUCTOR
	{
		qmf=this;																// Point at this
		this.email="bferster@virginia.edu";
		this.show="Demo";
	}
	
	QmediaFile.prototype.Load=function() 									//	LOAD SHOW
	{
		var str="<br/>"
		var butsty=" style='border-radius:10px;color#666;padding-left:6px;padding-right:6px' ";
		str+="If you want to load only shows you have created, type your email address. To load any show, leave it blank. If you want to load a private show, you will need to type in its password. The email is not required.<br>"
		str+="<br/><blockquote><table cellspacing=0 cellpadding=0 style='font-size:11px'>";
		str+="<tr><td><b>Email </b></td><td><input"+butsty+"type='text' id='email' size='20' value='"+this.email+"'/></td></tr>";
		str+="<tr><td><b>Password&nbsp;&nbsp;</b></td><td><input"+butsty+"type='password' id='email' size='20'/></td></tr>";
		str+="</table></blockquote><div style='font-size:12px;text-align:right'><br>";	
		str+="<button"+butsty+"id='logBut'>Login</button>";	
		str+="<button"+butsty+"id='cancelBut'>Cancel</button></div>";	
		this.ShowLightBox("Login",str);
		var _this=this;															// Save context
		
		$("#cancelBut").button().click(function() {								// CANCEL BUTTON
			$("#lightBoxDiv").remove();											// Close
			});
	
		$("#logBut").button().click(function() {								// LOGIN BUTTON
			var trsty=" style='height:20px;cursor:pointer' onMouseOver='this.style.backgroundColor=\"#acc3db\"' ";
			trsty+="onMouseOut='this.style.backgroundColor=\"#f8f8f8\"' onclick='qmf.LoadFile(this.id)'";
			_this.List(function(files){											// Get list of files
				var vv;
				var v=files.split("|e|");										// Split into files
				$("#lightBoxDiv").remove();										// Close old onw
					str="<br>Choose show to load from the list below.<br>"
					str+="<br><div style='width:100%;max-height400px;overflow-y:auto'>";
					str+="<table style='font-size:12px;width:100%'>";
					str+="<tr><td><b>Name</b></td><td ><b>Title </b></td><td align=right><b>&nbsp;Date&nbsp;&&nbsp;time</b></td></tr>";
					str+="<tr><td colspan='3'><hr></td></tr>";
				for (var i=0;i<v.length-1;++i) {								// For each file
					var vv=v[i].split("|");										// Split into fields
					str+="<tr id='qmf"+vv[0]+"' "+trsty+"><td>"+vv[2]+"&nbsp;&nbsp;</td><td>"+vv[1]+"</td><td align=right>"+vv[4].substr(5,11)+"</td></tr>";
					}
				str+="</table></div><div style='font-size:12px;text-align:right'><br>";	
				str+=" <button"+butsty+"id='cancelBut'>Cancel</button></div>";	
				_this.ShowLightBox("Load Qmedia show",str);
				
				$("#cancelBut").button().click(function() {						// CANCEL BUTTON
					$("#lightBoxDiv").remove();									// Close
					});
				
				
				$("#loadBut").button().click(function() {						// LOAD BUTTON
					$("#lightBoxDiv").remove();									// Close
					});
	
				},$("#email").val());
			});
	}
		
	QmediaFile.prototype.Save=function(ops) 								//	SAVE SHOW
	{
	}
	
	QmediaFile.prototype.LoadFile=function(id) 								//	LOAD A FILE
	{
		$("#lightBoxDiv").remove();											// Close
		var url="//qmediaplayer.com/loadshow.php";							// Base file
		url+="?id="+id.substr(3);											// Add to query line
		$.ajax({ url:url, dataType:'jsonp', complete:function() { Sound('ding'); } });	// Get data and pass to callback
	}	
		
	QmediaFile.prototype.List=function(callback, email, handle) 			//	LIST SHOW
	{
		callback("demo|Bill Clinton's TED talk|demo|bferster@virginia.edu|2014-04-25 16:44:13|0|e|5|Test2|Demo2|bferster@virginia.edu|2014-04-28 16:09:50|0|e|6|Clinton talk|test|bferster@virginia.edu|2014-04-25 12:08:50|0|e|7|A sample show|test2|bferster@virginia3.edu|2014-04-29 14:12:45|0|e|");
		return;
		
		var url="//listshow.php";												// Base file
		if (email && handle)													// If both
			url+="?email="+email+"&handle="+handle;								// Add to query line
		else if (email)															// If email
			url+="?email="+email;												// Add to query line
		else if (handle)														// If handle
			url+="?handle="+handle;												// Add to query line
		$.ajax({ url:url, dataType:'text', done:callback });					// Get data and pass to callback
	}
	
	QmediaFile.prototype.ShowLightBox=function(title, content)				// LIGHTBOX
	{
		var str="<div id='lightBoxDiv' style='position:fixed;width:100%;height:100%;";	
		str+="background:url(images/overlay.png) repeat;top:0px;left:0px';</div>";
		$("body").append(str);														
		var	width=500;
		var x=$("#lightBoxDiv").width()/2-250;
		var y=$("#lightBoxDiv").height()/2-300;
		
		str="<div id='lightBoxIntDiv' style='position:absolute;padding:16px;width:400px;font-size:12px";
		str+=";border-radius:12px;z-index:2003;"
		str+="border:1px solid; left:"+x+"px;top:"+y+"px;background-color:#f8f8f8'>";
		str+="<img src='images/qlogo32.png' style='vertical-align:-10px'/>&nbsp;&nbsp;";								
		str+="<span style='font-size:18px;text-shadow:1px 1px #ccc'><b>"+title+"</b></span>";
		str+="<div id='lightContentDiv'>"+content+"</div>";					
		$("#lightBoxDiv").append(str);	
		$("#lightBoxDiv").css("z-index",2500);						
	}