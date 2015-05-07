<?php
session_start();
// получаем имя хоста
$host = $_SERVER['SERVER_NAME'];

// получаем или задаем значение сессионной переменной
if (isset($_GET['lang'])){
    $lang = $_GET['lang'];
} elseif($_SESSION['lang']){
    $lang = $_SESSION['lang'];
} else{
    $lang = 'ru';
}

// записываем ее значение в сессию
switch($lang){
    case 'eng':
    case 'ru':
        $_SESSION['lang'] = $lang;
        break;
    default:
        $_SESSION['lang'] = 'ru';
}


// Если файла с локализацие не существует
if(!file_exists('lang.ini')){
    die("Not exist file language");
}

// Если не удалось считать настройки локализации
$lang_config = parse_ini_file('lang.ini', true);
if(!$lang_config){
    die("Error! Can not read language file!");
}

// кэшируем эти значения
$labels = $lang_config[$lang];


?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <!-- Тег для корректной работы в IE -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <!-- Правила масштабирования -->
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Заголовок берем из PHP переменной -->
    <title><?php echo $labels['title']; ?></title>

    <!-- SEO теги -->
    <meta name="description" content="seo here">
    <meta name="keywords" content="seo here"/>
    <meta name="author" content="Kovalchuk Dmitriy"/>
    
    <!-- favicon -->
    <link rel="apple-touch-icon" sizes="57x57" href="http://<?php echo $host; ?>/img/favicons/apple-touch-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="114x114" href="http://<?php echo $host; ?>/img/favicons/apple-touch-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="72x72" href="http://<?php echo $host; ?>/img/favicons/apple-touch-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="144x144" href="http://<?php echo $host; ?>/img/favicons/apple-touch-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="60x60" href="http://<?php echo $host; ?>/img/favicons/apple-touch-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="120x120" href="http://<?php echo $host; ?>/img/favicons/apple-touch-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="76x76" href="http://<?php echo $host; ?>/img/favicons/apple-touch-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="152x152" href="http://<?php echo $host; ?>/img/favicons/apple-touch-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="http://<?php echo $host; ?>/img/favicons/apple-touch-icon-180x180.png">
    <link rel="icon" type="image/png" href="http://<?php echo $host; ?>/img/favicons/favicon-192x192.png" sizes="192x192">
    <link rel="icon" type="image/png" href="http://<?php echo $host; ?>/img/favicons/favicon-160x160.png" sizes="160x160">
    <link rel="icon" type="image/png" href="http://<?php echo $host; ?>/img/favicons/favicon-96x96.png" sizes="96x96">
    <link rel="icon" type="image/png" href="http://<?php echo $host; ?>/img/favicons/favicon-16x16.png" sizes="16x16">
    <link rel="icon" type="image/png" href="http://<?php echo $host; ?>/img/favicons/favicon-32x32.png" sizes="32x32">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="msapplication-TileImage" content="/img/favicons/mstile-144x144.png">
    <!-- // favicon -->

    <!-- Стиль css для fileupload -->
    <link rel="stylesheet" href="http://<?php echo $host; ?>/bower_components/jquery-file-upload/css/jquery.fileupload.css">
    <!--  Мои css стили-->
    <link href="http://<?php echo $host; ?>/css/main.css" media="screen, projection" rel="stylesheet" type="text/css" />
    
