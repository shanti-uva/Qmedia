<?php
header('Cache-Control: no-cache, no-store, must-revalidate'); 
header('Expires: Sun, 01 Jul 2005 00:00:00 GMT'); 
header('Pragma: no-cache'); 
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Max-Age: 1000');
require_once('config.php');
			
	$password="";												
	$show="";											
	$email="";												
	$event="";	
	
	$email=$_REQUEST['email'];									// Get email
	$password=$_REQUEST['password'];							// Get password
	$show=$_REQUEST['show'];									// Get shownum
	
	if (isSet($_REQUEST['event'])) 								// If set
		$event=$_REQUEST['event'];								// Get it
										
	$query="SELECT * FROM qusers WHERE email = '".$email."' AND showNum = '".$show."'";	// Look for existing one
	
	$result=mysql_query($query);								// Query
	if ($result == false) {										// Bad query
		print(-1);												// Show error 
		mysql_close();											// Close session
		exit();													// Quit
		}
	if (!mysql_numrows($result)) {								// If not found, add it
		$query="INSERT INTO qusers (email, password, showNum, events ) VALUES ('";
		$query.=addEscapes($email)."','";						// Email
		$query.=addEscapes($password)."','";					// Password
		$query.=addEscapes($show)."','";						// Password
		$query.=addEscapes("Created new user account\n")."')";	// Event
		$result=mysql_query($query);							// Add row
		if ($result == false)									// Bad save
			print("-2");										// Show error 
		else
			print("new:".mysql_insert_id()."\n");				// Return ID of new user
		}
	else{														// We have one already
		$oldpass=mysql_result($result,0,"password");			// Get old password		
		if ($oldpass && ($password != $oldpass)) {				// Passwords don't match
			print($show."----".mysql_result($result,0,"show"));										// Show error 
			mysql_close();										// Close session
			exit();												// Quit
			}
		$id=mysql_result($result,0,"id");						// Get id
		if ($id != "") {										// If valid
			$query="UPDATE qusers SET events = CONCAT(events, '$event') WHERE id = '".$id."'";
			$result=mysql_query($query);						// Add to field
			}
		if ($result == false)									// Bad update
			print("-4");										// Show error 
		else
			print("exist:".$id);								// Show id 
			}													// End if valid
		mysql_close();											// Close session

	
	function addEscapes($str)									// ESCAPE ENTRIES
	{
		if (!$str)												// If nothing
			return $str;										// Quit
		$str=mysql_real_escape_string($str);					// Add slashes
		$str=str_replace("\r","",$str);							// No crs
		return $str;
	}

?>
	
