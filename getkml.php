<?php
header('Cache-Control: no-cache, no-store, must-revalidate'); 
header('Expires: Sun, 01 Jul 2005 00:00:00 GMT'); 
header('Pragma: no-cache'); 
require_once('config.php');
			
	$id=addslashes($_REQUEST['id']);							// Get id
	$query="SELECT * FROM qdata WHERE id = '$id'";				// Make query
	$result=mysql_query($query);								// Run query
	if ($result == false)										// Error
		print("Error");											// Show error
	else
		print(mysql_result($result,0,"data"));					// Print content of data field
	mysql_close();												// Close
?>
	
