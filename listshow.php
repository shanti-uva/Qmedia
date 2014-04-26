<?php
header('Cache-Control: no-cache, no-store, must-revalidate'); 
header('Expires: Sun, 01 Jul 2005 00:00:00 GMT'); 
header('Pragma: no-cache'); 
require_once('config.php');
			
	$handle="";													// Assume no handle
	$query="SELECT * FROM qshow";								// Query start
	if (isSet($_REQUEST['handle']))	{							// If set
		$handle=$_REQUEST['handle'];							// Get it
		$query.=" WHERE handle = '".$_REQUEST['handle']."'";	// Add handle search
		}
	if (isSet($_REQUEST['email'])) 	 {							// If set
		if ($handle)											// If a handle already
			$query.=" AND email = '".$_REQUEST['email']."'";	// AND email search
		else	
			$query.=" WHERE email = '".$_REQUEST['email']."'";	// WHERE email search
		}		
	if (isSet($_REQUEST['handles']))							// If getting all handles
		$query="SELECT handle FROM qshow";						// Query
	$result=mysql_query($query);								// Query
	if ($result == false) {										// Bad query
		print("-1\n");											// Return error
		exit();													// Quit
		}
	$num=mysql_numrows($result);								// Get num rows
	for ($i=0;$i<$num;$i++) {									// For each row
		if (mysql_result($result,$i,"deleted") != 0)			// If deleted
			continue;											// Skip
		if (isSet($_REQUEST['handles'])) {						// If getting all handles
			print(mysql_result($result,$i,"handle").'|');		// Handle
			continue;											// Skip
			}		
		print(mysql_result($result,$i,"id").'|');				// Id
		print(mysql_result($result,$i,"title").'|');			// Title
		print(mysql_result($result,$i,"handle").'|');			// Handle
		print(mysql_result($result,$i,"email").'|');			// Email
		print(mysql_result($result,$i,"date").'|');				// Date
		print(mysql_result($result,$i,"private").'|e|');		// Private
		}
	mysql_close();												// Close session
?>
	
