<?php
header('Cache-Control: no-cache, no-store, must-revalidate'); 
header('Expires: Sun, 01 Jul 2005 00:00:00 GMT'); 
header('Pragma: no-cache'); 
require_once('config.php');
	
	$email=addEscapes(strtolower($_REQUEST['email']));			// Get email
	$show=addEscapes($_REQUEST['show']);						// Get show
										
	$query="SELECT * FROM qusers WHERE email = '".$email."' AND showNum = '".$show."'";	// Look for data
	$result=mysql_query($query);								// Run query
	if (mysql_numrows($result)) {								// If found,
		$s=mysql_result($result,$i,"events");					// Get events field
		print("LoadUserData({ \"data\":\".$s\"})");
		}
	mysql_close();												// Close
	
	
	function addEscapes($str)									// ESCAPE ENTRIES
	{
		if (!$str)												// If nothing
			return $str;										// Quit
		$str=addslashes($str);									// Add slashes
		$str=str_replace("\r","",$str);							// No crs
		return $str;
	}
	
?>