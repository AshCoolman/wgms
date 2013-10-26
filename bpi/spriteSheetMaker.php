<?php 

ini_set('auto_detect_line_endings',true);


$destFolder = 'images/';
$spriteData = array();
try {
	
	$paths = array('bpi/sprites/player');
	foreach($paths as $path) {
		$spriteName = explode('/', $path);
		$spriteName = $spriteName[count($spriteName)-1];
		echo "<!-- $spriteName -->";
		
		//build $files start...
		$files = array();
		$Directory = new RecursiveDirectoryIterator(realpath($path));
		$Iterator = new RecursiveIteratorIterator($Directory);
		$Regex = new RegexIterator($Iterator, '/^.+\.png$/i', RecursiveRegexIterator::GET_MATCH);
		$fileLevels = array();
		foreach($Regex as $match) {
			$el = explode($path, $match[0] )[1];
			$lvl = count(explode('/', $el ));
			if ( is_null($fileLevels[ $lvl ] ) ) {
				$fileLevels[ $lvl ] = array();
			}
			$fileLevels[ $lvl ][] = "$path$el";
		}		

		ksort($fileLevels);
		foreach($fileLevels as $lvl => $filesInLevel) {
			sort($filesInLevel);
			foreach($filesInLevel as $file) {
				echo "<!-- saw $file -->";
				array_push($files, $file);
			}
		}
		//...build $files end.
		
		$tileW = imagesx(imagecreatefrompng($files[0])); 
		$tileH = imagesy(imagecreatefrompng($files[0])); 
		
		//create destination file
		$dest=imagecreatetruecolor($tileW * count($files), $tileH);
		$destFile = str_replace(array('/', '\\'), DIRECTORY_SEPARATOR, $destFolder . $spriteName . '.png');
		
		//join the sprite's pngs
		$count = 0;
		foreach($files as $imageSrc) {
			imagealphablending($dest, false);
			imagesavealpha($dest, true);
			$imageSrcPath = str_replace(array('/', '\\'), DIRECTORY_SEPARATOR, $imageSrc);
	   		$image = imagecreatefrompng( $imageSrcPath);
			imagealphablending($image, false);
			imagesavealpha($image, true);
	   		imagecopy($dest, $image, ($tileW*$count), 0, 0, 0, imagesx($image), imagesy($image));
	   		$count++;
			echo "<!--joined $imageSrcPath -->";
		}
		imagepng($dest, $destFile);
		
		//record data from image manipulation
		$spriteData[$spriteName] = array();
		$spriteData[$spriteName]['file'] = $spriteName . '.png';
		$spriteData[$spriteName]['tilew'] = $tileW;
		$spriteData[$spriteName]['tileh'] = $tileH;
		echo "<!-- $spriteName w:$tileW h:$tileH -->";
		
		//read info.txt file
		$lines = file($path . '/info.txt');
		
		echo "<!-- $path/info.txt has " . count($lines) . " lines -->";
		foreach ($lines as $line_num => $line) {
			$attVal = explode('=', trim(preg_replace('/\s+/', '', $line)));
			if (count($attVal) == 2) {
		    	$spriteData[$spriteName][$attVal[0]] = $attVal[1];
				echo "<!-- $spriteName $attVal[0]: $attVal[1] -->";
			} else {	
				echo "<!-- no delim in $line -->";
			}
		}
		
		
	}
} catch (Exception $e) {
	 echo  "PHP Exception <br/>$e<br/>";
}

?>