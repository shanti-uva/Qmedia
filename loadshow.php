<?php
header('Cache-Control: no-cache, no-store, must-revalidate'); 
header('Expires: Sun, 01 Jul 2005 00:00:00 GMT'); 
header('Pragma: no-cache'); 
require_once('config.php');
	
	$id=$_REQUEST['id'];
	$password=$_REQUEST['password'];
	$query="SELECT * FROM qshow WHERE id = '$id'";
	$result=mysql_query($query);
	if (($result == false) || (!mysql_numrows($result)))
			print("LoadShow({ \"qmfmsg\":\"error\"})");
	else{
		if (mysql_result($result,0,"private") && (mysql_result($result,0,"password") != $password))
			print("LoadShow({ \"qmfmsg\":\"private\"})");
		else	
			print(mysql_result($result,0,"script"));
		}
	mysql_close();
?>