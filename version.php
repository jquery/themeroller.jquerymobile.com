<?php

function versionCompare( $version1, $version2 ) {
    $empty = array( null, null, null, null, null );
    $ver1 = array_replace( $empty, preg_split( "/\.|-/", $version1 ) );
    $ver2 = array_replace( $empty, preg_split( "/\.|-/", $version2 ) );
    
    if ( $ver1[0] > $ver2[0] ) {
        return true;
    } else if ( $ver1[0] < $ver2[0] ) {
        return false;
    } else {
        //tie
        if ( $ver1[1] > $ver2[1] ) {
            return true;
        } else if ( $ver1[1] < $ver2[1] ) {
            return false;
        } else {
            //tie
            if ( $ver1[2] > $ver2[2] ) {
                return true;
            } else if ( $ver1[2] < $ver2[2] ) {
                return false;
            } else {
                //tie
                $types = array( "alpha" => 0, "beta" => 1, "rc" => 2 );
                $ver1[3] = $types[ $ver1[3] ? $ver1[3] : "alpha" ];
                $ver2[3] = $types[ $ver2[3] ? $ver2[3] : "alpha" ];
                if ( $ver1[3] > $ver2[3] ) {
                    return true;
                } else if ( $ver1[3] < $ver2[3] ) {
                    return false;
                } else {
                    //tie
                    if ( $ver1[4] >= $ver2[4] ) {
                        return true;
                    } else if ( $ver1[4] < $ver2[4] ) {
                        return false;
                    }
                }
            }
        }
    }
}

$VERSION_LIST = preg_grep('/^([^.])/', scandir( "jqm" ));

$VERSION_LIST = array_reverse( $VERSION_LIST );

$JQM_VERSION = "";

foreach( $VERSION_LIST as $VERSION ) {
    if ( versionCompare( $VERSION, $JQM_VERSION ) ) {
        $JQM_VERSION = $VERSION;
    }
}

$ALL_JQUERY_VERSIONS = array(
    "1.0.1" => "1.6.4",
	"1.1.2" => "1.7.2",
	"1.2.1" => "1.8.3",
	"1.3.2" => "1.9.1",
	"1.4.1" => "1.10.2"
);

?>
