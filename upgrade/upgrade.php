<?php
	$dir = preg_grep('/^([^.])/', scandir( "upgrade/css" ));
	
	$VERSION_LIST = array();
	foreach( $dir as $file ) {
		$version = explode( "-", $file );
		$version = $version[0];
		$VERSION_LIST[$version] = $version;
	}
?>