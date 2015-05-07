<?php

$filename = $_POST['filename'];
$file_info = pathinfo($filename);

header('Content-Disposition: attachment; filename="' . $file_info['basename'] . '"');
readfile($filename);
exit();