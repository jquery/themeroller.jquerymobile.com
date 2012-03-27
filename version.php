<?php

	$JQM_VERSION = "1.0.1";
	$JQUERY_VERSION = "1.6.4";
	
	$ALL_VERSIONS = array();
	$dir = preg_grep('/^([^.])/', scandir( "jqm" ));

	foreach ( $dir as $file ) {
		if ( floatval($file) > floatval($JQM_VERSION) ) {
			$JQM_VERSION = $file;
		}
		$ALL_VERSIONS[$file] = $file;
	}	
?>