<?php
header('Cache-Control: no-cache, no-store, must-revalidate'); 
header('Expires: Sun, 01 Jul 2005 00:00:00 GMT'); 
header('Pragma: no-cache'); 
require_once('config.php');
			
	$title="";													
	$script="";												
	$password="";												
	$private='0';												
	$deleted='0';												

	$handle=$_REQUEST['handle'];								// Get handle
	$email=$_REQUEST['email'];									// Get email
	
	if (isSet($_REQUEST['title'])) 								// If set
		$title=$_REQUEST['title'];								// Get it
	if (isSet($_REQUEST['script'])) 							// If set
		$script=$_REQUEST['script'];							// Get it
	if (isSet($_REQUEST['password'])) 							// If set
		$password=$_REQUEST['password'];						// Get it
	if (isSet($_REQUEST['private'])) 							// If set
		$private=$_REQUEST['private'];							// Get it
	if (isSet($_REQUEST['deleted'])) 							// If set
		$deleted=$_REQUEST['deleted'];							// Get it
			
	$query="SELECT * FROM qshow WHERE handle = '".$handle."'"; 	// Look existing one	
	$result=mysql_query($query);								// Query
	if ($result == false) {										// Bad query
		print("-1\n");											// Return error
		mysql_close();											// Close session
		exit();													// Quit
		}
	if ($password != mysql_result($result,0,"password")) {		// Passwords don't match
		print("-4\n");											// Return error
		mysql_close();											// Close session
		exit();													// Quit
		}
	if (!mysql_numrows($result)) {								// If not found, add it
		$query="INSERT INTO qshow (title, handle, script, email, password, private) VALUES ('";
		$query.=addslashes($title)."','";
		$query.=addslashes($handle)."','";
		$query.=addslashes($script)."','";
		$query.=$email."','";
		$query.=$password."','";
		$query.=$private."')";
		$result=mysql_query($query);							// Add row
		if ($result == false)									// Bad save
			print("-2\n");										// Return error
		else
			print(mysql_insert_id()."\n");						// Return ID of new resource
		}
	else{														// We have one already
		$id=mysql_result($result,0,"id");						// Get id
		if ($id != "") {										// If valid
			$query="UPDATE qshow SET title='".$title."' WHERE id = '".$id."'";
			$result=mysql_query($query);
			$query="UPDATE qshow SET script='".$script."' WHERE id = '".$id."'";
			$result=mysql_query($query);
			$query="UPDATE qshow SET private='".$private."' WHERE id = '".$id."'";
			$result=mysql_query($query);
			$query="UPDATE qshow SET deleted='".$deleted."' WHERE id = '".$id."'";
			$result=mysql_query($query);
			$query="UPDATE qshow SET date='".date("Y-m-d H:i:s")."' WHERE id = '".$id."'";
			$result=mysql_query($query);
			}
			if ($result == false)								// Bad update
				print("-3\n");									// Return error
			else
				print($id."\n");								// Return ID
			}													// End if valid

		mysql_close();											// Close session
?>
	
