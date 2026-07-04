<?php

// jQuery Mobile => jQuery Core
$ALL_JQUERY_VERSIONS = array(
    "1.0.1" => "1.6.4",
	"1.1.2" => "1.7.2",
	"1.2.1" => "1.8.3",
	"1.3.2" => "1.9.1",
	"1.4.5" => "1.11.1"
);

$VERSION_LIST = array_keys( $ALL_JQUERY_VERSIONS );
$VERSION_LIST = array_reverse( $VERSION_LIST );

$JQM_VERSION = array_key_last( $ALL_JQUERY_VERSIONS );
