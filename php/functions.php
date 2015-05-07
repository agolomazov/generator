<?php
/**
 *  Функция для транслитерации русского текста
 *
 * @param  string $string
 * @return string
 */
function rus2translit($string)
{

    $converter = array(

        'а' => 'a', 'б' => 'b', 'в' => 'v',

        'г' => 'g', 'д' => 'd', 'е' => 'e',

        'ё' => 'e', 'ж' => 'zh', 'з' => 'z',

        'и' => 'i', 'й' => 'y', 'к' => 'k',

        'л' => 'l', 'м' => 'm', 'н' => 'n',

        'о' => 'o', 'п' => 'p', 'р' => 'r',

        'с' => 's', 'т' => 't', 'у' => 'u',

        'ф' => 'f', 'х' => 'h', 'ц' => 'c',

        'ч' => 'ch', 'ш' => 'sh', 'щ' => 'sch',

        'ь' => '\'', 'ы' => 'y', 'ъ' => '\'',

        'э' => 'e', 'ю' => 'yu', 'я' => 'ya',


        'А' => 'A', 'Б' => 'B', 'В' => 'V',

        'Г' => 'G', 'Д' => 'D', 'Е' => 'E',

        'Ё' => 'E', 'Ж' => 'Zh', 'З' => 'Z',

        'И' => 'I', 'Й' => 'Y', 'К' => 'K',

        'Л' => 'L', 'М' => 'M', 'Н' => 'N',

        'О' => 'O', 'П' => 'P', 'Р' => 'R',

        'С' => 'S', 'Т' => 'T', 'У' => 'U',

        'Ф' => 'F', 'Х' => 'H', 'Ц' => 'C',

        'Ч' => 'Ch', 'Ш' => 'Sh', 'Щ' => 'Sch',

        'Ь' => '\'', 'Ы' => 'Y', 'Ъ' => '\'',

        'Э' => 'E', 'Ю' => 'Yu', 'Я' => 'Ya',

    );

    return strtr($string, $converter);

}

/**
 *  Функция, которая нормализует имена файлов для URL
 *
 * @param $str
 * @return mixed|string
 */
function str2url($str)
{

    // переводим в транслит

    $str = rus2translit($str);

    // в нижний регистр

    $str = strtolower($str);

    // заменям все ненужное нам на "-"

    $str = preg_replace('~[^-a-z0-9_]+~u', '-', $str);

    // удаляем начальные и конечные '-'

    $str = trim($str, "-");

    return $str;

}

/**
 * @param $file (string)      - путь к большой картинке
 * @param $watermark (string) - путь к водяному знаку
 * @param $coords (array)     - массив координат
 * @param $opacity (double)   - значение прозрачности
 * @param $dist (string)      - путь к сгенерированной картинке
 * @param $flag (string)    - флаг - одна картинка накладывается или растрируется
 *
 *
 */
function merge_watermark($file, $watermark, $coords, $opacity, $dist, $flag)
{
    $data = array();

    if (!file_exists($file) || !file_exists($watermark)) {
        $data['status'] = "NO";
        $data['message'] = "Большая картинка или водяной знак не загружены";
        $data['url'] = '';
    } else {

        // Проверяем, есть ли такая папка
        if (!file_exists($dist)) {
            mkdir($dist, 777);
        }

        // считываем сигнатуру изображения
        $file_sign = exif_imagetype($file);
        $watermark_sing = exif_imagetype($watermark);

        // Если были переданы не верные картинки
        if (!$file_sign || !$watermark_sing) {

            $data['status'] = "NO";
            $data['message'] = "Были загружены некорректные изображения";
            $data['url'] = '';

        } else {

            // Объекты
            $file_img_object = create_image_object($file_sign, $file);
            $watermark_img_object = create_image_object($watermark_sing, $watermark);

            // если не удалось создать один из объектов
            if (!$file_img_object['object'] || !$watermark_img_object['object']) {

                $data['status'] = "NO";
                $data['message'] = "Возникла ошибка при генерации изображения";
                $data['url'] = '';

            } else {

                // уменьшаем изображение
                $file_img_object['object'] = resize_img($file, $file_img_object, 648, 536);
              // упрощаем массив координат
                $simple_coords = simpled_coords($coords, $flag);
                // не верно переданны координаты
                if (!$simple_coords) {
                    $data['status'] = "NO";
                    $data['message'] = "Не верное переданны координаты";
                    $data['url'] = '';
                }
                // Начинаем накладывать изображение
                else {
                    // накладываем изображения по координатам
                    foreach($simple_coords as $item_coord){
                        imagecopymerge($file_img_object['object']
                                    , $watermark_img_object['object']
                                    , $item_coord['left']
                                    , $item_coord['top']
                                    , 0
                                    , 0
                                    , $watermark_img_object['size']['width']
                                    , $watermark_img_object['size']['height']
                                    , $opacity);
                    }

                    // получаем результат
                    $result = save_image($file_img_object, $dist);
                    // Если не получилось сгенерировать изображение
                    if(!$result['flag']){
                        $data['status'] = "NO";
                        $data['message'] = "Ошибка сохранения изображения";
                        $data['url'] = '';
                    } else {
                        $data['status'] = "OK";
                        $data['message'] = "Изображение успешно сгенерированно";
                        $data['url'] = $result['src'];
                    }


                }

            }

        }

    }

    echo json_encode($data);
    exit;

}

