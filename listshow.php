<?php
header('Cache-Control: no-cache, no-store, must-revalidate'); 
header('Expires: Sun, 01 Jul 2005 00:00:00 GMT'); 
header('Pragma: no-cache'); 
require_once('config.php');
			
	$query="SELECT * FROM qshow";								// Query start
	if (isSet($_REQUEST['email'])) 		 						// If set
		$query.=" WHERE email = '".addslashes($_REQUEST['email'])."' ORDER by date DESC";	// WHERE email search
	$result=mysql_query($query);								// Query
	if ($result == false) {										// Bad query
		print("-1\n");											// Return error
		exit();													// Quit
		}
	$num=mysql_numrows($result);								// Get num rows
	print("qmfListFiles([\n");									// Function
	for ($i=0;$i<$num;$i++) {									// For each row
		if (mysql_result($result,$i,"deleted") != 0)			// If deleted
			continue;											// Skip
		print("{\"id\":\"".mysql_result($result,$i,"id")."\",");			// Id
		print("\"title\":\"".mysql_result($result,$i,"title")."\",");		// Title
		print("\"email\":\"".mysql_result($result,$i,"email")."\",");		// Title
		print("\"date\":\"".mysql_result($result,$i,"date")."\",");			// Date
		print("\"private\":\"".mysql_result($result,$i,"private")."\"}");	// Private
		if ($i != $num-1)	print(",\n");						// Comma
		}		
	print("\n])");												// Close function
	mysql_close();												// Close session
?>
	
