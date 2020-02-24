<?php

require_once "scssphp/scss.inc.php";
use ScssPhp\ScssPhp\Compiler;


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// echo json_encode(array("status" => "success", "path" => 'test'));

$scss = new Compiler();
echo $scss->compile('
				$color: #abc;
				div { color: lighten($color, 20%); }
			');
