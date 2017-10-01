//Определяем ID активного элемента меню на данной странице
var activeID = $('.second-menu.active').attr( 'id');
var activeLink = $('.top-menu .active a').attr('id');

// Действия при наведении на ссылку меню первого уровня
$('.top-menu-link').mouseenter(function(){
  //Скрываем активное меню второго уровня
  $('.second-menu').removeClass('active');
  // Удаляем класс hover у всех элементов меню первого уровня
  $('.top-menu li').removeClass('hover');
  // Добавляем класс hover родителю элемента, на который наведен курсор
  $(this).parent().addClass('hover');
  // Скрываем все меню второго уровня
  $('.second-menu').removeClass('hover');
  //Выясняем какое второе меню открыть (указано в data-target)
  var attr = $(this).attr('data-target');
  //Показываем необходимое меню второго уровня
  $(attr).addClass('hover'); 
});


// Действия при вывода курсора со ссылки меню первого уровня
$('.top-menu-link').mouseleave(function(event){
  // Запись в переменную ID второго уровня,  связанного с элементом меню 
  var thisID = $(this).attr('data-target');
  // Сбор ID элемента, на который перешел курсор
  toElement = event.relatedTarget;
  toElementParent = $(toElement).parent().parent().attr('id');
  toElementParentID = '#' + toElementParent;
  // Если нужный ID не совпадает с тем, на который перешел курсор, то невозвращаем активный елемент и второй уровень
  if (toElementParentID != thisID) {
    // Удаляем селектор hover с родителя текушего элемента
    $(this).parent().removeClass('hover');
    // Возвращаем активным элемент текущей страницы
    $('#' + activeLink).parent().addClass('hover');
    //Скрываем все меню второго уровня
    $('.second-menu').removeClass('hover');
    // показываем первоночальное меню второго уровня
    $('#' + activeID).addClass('active');
  }
});

// Действия когда курсор уходит с блока меню второго уровня
$('.second-menu').mouseleave(function(event){
  thisBlockID = $(this).attr('id');
  toElementClass = event.relatedTarget;
  if ( !$(toElementClass).hasClass("top-menu-link") ) {
    // Удаляем селектор hover с родителей элементов меню первого уровня
    $(".top-menu-link").parent().removeClass('hover');
    // Возвращаем активным элемент текущей страницы
    $('#' + activeLink).parent().addClass('hover');
    //Скрываем все меню второго уровня
    $('.second-menu').removeClass('hover');
    // показываем первоночальное меню второго уровня
    $('#' + activeID).addClass('active');
  }
});