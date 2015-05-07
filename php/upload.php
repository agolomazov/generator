<?php
require_once 'functions.php';

// устанавливаем путь к папке для загрузки
$uploadDir = "../img/upload/";
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, '0777');
}

// устанавливаем валидные MYME-types
$types = array("image/gif", "image/png", "image/jpeg", "image/pjpeg", "image/x-png");
// Устанавливаем максимальный размер файла
$file_size = 2097152; // 2МБ
$flag = null;

// Получаем данные из глобального массива
if (isset($_FILES['file'])) {
    $file = $_FILES['file'];
    $flag = 'file';
} else {
    $file = $_FILES['watermark'];
    $flag = 'watermark';
}


// Массив с результатами отработки скрипта
$data = array();

// Если размер файла больше максимально допустимого
if ($file['size'][0] > $file_size) {
    $data['status'] = 'NO';
    $data['mes'] = "Файл слишком большой. Загружать можно только изображения (gif|png|jpg|jpeg) размером до 2МБ";
    $data['url'] = '';
} // если MYME-type файла не соответствует допустимому
else if (!in_array($file['type'][0], $types)) {
    $data['status'] = 'NO';
    $data['mes'] = "Загружать можно только изображения (gif|png|jpg|jpeg) размером до 2МБ";
    $data['url'] = '';
} // Если ошибок нет
else if ($file['error'][0] == 0) {
    // получаем имя файла
    $filename = basename($file['name'][0]);
    // получаем расширение файла
    $extension = pathinfo($file['name'][0], PATHINFO_EXTENSION);
    // перемещаем файл из временной папки в  нужную
    if (move_uploaded_file($file['tmp_name'][0], $uploadDir . str2url($filename) . '.' . $extension)) {
        $data['status'] = 'OK';
        $data['mes'] = "Изображение успешно загружено";
        $data['url'] = $uploadDir . str2url($filename) . '.' . $extension;
        $data['name'] = $filename;
        $data['flag'] = $flag;
    } // ошибка при перемещении файла
    else {
        $data['status'] = 'NO';
        $data['mes'] = "Возникла неизвестная ошибка при загрузке файла";
        $data['url'] = '';
    }
}


// Выводим результат в JSON и заверщаем в скрипт
echo json_encode($data);
exit;
