<?php
/*
 *  $big_photo - большая картинка
 *  $watermark - водяной знак
 *  $opacity   - значение прозрачности
 *  $coords    - координаты
 */

require_once 'functions.php';

extract($_POST);
$opacity = $opacity * 100;

merge_watermark($big_photo, $watermark, $coords, $opacity, '../img/generate/', $flag);

