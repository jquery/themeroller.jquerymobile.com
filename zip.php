<?php
	/**
	 * This does the following:
	 *
	 * - Create a new ZIP file on disk for the requested theme options.
	 * - Remove any old ZIP file.
	 * - Tell the client the public URL to this ZIP file.
	 *
	 * By default, zip files are stored in the "zips/" subdirectory of
	 * the document root (this directory). You can override it using the
	 * THEMEROLLER_ZIPDIR environment variable, in which case you must
	 * take care to serve that publicly from /zips on the same domain.
	 */

	require_once('version.php');
	date_default_timezone_set('America/Los_Angeles');

    $JQM_VERSION = $_POST["ver"];
    $JQUERY_VERSION = $ALL_JQUERY_VERSIONS[ $JQM_VERSION ];

	$theme_name = $_POST["theme_name"];
	$uncompressed = $_POST["file"];

	//minifying CSS file
	$comment_pos = strpos($uncompressed, "\n/* Swatches");
	$comment = substr($uncompressed, 0, $comment_pos);
	$css = substr($uncompressed, $comment_pos, strlen($uncompressed) - $comment_pos);

    $compressed = preg_replace_callback('/(\/\*.*?\*\/|\n|\t)/sim',
        function($matches) {
            return "";
        }, $css);

    // remove all around in ",", ":" and "{"
    $compressed = preg_replace_callback('/\s?(,|{|:){1}\s?/sim',
        function($matches) {
            return $matches[1];
        }, $compressed);

	$compressed = $comment . $compressed;

	$zirDir = getenv('THEMEROLLER_ZIPDIR') ?: ( __DIR__ . '/zips' );
	$zip = new ZipArchive();

	if (!is_dir($zirDir)) {
		mkdir($zirDir);
	}

	$dir = scandir($zirDir);
	$today = date('His', strtotime('now'));

	// Loop to detect if any other zip files are being created at this very second,
	// Also delete any zip files that are older than 15 seconds
	$last_file_num = 0;
	foreach($dir as $file) {
		if($file != '.' && $file != '..' && $file != '.DS_Store') {
			$file_name = explode('.', $file);
			if(isset($file_name[0])) {
				$date = explode('-', $file_name[0]);
				$file_num = $date[4];
				$time = $date[3];

				if(is_numeric($file_num) && $file_num > $last_file_num && $date == $today) {
					$last_file_num = $file_num;
				}
				if(strtotime('now - 15 seconds') >= strtotime($time) || strtotime('now + 15 seconds') <= strtotime($time)) {
					unlink($zirDir . '/' . $file);
				}
			}
		}
	}
	$filename = "jquery-mobile-theme-" .  $today . "-" . $last_file_num . ".zip";
	$filepath = "$zirDir/$filename";
	$url = "./zips/$filename";

	if ($zip->open($filepath, ZIPARCHIVE::CREATE)!==TRUE) {
	    exit("cannot open <$filepath>\n");
	}

	//add files to zip and echo it back to page
	if(preg_match("/1.4/", $JQM_VERSION)) {
		$JQM_ICONS_TAG = "<link rel=\"stylesheet\" href=\"themes/jquery.mobile.icons.min.css\" />";

		$zip->addFromString("themes/jquery.mobile.icons.min.css", file_get_contents("jqm/" . $JQM_VERSION . "/jquery.mobile.icons.min.css"));

		$zip->addFromString("themes/images/ajax-loader.gif", file_get_contents("jqm/" . $JQM_VERSION . "/images/ajax-loader.gif"));

        foreach(glob("jqm/" . $JQM_VERSION . "/images/icons-png/*") as $file) {
        	$name = str_replace("jqm/" . $JQM_VERSION . "/images/icons-png/", "", $file);
        	$zip->addFile($file, "themes/images/icons-png/" . $name);
        }
	} else {
		$JQM_ICONS_TAG = "";

		$zip->addFromString("themes/images/icons-18-white.png", file_get_contents("http://code.jquery.com/mobile/" . $JQM_VERSION . "/images/icons-18-white.png"));
		$zip->addFromString("themes/images/icons-18-black.png", file_get_contents("http://code.jquery.com/mobile/" . $JQM_VERSION . "/images/icons-18-black.png"));
		$zip->addFromString("themes/images/icons-36-white.png", file_get_contents("http://code.jquery.com/mobile/" . $JQM_VERSION . "/images/icons-36-white.png"));
		$zip->addFromString("themes/images/icons-36-black.png", file_get_contents("http://code.jquery.com/mobile/" . $JQM_VERSION . "/images/icons-36-black.png"));

		preg_match("/url\(images\/ajax-load[^\)]*\)/", $uncompressed, $match);
		if(!isset($match[0])) {
		    $match = "ajax-loader.gif";
		} else {
		    $match = $match[0];
		    $match = preg_replace("/url\(/", "", $match);
		    $match = preg_replace("/\)/", "", $match);
		}
		$zip->addFromString("themes/" . $match, file_get_contents("http://code.jquery.com/mobile/" . $JQM_VERSION . "/" . $match));
	}
	$zip->addFromString("themes/" . $theme_name . ".css", $uncompressed);
	$zip->addFromString("themes/" . $theme_name . ".min.css", $compressed);

	if ( $JQM_ICONS_TAG == "" ) {
		$JQM_ICONS_LINK = "";
		$JQM_ICONS_LINK_DOC = "";
	} else {
		$JQM_ICONS_LINK = "\n	" . $JQM_ICONS_TAG;
		$JQM_ICONS_LINK_DOC = "\n<strong>" .
			preg_replace(
				array( '/["]/', "/[<]/", "/[>]/" ),
				array( "&quot;", "&lt;", "&gt;" ),
				$JQM_ICONS_TAG ) .
			"</strong>";
	}

	$zip->addFromString("index.html", include('inc/index.html.inc'));
	$zip->close();
	echo $url;
