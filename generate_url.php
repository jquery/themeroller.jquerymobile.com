<?php
	date_default_timezone_set('America/Los_Angeles');
	
	$original = file_get_contents('css/default.css', 'r');
	
	$start = strpos($original, '/* A');
	$end = strpos($original, '/* Structure');
	$swatch_template = substr($original, $start, $end-$start);
	
	$swatch_counter = 1;
	$alpha = array('Global', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
	
	//loop to find new swatches
	foreach($_POST as $index => $value) {
		$reg = preg_quote('/*{' . $index . '}*/');
		if(!preg_match($reg, $original)) {
			$start = strpos($original, '/* ' . $alpha[swatch_counter]);
			$end = strpos($original, '/* Structure');
			$lower = strtolower($alpha[$swatch_counter + 1]);
			$temp_swatch_template = preg_replace('/-a,/', '-' . $lower . ',', $swatch_template);
			$temp_swatch_template = preg_replace('/{a-/', '{' . $lower . '-', $temp_swatch_template);
			$temp_swatch_template = preg_replace('/-a /', '-' . $lower . ' ', $temp_swatch_template);
			$temp_swatch_template = preg_replace('/\/\* A/', '/* ' . $alpha[$swatch_counter + 1], $temp_swatch_template);
			
			$new_file = substr($original, 0, $end);
			$new_file .= $temp_swatch_template;
			$new_file .= substr($original, $end, strlen($original) - $end);
			$original = $new_file;
	
			$swatch_counter++;
		}
	}
	
	foreach($_POST as $index => $value) {
		$suffix = substr($index, -4, 4);
		if($suffix != 'font') {
			$original = preg_replace('/\s[^\s]*\s\/\*{' . $index . '}\*\//', ' ' . $value . ' /*{' . $index . '}*/', $original);
		} else {
			$original = preg_replace('/font-family:\s.*\s\/\*{' . $index . '}\*\//', $value . ' /*{' . $index . '}*/', $original);
		}
	}
	
	$dir = scandir('css/user_themes');
	$today = date('Ymd', strtotime('today'));
	$last_file_num = 0;
	foreach($dir as $file) {
		if($file != '.' && $file != '..' && $file != '.DS_Store') {
			$file_name = explode('.', $file);
			if(isset($file_name[0])) {
				$date = explode('-', $file_name[0]);
				$file_num = $date[1];
				$date = $date[0];
					
				if(is_numeric($file_num) && $file_num > $last_file_num && $date == $today) {
					$last_file_num = $file_num;
				}
				if(strtotime('today - 30 days') >= strtotime($date)) {
					unlink('css/user_themes/' . $file);
				}
			}
		}
	}
	$new_file_id = $today . '-' . ($last_file_num + 1);
	$new_file_name = 'css/user_themes/' . $new_file_id . '.css';
	
	$new_file = fopen($new_file_name, 'w');
	fwrite($new_file, $original);
	fclose($new_file);
	
	$url = 'http://jquerymobile.com/themeroller-test/index.php?style_id=' . $new_file_id;
	echo $url;

?>