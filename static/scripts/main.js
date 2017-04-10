$(document).ready(function(){
  $( window ).resize(function() {
    console.log($(window).height() + " " + $(window).width() );
  });

  $('.clickable').bind('click', function (ev) {
      const $div = $(ev.target);

      const offset = $div.offset();
      let x = ev.clientX - offset.left;
      let y = ev.clientY - offset.top;
      ratio = 3543 / 2657
      console.log($(window).height())
      height = $(window).height()
      width = height * ratio
      x /= width
      y /= height


      const chooseElement = function(x, y) {
        xs = [0.145, 0.227]
        ys = [0.224, 0.284, 0.354, 0.414, 0.473, 0.532, 0.590, 0.652, 0.712, 0.769, 0.828]
        elements = [
          ['Водород'],
          ['Литий'],
          ['Натрий'],
          ['Калий'],
          ['Медь'],
          ['Рубидий'],
          ['Серебро'],
          ['Цезий'],
          ['Золото'],
          ['Франций']

        ]
        for (let i = 1; i < xs.length; i++) {
          for (let j = 1; j < ys.length; j++) {
            if (x >= xs[i - 1] && x < xs[i] && y >= ys[j - 1] && y < ys[j]) {
              if (!elements[j - 1][i - 1]) {
                return 'Не выбрано'
              } else {
                return elements[j - 1][i - 1]
              }
            }
          }
        }
        return 'Не выбрано'
      }

      elem = chooseElement(x, y)
      window.location.href = "/show?element=" + elem;
      console.log('x: ' + x + ', y: ' + y + ', elem' + chooseElement(x, y));
  });
});