</head>
<body>
    <div class="block-lang_btn">
        <ul>
            <?php if($lang == 'ru'): ?>
                <li class="lang-btn active">
                    рус
                </li>
            <?php else: ?>
            <li class="lang-btn">
                <a href="/ru/">рус</a>
            </li>
            <?php endif; ?>


            <?php if($lang == 'eng'): ?>
                <li class="lang-btn active">
                    eng
                </li>
            <?php else: ?>
                <li class="lang-btn">
                    <a href="/eng/">eng</a>
                </li>
            <?php endif; ?>
        </ul>
    </div>
    <div class="block-generator">
        <div class="main-block">
            <div class="h1">
                <?php echo $labels['title']; ?>
            </div>
            <!--/end .h1-->
            <div class="pic-block">
                <div class="div-file-upload"></div>
                <div class="div-watermark-upload" id="div-watermark-upload">
                    <div class="drag-watermark" id="drag"></div>
                </div>
            </div>
            <!--/end .pic-block-->
        </div>
        <!--/end .main-block-->
        <div class="navigation-block">
            <div class="h2">
                <?php echo $labels['settings']; ?>
            </div>
            <!--/end .h2-->
            <form id="fileupload">
                <div class="settings-block">
                    <div class="form-block">
                        <div class="form-title">
                            <?php echo $labels['bigphoto']; ?>
                        </div>
                        <!--/end .form-title-->
                        <div class="fileupload-wrapper" id="uploadfile">
                            <input id="fileupload" type="file" name="file[]" multiple="">
                            <input id="fileurl" type="hidden" name="fileurl">
                            <input id="filename" type="text" class="input text-upload" name="filename" disabled="" qtip-content="Вы не выбрали изображение">
                        </div>
                        <!--/end .form-input-->
                    </div>
                    <!--/end .form-block-->
                    <div class="form-block">
                        <div class="form-title">
                            <?php echo $labels['miniphoto']; ?>
                        </div>
                        <!--/end .form-title-->
                        <div class="fileupload-wrapper" id="uploadfile">
                            <input id="waterupload" type="file" name="watermark[]" multiple="">
                            <input id="waterurl" type="hidden" name="waterurl">
                            <input id="watername" type="text" class="input text-upload" name="watername" disabled="" qtip-content="Вы не выбрали изображение">
                        </div>
                        <!--/end .form-input-->
                    </div>
                    <!--/end .form-block-->
                </div>
            </form>
            <!--/end .settings-block-->
            <div class="settings-block">
                <div class="row title title-position">
                    <div class="col-6">
                        <?php echo $labels['place']; ?>
                    </div>
                    <div class="col-6 text-right ico-row">
                        <div class="ico tileon"></div>
                        <div class="ico oneoff active"></div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <div class="box-position landscape">
                            <div class="cell" data-position-X="left" data-position-Y="top"></div>
                            <div class="cell" data-position-X="center" data-position-Y="top"></div>
                            <div class="cell" data-position-X="right" data-position-Y="top"></div>
                            <div class="cell" data-position-X="left" data-position-Y="center"></div>
                            <div class="cell" data-position-X="center" data-position-Y="center"></div>
                            <div class="cell" data-position-X="right" data-position-Y="center"></div>
                            <div class="cell" data-position-X="left" data-position-Y="bottom"></div>
                            <div class="cell" data-position-X="center" data-position-Y="bottom"></div>
                            <div class="cell" data-position-X="right" data-position-Y="bottom"></div>
                            <div class="after"></div>
                            <div class="before"></div>
                        </div>
                    </div>
                    <div class="col-6 col-spinner">
                        <div class="row row-spinner text-right">
                            <label for="changeX">
                                <img src="http://<?php echo $host; ?>/img/changeX.png" alt=""/>
                            </label>
                            <input id="changeX" value="0">
                        </div>
                        <div class="row row-spinner text-right">
                            <label for="changeY">
                                <img src="http://<?php echo $host; ?>/img/changeY.png" alt=""/>
                            </label>
                            <input id="changeY" value="0">
                        </div>
                    </div>
                </div>
            </div>
            <!--/end .settings-block-->
            <div class="settings-block">
                <div class="row title">
                    <div class="col-12">
                        <?php echo $labels['opacity']; ?>
                    </div>
                </div>
                <div class="row row-slider">
                    <div id="slider"></div>
                </div>
            </div>
            <!--/end .settings-block-->
            <div class="button-block">
                <div class="row">
                    <div class="col-6 text-left">
                        <button class="btn btn-cancel">
                            <?php echo $labels['reset']; ?>
                        </button>
                    </div>
                    <div class="col-6 text-right">
                        <button class="btn btn-download">
                            <?php echo $labels['download']; ?>
                        </button>
                    </div>
                </div>
            </div>
            <!--/end .button-block-->
        </div>
        <!--/end .navigation-block-->
    </div>
    <!--/end .block-generator-->
	<footer>
        <?php echo $labels['copyright']; ?>
	</footer>
    <!--/end footer-->

    <!-- 
      Скрипты только в конце страницы. 
      Подключаем только девелоперские версии скриптов (не минифицированные).
      Скрипты должны быть подключены в порядке из зависимости друг от друга (если эта зависимость есть).
    -->
    <script src="http://<?php echo $host; ?>/bower_components/jquery/dist/jquery.js"></script> <!-- Jquery идет первым, от него зависят почти все последующие -->

    <!-- UI Core - без этого не будут работать остальные наши скрипты -->
    <script src="http://<?php echo $host; ?>/bower_components/jquery-ui/ui/core.js"></script>
    <script src="http://<?php echo $host; ?>/bower_components/jquery-ui/ui/widget.js"></script>
    <script src="http://<?php echo $host; ?>/bower_components/jquery-ui/ui/mouse.js"></script>
    <script src="http://<?php echo $host; ?>/bower_components/jquery-ui/ui/position.js"></script>
    <!--Interactions-->
    <script src="http://<?php echo $host; ?>/bower_components/jquery-ui/ui/draggable.js"></script>
    <!--Widgets-->
    <script src="http://<?php echo $host; ?>/bower_components/jquery-ui/ui/button.js"></script>
    <script src="http://<?php echo $host; ?>/bower_components/jquery-ui/ui/spinner.js"></script>
    <script src="http://<?php echo $host; ?>/bower_components/jquery-ui/ui/slider.js"></script>
    <!-- // UI Core -->

    <!-- file-upload - для подгрузки файлов -->
    <script src="http://<?php echo $host; ?>/bower_components/jquery-file-upload/js/vendor/jquery.ui.widget.js"></script>
    <script src="http://<?php echo $host; ?>/bower_components/jquery-file-upload/js/jquery.iframe-transport.js"></script>
    <script src="http://<?php echo $host; ?>/bower_components/jquery-file-upload/js/jquery.fileupload.js"></script>
    <script src="http://<?php echo $host; ?>/bower_components/jquery-filedownload/src/Scripts/jquery.fileDownload.js"></script>
    <!-- // file-upload - для подгрузки файлов -->
    <!-- Свои скрипты -->
    <script src="http://<?php echo $host; ?>/js/app.js"></script>
</body>
</html>