// Функция проверяет сигнатуру картинки и создает объект
// или возвращает FALSE
function create_image_object($sign, $file)
{

    $img_obj = null;

    switch ($sign) {

        // GIF
        case 1:
            $file_obj = imagecreatefromgif($file);
            list($width, $height) = getimagesize($file);
            $canvas = imagecreatetruecolor($width, $height);
            $color = imagecolorallocatealpha($canvas, 0, 0, 0, 127);
            imagefill($canvas, 0, 0, $color);
            imagecolortransparent($canvas, $color);
            imagesavealpha($canvas, true);

            imagecopyresampled($canvas, $file_obj, 0, 0, 0, 0, $width, $height, $width, $height);
            return array('object' => $canvas,
                            'extension' => 'gif',
                            'size' => array(
                                'width' => $width,
                                'height' => $height
                            )
            );

        // JPEG
        case 2:
            list($width, $height) = getimagesize($file);
            $img_obj = imagecreatefromjpeg($file);
            return array('object' =>$img_obj
                        , 'extension' => 'jpeg'
                        , 'size' => array(
                            'width' => $width,
                            'height' => $height
                        ));
        // PNG
        case 3:
            $file_obj = imagecreatefrompng($file);
            list($width, $height) = getimagesize($file);
            $canvas = imagecreatetruecolor($width, $height);
            $color = imagecolorallocatealpha($canvas, 0, 0, 0, 127);
            imagefill($canvas, 0, 0, $color);
            imagecolortransparent($canvas, $color);
            imagesavealpha($canvas, true);

            imagecopyresampled($canvas, $file_obj, 0, 0, 0, 0, $width, $height, $width, $height);

            return array('object' => $canvas,
                'extension' => 'png',
                'size' => array(
                    'width' => $width,
                    'height' => $height
                )
            );

        // ERROR
        default:
            return array('object' => false,
                      'extension' => false
            );

    }

}


/**
 *  Функция упращает переданный массив координат
 *
 * @param $coords
 * @param $flag
 * @return array|bool
 */
function simpled_coords($coords, $flag)
{
    $coords_array = array();

    switch ($flag) {

        case 'single':
            $coords_array[] = $coords[0];
            return $coords_array;
            break;
        case 'multiple':
            foreach ($coords as $row) {
                foreach ($row as $cell) {
                    $coords_array[] = $cell;
                }
            }

            return $coords_array;
            break;
        default:
            return false;

    }
}

// Функция сохраняет файл и возвращает массив значений
function save_image($img, $dist){
    $flag = null;

    switch($img['extension']){

        case 'jpeg':
            $flag = imagejpeg($img['object'], $dist.'result.jpeg', 100);
            imagedestroy($img['object']);
            return array('flag' => $flag, 'src' => $dist.'result.jpeg');
        case 'gif':
            $flag = imagegif($img['object'], $dist.'result.gif');
            imagedestroy($img['object']);
            return array('flag' => $flag, 'src' => $dist.'result.gif');
        case 'png':
            $flag = imagepng($img['object'], $dist.'result.png');
            imagedestroy($img['object']);
            return array('flag' => $flag, 'src' => $dist.'result.png');

    }

}

// Функция уменьшения размера изображения
function resize_img($file, $file_obj, $max_width, $max_height){
    // кэшируем значение высоты и ширины
    $width = $file_obj['size']['width'];
    $height = $file_obj['size']['height'];
    $img_obj = $file_obj['object'];

    // коэффициент уменьшение изображения
    $koe = null;

    if($width > $height){
        $koe = $width / $max_width;
        $new_height = ceil($height / $koe);
        $new_width = $max_width;
    } elseif ($height > $width){
        $koe = $height / $max_height;
        $new_width = ceil($width / $koe);
        $new_height = $max_height;
    } else {
        $new_width = $new_height = $max_height;
    }

    // создаем холст для новой картинки
    $new_img = imagecreatetruecolor($new_width, $new_height);

    imagecopyresampled($new_img,$img_obj,0,0,0,0,$new_width,$new_height,imagesx($img_obj),imagesy($img_obj));
    if($file_obj['extension'] == 'jpeg'){
        imagejpeg($new_img, $file, 100);
    } elseif($file_obj['extension'] == 'gif'){
        imagegif($new_img, $file);
    } else {
        imagepng($new_img, $file);
    }

    return $new_img;

}