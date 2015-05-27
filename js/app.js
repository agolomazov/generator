var _var = (function() {
    return {
        drag_div: '#drag',
        snipperX_input: '#changeX',
        snipperY_input: '#changeY',
        slider_div: '#slider',
        cell_div: '.cell',
        picBlock_div: '.pic-block',
        fileUpload_div: '.div-file-upload',
        waterMarkUpload_div: '.div-watermark-upload',
        cancel_btn: '.btn-cancel',
        download_btn: '.btn-download',
        ico_div: '.ico',
        boxPosition_div: '.box-position',
        single_ico: '.oneoff',
        multiple_ico: '.tileon',
        urlFileUpload: '',
        urlWatermark: '',
        urlSpinerX: 0,
        urlSpinerY: 0,
        urlOpacity: 1,
        uploadFile: false,
        uploadWatermark: false,
        widthWatermark: '',
        heightWatermark: ''
    };
})();

var fileUpload = (function() {
    var fileUploadUrl = '/php/upload.php',
        waterUpload = $(_var.waterMarkUpload_div),
        fileUpload = $(_var.fileUpload_div),
        fileText = $('input[name="file[]"]')
        .parent()
        .find('.text-upload'),
        waterText = $('input[name="watermark[]"]')
        .parent()
        .find('.text-upload'),
        waterMarkInput = $('#waterupload');
    return {
        fileUp: function(id) {
            console.log('Инициализируем файлаплоад');
            var _this = $(id);
            // Загрузка файлов на сервер
            _this.fileupload({
                url: fileUploadUrl,
                dataType: 'json',
                success: function(ans) {
                    var mes = ans.mes,
                        status = ans.status;
                    if (status === 'OK') {
                        if (ans.flag === 'file') {
                            fileUpload
                                .empty()
                                .css({
                                    'height': '100%',
                                    'width': '100%'
                                })
                                .append('<img>')
                                .find('img')
                                .attr('src', ans.url)
                                .load(function() {
                                    app.positionImg();
                                });
                            fileText.val(ans.name);
                            _var.urlFileUpload = ans.url;
                            _var.uploadFile = true;
                            waterMarkInput
                                .removeAttr('disabled')
                                .parent()
                                .removeClass('disable');
                        } else {
                            waterUpload
                                .find(_var.drag_div)
                                .empty()
                                .css({
                                    'top': 'auto',
                                    'left': 'auto',
                                    'height': '100%',
                                    'width': '100%'
                                })
                                .append('<img>')
                                .find('img')
                                .attr('src', ans.url);
                            _var.urlWatermark = ans.url;
                            waterText.val(ans.name);
                            _var.uploadWatermark = true;
                            app.destroyDrag();
                            $(_var.drag_div)
                                .draggable(dragMode.option);
                            if (app.flagMode !=
                                'single') {
                                app.changeMode();
                            }
                        }
                    }
                }
            });
        }
    };
})();
// ==============================================
// ==============================================
// Модуль который определяет все опции Spinner
// ==============================================
var spinnerMode = (function() {
    var $dragBlock = $(_var.drag_div), // Объявлемя в переменные сразу значения нашего drag div-ов 
        $cellBlock = $(_var.cell_div); // Объявлемя в переменные сразу значения наших spell div-ов 
    // Функция которая отвечает за создание spinner
    function creatFun(e, ui) {
            $(this)
                .val(0); // При создание spinner, мы должны выставить нужные значения, в нашем случае это value=0
        }
        // Функция которая отвечает за опции single X

    function optionSingleXFun(e, ui) {
        var _val = ui.value || $(this)
            .val() + 'px';
        $dragBlock.css('top', _val); // Добавляем значение сверху 
        $cellBlock.removeClass('active'); // Если начинаем изменять spinner, то у 'cell' блоков надо убрать класс 'active'
        _var.urlSpinerX = _val;
        if (_val === 'px') {
            $(this)
                .val(0);
            $dragBlock.css('top', '0');
            _var.urlSpinerX = 0;
        }
    }
    // Функция которая отвечает за опции single Y
    function optionSingleYFun(e, ui) {
        var _val = ui.value || $(this)
            .val() + 'px';
        $dragBlock.css('left', _val); // Добавляем значение сверху 
        $cellBlock.removeClass('active'); // Если начинаем изменять spinner, то у 'cell' блоков надо убрать класс 'active'
        _var.urlSpinerY = _val;
        if (_val === 'px') {
            $(this)
                .val(0);
            $dragBlock.css('left', '0');
            _var.urlSpinerY = 0;
        }
    }
    // Определяем заранее функцию в режиме Multiple по X позиции, так как при состояние change тоже надо выполянть все эти действия
    function optionMultipleXFun(e, ui) {
        var countImg = $dragBlock.find('.row')
            .eq(0)
            .find('img')
            .length, // Находим сколько элементов в первом row, что бы знать на сколько нам надо увеличивать margin-right
            $img = $dragBlock.find('.row')
            .find('img'), // Заранее уже в переменную вносим обращение к нашим картинкам
            _val = ui.value || $(this)
            .val() || 0, // Т.к. в состояние change нет возможности узнать ui.value мы говорим что если нет значения ui.value использовать $(this).val(), а если и это значение отсутвует то значит должно ровняться 0
            _width = _var.widthWatermark, // Подставляем ширину нашего блока, которую мы задали в модуль _var когда только перешли в режим Multiple
            _imgStep = Math.floor($img.width() / 100) || 1, // Для изменения в box-position линии по Х мы должны знать её ширину и делем на 100 что бы знать в процентах, если значение будет не удобовримом, а такое может быть мы присвваиваем 1
            _columWidth = Math.floor(_val / _imgStep); // А тут мы значение делем на шаг, и округляем его всегда в меньшую строну, слеовательно как только шаг достигает равного числа, мы можем увеличить ширину нашей полоски
        _width = _width + (_val * countImg); // Прибавляем нужное кол-во к ширине
        // Здесь мы для блок #drag задаем его ширину после всех вычислений
        $dragBlock.css({
            'width': _width + 'px'
        });
        _val = parseInt(_val); // Если по какой-то причине это не число, делаем его таковым!
        // Каждой картинке плюсуем столько margin сколько у нас _val
        $img.css({
            'margin-right': _val + 'px'
        });
        // Т.к. мы находимся в режиме Multiple мы должны высчитать где ограничивать наш блок с картинкой, это происходит в функции dragPositionStop()
        app.dragPositionStop();
        // В данном условии мы ограничиваем увлечение нашей полоски если она большй 90
        if (_columWidth < 90) {
            $(_var.boxPosition_div)
                .find('.after')
                .css({
                    'width': _columWidth + 'px',
                    'margin-left': '-' + (_columWidth / 2) +
                        'px'
                });
        }
        // Если по каким-то причинам ты покинул input до того как поставили значение туда, то мы присваиваем ему значение 0
        _var.urlSpinerX = _val;
        if (_val === 0) {
            $(this)
                .val(0);
            $img.css({
                'margin-right': '0px'
            });
            _var.urlSpinerX = 0;
        }
    }
    // Определяем заранее функцию в режиме Multiple по Y позиции, так как при состояние change тоже надо выполянть все эти действия
    function optionMultipleYFun(e, ui) {
        var countRow = $dragBlock.find('.row')
            .length, // Находим сколько строк в нашем блоке #drag, что бы знать на сколько нам надо увеличивать раз margin-bottom
            $img = $dragBlock.find('.row')
            .find('img'), // Заранее уже в переменную вносим обращение к нашим картинкам
            _val = ui.value || $(this)
            .val() || 0, // Т.к. в состояние change нет возможности узнать ui.value мы говорим что если нет значения ui.value использовать $(this).val(), а если и это значение отсутвует то значит должно ровняться 0
            _height = _var.heightWatermark, // Подставляем высоту нашего блока, которую мы задали в модуль _var когда только перешли в режим Multiple
            _imgStep = Math.floor($img.height() / 100) || 1, // Для изменения в box-position линии по Y мы должны знать её высоту и делем на 100 что бы знать в процентах один шаг, если значение будет не удобовримом, а такое может быть, мы присваиваем 1
            _columHeight = Math.floor(_val / _imgStep); // А тут мы значение делем на шаг, и округляем его всегда в меньшую строну, слеовательно как только шаг достигает равного числа, мы можем увеличить ширину нашей полоски
        _height = _height + (_val * countRow); // Прибавляем нужное кол-во к высоте
        // Здесь мы для блок #drag задаем его высоту после всех вычислений
        $dragBlock.css({
            'height': _height + 'px'
        });
        _val = parseInt(_val); // Если по какой-то причине это не число, делаем его таковым!
        // Каждой картинке плюсуем столько margin сколько у нас _val
        $img.css({
            'margin-bottom': _val + 'px'
        });
        // Т.к. мы находимся в режиме Multiple мы должны высчитать где ограничивать наш блок с картинкой, это происходит в функции dragPositionStop()
        app.dragPositionStop();
        // В данном условии мы ограничиваем увлечение нашей полоски если она большй 90
        if (_columHeight < 90) {
            $(_var.boxPosition_div)
                .find('.before')
                .css({
                    'height': _columHeight + 'px',
                    'margin-top': '-' + (_columHeight / 2) +
                        'px'
                });
        }
        // Если по каким-то причинам ты покинул input до того как поставили значение туда, то мы присваиваем ему значение 0
        _var.urlSpinerY = _val;
        if (_val === 0) {
            $(this)
                .val(0);
            $img.css({
                'margin-bottom': '0px'
            });
            _var.urlSpinerY = 0;
        }
    }
    return {
        optionX: {
            min: 0,
            create: creatFun,
            change: optionSingleXFun,
            spin: optionSingleXFun
        },
        optionY: {
            min: 0,
            create: creatFun,
            change: optionSingleYFun,
            spin: optionSingleYFun
        },
        optionMultipleX: {
            min: 0,
            step: 1,
            incremental: false,
            create: creatFun,
            change: optionMultipleXFun,
            spin: optionMultipleXFun,
        },
        optionMultipleY: {
            min: 0,
            step: 1,
            incremental: false,
            create: creatFun,
            change: optionMultipleYFun,
            spin: optionMultipleYFun
        },
    };
})();
// ==============================================
// ==============================================
// Модуль который определяет все опции Drag
// ==============================================
var dragMode = (function() {
    return {
        option: {
            containment: _var.waterMarkUpload_div,
            scroll: false,
            start: function(e, ui) {
                $(_var.cell_div)
                    .removeClass('active'); // Если начинаем изменять spinner, то у 'cell' блоков надо убрать класс 'active'
            },
            drag: function(e, ui) {
                var _top = ui.position.top,
                    _left = ui.position.left;
                $(_var.snipperX_input)
                    .val(_top); // Не забываем добавить координаты в snipper X
                $(_var.snipperY_input)
                    .val(_left); // Не забываем добавить координаты в snipper Y
                _var.urlSpinerX = _top;
                _var.urlSpinerY = _left;
            }
        }
    };
})();
// ==============================================
// ==============================================
// Модуль который определяет все опции Slide
// ==============================================
var slideMode = (function() {
    return {
        optionOpacity: {
            range: "min",
            value: 100,
            min: 0,
            max: 100,
            slide: function(e, ui) {
                var opacity = ui.value,
                    _length = opacity.toString()
                    .length;
                if (_length < 2) {
                    opacity = ".0" + opacity;
                } else if (_length === 3) {
                    opacity = ui.value;
                } else {
                    opacity = '.' + opacity;
                }

                $(_var.drag_div)
                    .css({
                        'opacity': opacity
                    });
                _var.urlOpacity = opacity;
            }
        }
    };
})();
// ==============================================
// ==============================================
// Основной модуель нашего приложения App
// ==============================================
var app = (function() {
    return {
        rememberHtml: '', // В этой переменной мы будем хранить html картинки из singleMode
        flagMode: 'single', // По умолчанию, включен режим single mode
        // Инициализация
        initialize: function() {
            fileUpload.fileUp("#fileupload"); // При загрузке страницу нужно запустить наш file upload
            // При первом запуске нужно задизейблить возможность загружать вотермарк до того как мы не загрузим основную
            $('#waterupload')
                .attr('disabled', 'disabled')
                .parent()
                .addClass('disable');
            app.singleMode(); // Запускаем функцию single mode
            $(_var.slider_div)
                .slider(slideMode.optionOpacity); // Запускаем слайдер и указываем опции из вышенаписанного модуля
            this.setUpListeners(); // Запускаем прослушку событий
        },
        // Подключаем прослушку событий
        setUpListeners: function() {
            $(_var.cell_div)
                .on('click', app.cellPosition); // Если мы нажнем на блоки для позиционирования
            $(_var.cancel_btn)
                .on('click', app.cancelMode); // При нажатие на кнопку cancel

            $(_var.ico_div)
                .on('click', app.changeMode); // Если мы меняем режимы
            $(_var.download_btn)
                .on('click', app.downloadMode);

            $(_var.snipperX_input)
                .on('keypress', app.keyPressNumber); // Запрещаем вводить буквы в один инпут по Х
            $(_var.snipperY_input)
                .on('keypress', app.keyPressNumber); // Запрещаем вводить буквы в другой инпут по Y

        },
        keyPressNumber: function(e) {
            //обрабатываются событие надатие клавиши, узнаетеся ее код и сравнивается, оно или не оно, в случае когда это не цифры возвращаем false
            if (e.which > 57 || e.which < 48) {
                return false;
            }
        },
        changeMode: function() {
            // Только если загружены обе картинки, мы позволим переключиться на другой режим
            if (_var.uploadFile && _var.uploadWatermark) {
                // Если был включен режим single то му переходим в режим multiple
                if (app.flagMode === 'single') {
                    app.flagMode = 'multiple'; // Вначале мы меняем флаг на multiple
                    $(_var.ico_div)
                        .removeClass('active'); // Со всех икнок которые отвечают за смену режима, убераем класс active
                    $(_var.multiple_ico)
                        .addClass('active'); // Добавляем на иконку multiple
                    $(_var.boxPosition_div)
                        .removeClass('landscape')
                        .addClass('multiplace'); // Для того что бы в блок с cell перестал работать и в нем появилась границы между картинками, вначале удаляем стиль, потом добавляем другой
                    app.destroySpinner(); // Разрушаем зависимости
                    app.multipleMode(); // Запускаем функции что бы картинка замостила всю рабочую область
                    app.dragPositionStop(); // Устанавливаем границы в рамках которог можем двигать блок с картинками
                    $(_var.snipperX_input)
                        .spinner(spinnerMode.optionMultipleX); // Запускаем другой спинер с другими опциями
                    $(_var.snipperY_input)
                        .spinner(spinnerMode.optionMultipleY); // Запускаем другой спинер с другими опциями
                } else { // Если же режим был multiple, то тогда переходим в сингл
                    app.flagMode = 'single'; // Вначале мы меняем флаг на single
                    $(_var.ico_div)
                        .removeClass('active'); // Со всех икнок которые отвечают за смену режима, убераем класс active
                    $(_var.single_ico)
                        .addClass('active'); // Добавляем на иконку single
                    $(_var.boxPosition_div)
                        .removeClass('multiplace')
                        .addClass('landscape'); //Меняем блок позишин на возможность позиционировать
                    app.destroyDrag(); // Разрушаем зависимости
                    app.destroySpinner(); // Разрушаем зависимости
                    app.backOnePic(); // Запускаем функцию в которыой есть условия одной картинки
                    app.positionImg(); // Позиционируем картинку относительно блока
                    app.singleMode(); // Врубаем функции которые есть только в single Mode
                }
            }
        },
        // Все это функции запускаются только когда есть режим single mode
        singleMode: function() {
            $(_var.snipperX_input)
                .spinner(spinnerMode.optionX);
            $(_var.snipperY_input)
                .spinner(spinnerMode.optionY);
            $(_var.drag_div)
                .draggable(dragMode.option);
        },
        // Когда включается режим multiple mode нам надо посчитать что где и как, что бы правильно все расположить
        multipleMode: function() {
            var $parentWrap = $(_var.waterMarkUpload_div),
                widthWrap = $parentWrap.width(),
                heightWrap = $parentWrap.height(),
                $dragBlock = $(_var.drag_div),
                imgDrop = $dragBlock.find('img'),
                widthImg = imgDrop.width(),
                heightImg = imgDrop.height(),
                countWidth = Math.ceil(widthWrap / widthImg) * 2,
                countHeight = Math.ceil(heightWrap / heightImg) * 2,
                widthIncrease = countWidth * widthImg,
                heightIncrease = countHeight * heightImg,
                html = ''; // в переменную html мы забиваем все то что потом вставим в #drag
            for (var i = 0; i < countHeight; i++) { // Циклом пробегаемся создавая каждую строку
                html += '<div class="row">';
                for (var c = 0; c < countWidth; c++) { // Здесь циклом пробегаемся и создаем каждую картинку
                    html += '<img src="' + _var.urlWatermark + '">';
                }
                html += '</div>'; // Закрываем див и снова!
            }
            $dragBlock
                .empty()
                .html(html)
                .css({
                    'width': widthIncrease + 'px',
                    'height': heightIncrease + 'px'
                })
                .position({
                    my: 'left top',
                    at: 'left top',
                    of: _var.fileUpload_div,
                    collision: "none"
                });
            _var.widthWatermark = widthIncrease; // Присваиваем глобальным переменным что бы потом знать их оригинальные значения
            _var.heightWatermark = heightIncrease; // Присваиваем глобальным переменным что бы потом знать их оригинальные значения
        },
        // Это нам нужно что бы разрушить все зависимости и связи с spinner и потом мы могли создать новые
        destroySpinner: function() {
            $(_var.snipperX_input)
                .spinner("destroy");
            $(_var.snipperY_input)
                .spinner("destroy");
        },
        // Это нам нужно что бы разрушить все зависимости и связи с draggle и потом мы могли создать новые
        destroyDrag: function() {
            $(_var.drag_div)
                .draggable("destroy")
                .css({
                    'top': '0',
                    'left': '0',
                    'width': 'auto',
                    'height': 'auto'
                });
        },
        // Есть некоторые хитрости по разрушеню перемещаймой картинки поэтому пришлось создать дополнителоьное условие где мы сбрасываем все настройки
        destroyDragImgCss: function() {
            $(_var.drag_div)
                .css({
                    'top': '0',
                    'left': '0',
                    'width': 'auto',
                    'height': 'auto'
                })
                .find('img')
                .css({
                    'margin': '0'
                });
            if (app.flagMode != 'single') {
                app.multipleMode();
                app.dragPositionStop();
            }
        },
        // Разрушаем в Multiple все зависимости
        destroyBoxPosition: function() {
            $(_var.boxPosition_div)
                .find('.after')
                .css({
                    'width': '1px',
                    'margin-left': '0'
                });
            $(_var.boxPosition_div)
                .find('.before')
                .css({
                    'height': '1px',
                    'margin-top': '0'
                });
        },
        // Отвечает за поцизианирование элементов в области при нажатие на элемент cell
        cellPosition: function() {
            if (app.flagMode === 'single') {
                var _this = $(this),
                    $cellBlock = $(_var.cell_div),
                    $dragBlock = $(_var.drag_div),
                    $waterBlock = $(_var.waterMarkUpload_div),
                    $inputX = $(_var.snipperX_input),
                    $inputY = $(_var.snipperY_input),
                    positionX = _this.attr('data-position-X'),
                    positionY = _this.attr('data-position-Y');
                $cellBlock.removeClass('active');
                _this.addClass('active');
                $dragBlock.position({
                    my: positionX + " " + positionY,
                    at: positionX + " " + positionY,
                    of: _var.waterMarkUpload_div,
                    collision: "none"
                });
                var valX = $dragBlock.offset()
                    .top - $waterBlock.offset()
                    .top,
                    valY = $dragBlock.offset()
                    .left - $waterBlock.offset()
                    .left;
                $inputX.val(valX);
                $inputY.val(valY);
            } else {
                return false;
            }
        },
        positionImg: function() {
            var $fileUpload = $(_var.fileUpload_div),
                $waterMark = $(_var.waterMarkUpload_div),
                widthBlock = $fileUpload.find('img')
                .width(),
                heightBlock = $fileUpload.find('img')
                .height();

            $fileUpload.css({
                    'width': widthBlock,
                    'height': heightBlock
                })
                .position({
                    my: 'center center',
                    at: 'center center',
                    of: _var.picBlock_div,
                    collision: "none"
                });

            $waterMark.css({
                    'width': widthBlock,
                    'height': heightBlock
                })
                .position({
                    my: 'center center',
                    at: 'center center',
                    of: _var.picBlock_div,
                    collision: "none"
                });
        },
        backOnePic: function() {
            var $dragBlock = $(_var.drag_div), // Драгбл блок
                rememberHtml = '<img src="' + _var.urlWatermark +
                '">'; // Возвращаем одну картинку
            $dragBlock
                .css({
                    'top': '0', // Сбрасываем значения ТОП
                    'left': '0' // Значения по left
                })
                .empty() // обязательно очищаем блок от всего внутри
                .html(rememberHtml); // вставляем нашу картинку
            app.destroyBoxPosition(); // Обязательно сбрасываем все значения в бокс позишен
        },
        cancelMode: function() {
            $(_var.snipperX_input)
                .spinner("value", 0); // Ставим значение на ноль
            $(_var.snipperY_input)
                .spinner("value", 0); // Ставим значение на ноль
            app.destroyBoxPosition(); // В бокс-позишен все сбрасываем
            app.destroyDragImgCss(); // Запускаем обнуление по перемещению картинка
            $(_var.slider_div)
                .slider(slideMode.optionOpacity); // Запускаем слайдер и тем самым он сбрасывается на ноль
            $(_var.cell_div)
                .removeClass('active'); // Удаляем у блока позишин и его квадратиков класс актив
            $(_var.drag_div)
                .css('opacity', '1'); // Выставляем опасити 1 если этого не случилось
        },
        dragPositionStop: function() {
            var $fileUpload = $(_var.fileUpload_div),
                offsetLeft = $fileUpload.offset()
                .left,
                offsetTop = $fileUpload.offset()
                .top,
                fileWidth = $fileUpload.width(),
                fileHeight = $fileUpload.height(),
                $dragBlock = $(_var.drag_div),
                dragWidth = $dragBlock.width(),
                dragHeight = $dragBlock.height(),
                x1 = (offsetLeft + fileWidth) - dragWidth,
                y1 = -(dragHeight - (offsetTop + fileHeight)),
                x2 = offsetLeft,
                y2 = offsetTop,
                arrayPosition = [x1, y1, x2, y2];
            $(_var.drag_div)
                .draggable('destroy');
            $(_var.drag_div)
                .draggable({
                    containment: arrayPosition,
                    scroll: false
                });
        },
        downloadMode: function(e) {
            e.preventDefault();

            var arrayPosition = [],
                arrayFinal = {},
                urlFile = '/php/watermark.php';

            if (app.flagMode === 'multiple') {
                $(_var.drag_div)
                    .find('.row')
                    .each(function(index) {
                        var img,
                            arrayImg = [];
                        $(this)
                            .find('img')
                            .each(function(index) {
                                var top = $(this).offset().top - $(_var.fileUpload_div).offset().top,
                                    left = $(this).offset().left - $(_var.fileUpload_div).offset().left;
                                img = {
                                    'top': top,
                                    'left': left
                                };
                                arrayImg[index] = img;
                            });
                        arrayPosition[index] = arrayImg;
                    });
            } else {
                arrayPosition[0] = {
                    'top': _var.urlSpinerX,
                    'left': _var.urlSpinerY
                };
            }

            arrayFinal = {
                'big_photo': _var.urlFileUpload,
                'watermark': _var.urlWatermark,
                'opacity': _var.urlOpacity,
                'flag': app.flagMode,
                'coords': arrayPosition
            };


            // FIX by Anton Golomazov
            $.download = function (url, data, method) {
                //url and data options required
                if (url && data) {
                    //data can be string of parameters or array/object
                    data = typeof data == 'string' ? data : jQuery.param(data);
                    //split params into form inputs
                    var inputs = '';
                    jQuery.each(data.split('&'), function () {
                        var pair = this.split('=');
                        inputs += '<input type="hidden" name="' + pair[0] + '" value="' + pair[1] + '" />';
                    });
                    //send request
                    jQuery('<form action="' + url + '" method="' + (method || 'post') + '">' + inputs + '</form>')
                        .appendTo('body').submit().remove();
                }

            };
            
            $.ajax({
                type: "POST",
                url: urlFile,
                data: arrayFinal,
                dataType: 'JSON',
                success: function(data) {
                    console.log(data)
                    // Если все ОК - скачиваем файл
                    if(data.status == "OK"){
                        $.download('/php/download.php', 'filename=' + data.url);
                    }

                }
            });
        }
    };
})();
app.initialize();