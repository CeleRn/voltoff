require('jquery');

// Действие меню при наведении на пункт главного меню
var activeID = $(".menu__item.active").attr('id');
$('.menu__item').mouseover(function () {
    $('.menu__item').removeClass('active');
}).mouseout(function() {
    $('#' + activeID).addClass('active');
});


//Функция плавное перемещения и открыть Таб "Характеристики" при нажатии на ссылку
$("#link-more-price").click(function(event) {
  //отменяем стандартную обработку нажатия по ссылке
  event.preventDefault();
  //узнаем высоту от начала страницы до блока на который ссылается якорь
  var topTab = $('#price-more').offset().top - 5;
  //анимируем переход на расстояние - top за 1500 мс
  $('body,html').animate({scrollTop: topTab}, 800);
});

$(document).ready(function(){
  // Работа popover
  $('[data-toggle="popover"]').popover()
});