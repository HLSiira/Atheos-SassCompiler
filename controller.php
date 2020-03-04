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

if (isset($_GET['action']) && isset($_GET['path'])) {
	$action = $_GET['action'];
	$path = $_GET['path'];

	if (!Common::checkPath($path)) {
		die('{"status":"error","message":"Invalid path"}');
	}

} elseif (isset($_POST['data'])) {
	$data = json_decode($_POST['data']);
	$action = $data->action;
	$path = $data->path;

	echo json_encode(array("status" => "success", "content" => $content));


} else {
	die('{"status":"error","message":"Missing action/path"}');
}

switch ($action) {

	case 'getContent':
		$content = file_get_contents(getWorkspacePath($_GET['path']));
		echo json_encode(array("status" => "success", "content" => $content));

		break;
	case 'phpCompile':
		$file = getWorkSpacePath($path);

		$pathInfo = pathinfo($file);

		$path = $pathInfo['dirname'];
		$name = $pathInfo['filename'];

		// echo $path_parts['dirname']
		// echo $path_parts['basename']
		// echo $path_parts['extension']
		// echo $path_parts['filename']


		$scss = new Compiler();
		$scss->setImportPaths($path);
		$scss->setFormatter('ScssPhp\ScssPhp\Formatter\Compressed');

		// // will search for 'assets/stylesheets/mixins.scss'
		$content = file_get_contents($file);
		$compiled = $scss->compile($content);
		file_put_contents($path . "/$name.min.css", $compiled);

		// echo $compiled;



		break;

	case 'getFileTree':
		$path = dirname(getWorkspacePath($path));
		$tree = scanProject($path);
		foreach ($tree as $i => $file) {
			$tree[$i] = str_replace($path . "/", "", $file);
		}
		$result = array("status" => "success", "tree" => $tree);
		echo json_encode($result);

		break;

	case 'saveContent':
		if (isset($_POST['content'])) {
			$dir = dirname($_GET['path']);
			$base = basename($_GET['path']);
			$new = preg_replace("/(\w+)(\.scss|\.sass)$/", "$1.css", $base);
			file_put_contents(getWorkspacePath($dir . "/" . $new), $_POST['content']);
			echo '{"status":"success","message":"Sass file compiled!"}';
		} else {
			echo '{"status":"error","message":"missing content"}';
		}
		break;

	default:
		echo '{"status":"error","message":"missiing action"}';
		break;
}


function getWorkspacePath($path) {
	//Security check
	if (!Common::checkPath($path)) {
		die('{"status":"error","message":"Invalid path"}');
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

//////////////////////////////////////////////////////////
//
//  Scan folder
//
//  @param {string} $path Path of the file or project
//  @returns {array} Array of files, recursivly
//
//////////////////////////////////////////////////////////
function scanProject($path) {
	if (is_file($path)) {
		$path = dirname($path);
	}

	$completeArray = array();
	$files = scandir($path);
	foreach ($files as $file) {
		//filter . and ..
		$longPath = $path."/".$file;
		if ($file != "." && $file != ".." && !is_link($longPath)) {
			//check if $file is a folder
			if (is_dir($longPath)) {
				//scan dir
				$parsedArray = scanProject($longPath);
				$completeArray = array_merge($completeArray, $parsedArray);
			} else {
				if (preg_match('/(\.sass|\.scss|\.css)$/', $longPath) === 1) {
					array_push($completeArray, $longPath);
				}
			}
		}
	}
	return $completeArray;
}
?>