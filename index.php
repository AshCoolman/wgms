<!DOCTYPE HTML>
<?php $IS_DEPLOY = false; ?>
<html lang="en"><?php include_once('bpi/spriteSheetMaker.php');?>
<head>
<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0"/>
<title>Platformer Example</title>
<script type="text/javascript">
	var SPRITE_DATA = <?php echo json_encode($spriteData); ?>;
</script>
<script src='../../lib/quintus.js'></script>
<script src='../../lib/quintus_sprites.js'></script>
<script src='../../lib/quintus_scenes.js'></script>
<script src='../../lib/quintus_input.js'></script>
<script src='../../lib/quintus_anim.js'></script>
<script src='../../lib/quintus_2d.js'></script>
<script src='../../lib/quintus_touch.js'></script>
<script src='../../lib/quintus_ui.js'></script>

<?php

if (!$IS_DEPLOY) { 
	try {
		$paths = array('js/QuintusApp/');
		foreach($paths as $path) {

			$simpath = $path;
			$Directory = new RecursiveDirectoryIterator(realpath($simpath));
			$Iterator = new RecursiveIteratorIterator($Directory);
			$Regex = new RegexIterator($Iterator, '/^.+\.js$/i', RecursiveRegexIterator::GET_MATCH);
			$fileLevels = array();
			foreach($Regex as $match) {
				$el = explode($simpath, $match[0] )[1];
				$lvl = count(explode('/', $el ));
				if ( is_null($fileLevels[ $lvl ] ) ) {
					$fileLevels[ $lvl ] = array();
				}
				$fileLevels[ $lvl ][] = "$simpath$el";
			}		

			ksort($fileLevels);
			foreach($fileLevels as $lvl => $filesInLevel) {
				sort($filesInLevel);
				foreach($filesInLevel as $file) {
					//echo "<br/>$lvl: $file";
					echo "<script src=\"$file\"></script>\n";
				}
			}
		}
	} catch (Exception $e) {
		 echo  "PHP Exception <br/>$e<br/>";
	}
}
?>
<style> 
  body { padding:0px; margin:0px; } 
</style>
</head>
<body>
</body>
</html>
