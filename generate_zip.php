<?php
	require_once('version.php');
	date_default_timezone_set('America/Los_Angeles');

	$theme_name = $_POST["theme_name"];
	$uncompressed = $_POST["file"];
	
	//minifying CSS file
	$comment_pos = strpos($uncompressed, "\n/* Swatches");
	$comment = substr($uncompressed, 0, $comment_pos);
	$css = substr($uncompressed, $comment_pos, strlen($uncompressed) - $comment_pos);
	
    $compressed = preg_replace_callback('/(\/\*.*?\*\/|\n|\t)/sim',
        create_function(
            '$matches',
            'return "";'
        ), $css);

    // remove all around in ",", ":" and "{"
    $compressed = preg_replace_callback('/\s?(,|{|:){1}\s?/sim',
        create_function(
            '$matches',
            'return $matches[1];'
        ), $compressed);

	$compressed = $comment . $compressed;
	
	$zip = new ZipArchive();

	$dir = scandir('generated_zips');
	$today = date('His', strtotime('now'));
	
	//Loop to detect if any other zips are being created at this very second,
	//Also deletes zip that are older than 15 seconds
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
					unlink('generated_zips/' . $file);
				}
			}
		}
	}
	$filename = "./generated_zips/jquery-mobile-theme-" .  $today . "-" . $last_file_num . ".zip";

	if ($zip->open($filename, ZIPARCHIVE::CREATE)!==TRUE) {
	    exit("cannot open <$filename>\n");
	}
	
	/*
	//gzipped version of jquery.mobile.min.css decided unneccessary for now
	$gz = gzopen($filename . ".gz", "w");
	gzwrite($gz, $compressed);
	gzclose($gz);
	
	$zip->addFile($filename . ".gz", "themes/jquery.mobile.min.css.gz");
	*/
	
	//add files to zip and echo it back to page
	$zip->addFromString("themes/images/icons-18-white.png", file_get_contents("http://code.jquery.com/mobile/latest/images/icons-18-white.png"));
	$zip->addFromString("themes/images/icons-18-black.png", file_get_contents("http://code.jquery.com/mobile/latest/images/icons-18-black.png"));
	$zip->addFromString("themes/images/icons-36-white.png", file_get_contents("http://code.jquery.com/mobile/latest/images/icons-36-white.png"));
	$zip->addFromString("themes/images/icons-36-black.png", file_get_contents("http://code.jquery.com/mobile/latest/images/icons-36-black.png"));
	$zip->addFromString("themes/images/ajax-loader.png", file_get_contents("http://code.jquery.com/mobile/latest/images/ajax-loader.png"));
	$zip->addFromString("themes/" . $theme_name . ".css", $uncompressed);
	$zip->addFromString("themes/" . $theme_name . ".min.css", $compressed);
	//$zip->addFromString("js/jquery.mobile.min.js", htmlspecialchars(file_get_contents("http://code.jquery.com/mobile/latest/jquery.mobile.min.js")));
	//$zip->addFromString("js/jquery.min.js", htmlspecialchars(file_get_contents("http://code.jquery.com/jquery.min.js")));
	$zip->addFromString("index.html", "<!DOCTYPE html><html><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>jQuery Mobile: Theme Download</title><link rel=\"stylesheet\" href=\"themes/" . $theme_name . ".min.css\" /><link rel=\"stylesheet\" href=\"http://code.jquery.com/mobile/" . $JQM_VERSION . "/jquery.mobile.structure-" . $JQM_VERSION . ".min.css\" />	<script src=\"http://code.jquery.com/jquery-" . $JQUERY_VERSION . ".min.js\"></script> <script src=\"http://code.jquery.com/mobile/" . $JQM_VERSION . "/jquery.mobile-" . $JQM_VERSION . ".min.js\"></script></head> <body> <div data-role=\"page\" data-theme=\"a\"><div data-role=\"header\" data-position=\"inline\"><h1>It Worked!</h1></div><div data-role=\"content\" data-theme=\"a\"><p>Your theme was successfully downloaded. You can use this page as a reference for how to link it up!</p><pre><strong>&lt;link rel=&quot;stylesheet&quot; href=&quot;themes/" . $theme_name . ".min.css&quot;&gt;</strong>&lt;link rel=&quot;stylesheet&quot; href=&quot;http://code.jquery.com/mobile/" . $JQM_VERSION . "/jquery.mobile.structure-" . $JQM_VERSION . ".min.css&quot; /&gt; &lt;script src=&quot;http://code.jquery.com/jquery-" . $JQUERY_VERSION . ".min.js&quot;&gt;&lt;/script&gt;&lt;script src=&quot;http://code.jquery.com/mobile/" . $JQM_VERSION . "/jquery.mobile-" . $JQM_VERSION . ".min.js&quot;&gt;&lt;/script&gt;</pre><p>This is content color swatch \"A\" and a preview of a <a href=\"#\" class=\"ui-link\">link</a>.</p><label for=\"slider1\">Input slider:</label><input type=\"range\" name=\"slider1\" id=\"slider1\" value=\"50\" min=\"0\" max=\"100\" data-theme=\"a\" /><fieldset data-role=\"controlgroup\"  data-type=\"horizontal\" data-role=\"fieldcontain\"><legend>Cache settings:</legend><input type=\"radio\" name=\"radio-choice-a1\" id=\"radio-choice-a1\" value=\"on\" checked=\"checked\" /><label for=\"radio-choice-a1\">On</label><input type=\"radio\" name=\"radio-choice-a1\" id=\"radio-choice-b1\" value=\"off\"  /><label for=\"radio-choice-b1\">Off</label></fieldset></div></div></body></html>");
	$zip->close();
	echo ($filename);
	
	
?>