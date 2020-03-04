<?php
/*
 * Copyright (c) Codiad & Andr3as, distributed
 * as-is and without warranty under the MIT License.
 * See http://opensource.org/licenses/MIT for more information.
 * This information must remain intact.
 */
// error_reporting(0);

require_once('../../common.php');
checkSession();

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

		// echo $path_parts['dirname']
		// echo $path_parts['basename']
		// echo $path_parts['extension']
		// echo $path_parts['filename']

		try {

			$scss = new Compiler();
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
				$remove = getWorkspacePath(pathinfo($path)[dirname]);
				$error = explode($remove, $error)[1];
				$error = ' in ' . explode(" on line", $error)[0];
			}

			// echo '{"status":"error","message":"Compilation failed @ Line $line"}';
			echo json_encode(array(
				'status' => "error",
				'message' => "Error on Line $line[0]:$column[0]$error"));

			// echo $error;
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