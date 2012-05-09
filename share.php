<?php
	date_default_timezone_set('America/Los_Angeles');
	
	$original = $_POST["file"];
	
	$dir = scandir('jqm/' . $_POST['ver'] . '/user_themes');
	$today = date('Ymd', strtotime('today'));
	$last_file_num = 0;
	foreach ( $dir as $file ) {  	
        if ( substr($file, 0, 1) !== '.' ) {
			$file_name = explode('.', $file);
			if ( isset($file_name[0]) && $file != "README.md" ) {
				$date = explode('-', $file_name[0]);
				$file_num = $date[1];
				$date = $date[0];
					
				if ( is_numeric($file_num) && $file_num > $last_file_num && $date == $today ) {
					$last_file_num = $file_num;
				}
				if ( strtotime('today - 30 days') >= strtotime($date) ) {
					unlink('css/user_themes/' . $file);
				}
			}
		}
	}
	$new_file_id = $today . '-' . ($last_file_num + 1);
	$new_file_name = 'jqm/' . $_POST['ver'] . '/user_themes/' . $new_file_id . '.css';
	
	$new_file = fopen($new_file_name, 'w');
	fwrite($new_file, $original);
	fclose($new_file);
	
	function getScriptURLDirectory() {
		$pageURL = 'http';
		$dir = dirname($_SERVER["REQUEST_URI"]);
		if($dir !== "/") {
			$dir .= "/";
		}
		if (isset($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] == "on") {
			$pageURL .= "s";
		}
		$pageURL .= "://";
		if ($_SERVER["SERVER_PORT"] != "80") {
			$pageURL .= $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$dir;
		} else {
			$pageURL .= $_SERVER["SERVER_NAME"].$dir;
		}
		return $pageURL;
	}
	
	echo getScriptURLDirectory() . '?ver=' . $_POST['ver'] . '&style_id=' . $new_file_id;

?>