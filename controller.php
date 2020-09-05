<?php
//////////////////////////////////////////////////////////////////////////////80
// SassCompiler
//////////////////////////////////////////////////////////////////////////////80
// Copyright (c) Atheos & Liam Siira (Atheos.io), distributed as-is and without
// warranty under the MIT License. See [root]/LICENSE.md for more.
// This information must remain intact.
//////////////////////////////////////////////////////////////////////////////80
// Description:
// An Scss Compiler using ScssPHP, built for Atheos IDE.
//												- Liam Siira
//////////////////////////////////////////////////////////////////////////////80

require_once "scssphp/scss.inc.php";
use ScssPhp\ScssPhp\Compiler;

$action = '';
$path = '';

if (isset($_POST['action']) && isset($_POST['path'])) {
	$action = $_POST['action'];
	$path = $_POST['path'];
} else {
	die('{"status":"error","message":"missing action/path"}');
}

switch ($action) {

	case 'phpCompile':
		$file = getWorkSpacePath($path);

		$pathInfo = pathinfo($file);

		$fullpath = $pathInfo['dirname'];
		$name = $pathInfo['filename'];

		try {

			$scss = new Compiler();

			// $scss->setSourceMap(Compiler::SOURCE_MAP_FILE);
			// $scss->setSourceMapOptions([
			// 	'sourceMapWriteTo' => "$fullpath/$name.map",
			// 	// relative or full url to the above .map file
			// 	'sourceMapURL' => './',
			// ]);


			$scss->setImportPaths($fullpath);
			$scss->setFormatter('ScssPhp\ScssPhp\Formatter\Compressed');

			// // will search for 'assets/stylesheets/mixins.scss'
			$content = file_get_contents($file);
			$compiled = $scss->compile($content);
			file_put_contents($fullpath . "/$name.min.css", $compiled);
			echo '{"status":"success","message":"Compiled to '.$name.'.min.css"}';

		} catch (\Exception $e) {
			$error = $e->getMessage();
			preg_match('/(?<=line )\d+(?!=,)/i', $error, $line);
			preg_match('/(?<=column )\d+(?!= )/i', $error, $column);

			if (strpos($error, '(stdin)') > 0) {
				$error = ' in ' . $pathInfo['basename'];
			} else {
				$remove = getWorkspacePath(pathinfo($path)["dirname"]);
				$error = explode($remove, $error)[1];
				$error = ' in ' . explode(" on line", $error)[0];
			}

			echo json_encode(array(
				'status' => "error",
				'message' => $e->getMessage(),
				'pure' => "Error on Line $line[0]:$column[0]$error"
			));
		}


		break;
	default:
		echo '{"status":"error","message":"invalid action"}';
		break;
}

function getWorkspacePath($path) {
	//Security check
	if (!Common::checkPath($path)) {
		die('{"status":"error","message":"invalid path"}');
	}
	if (strpos($path, "/") === 0) {
		//Unix absolute path
		return $path;
	}
	if (strpos($path, ":/") !== false) {
		//Windows absolute path
		return $path;
	}
	if (strpos($path, ":\\") !== false) {
		//Windows absolute path
		return $path;
	}
	return "../../workspace/".$path;
}

?>