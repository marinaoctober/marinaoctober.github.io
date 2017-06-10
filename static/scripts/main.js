xsMain = [0.145, 0.227, 0.309, 0.390, 0.470, 0.549, 0.629, 0.710, 0.789, 0.870, 0.950]
ysMain = [0.224, 0.284, 0.354, 0.414, 0.473, 0.532, 0.590, 0.652, 0.712, 0.769, 0.828]
elementsMain = [
  ['Водород', '*', '*', '*', '*', '*', '*', 'Гелий', '*', '*'],
  ['Литий', 'Бериллий', 'Бор', 'Углерод', 'Азот', 'Кислород', 'Фтор', 'Неон', '*', '*'],
  ['Натрий', 'Магний', 'Алюминий', 'Кремний', 'Фосфор', 'Сера', 'Хлор', 'Аргон', '*', '*'],
  ['Калий', 'Кальций', 'Скандий', 'Титан', 'Ванадий', 'Хром', 'Марганец', 'Железо', 'Кобальт', 'Никель'],
  ['Медь', 'Цинк', 'Галлий', 'Германий', 'Мышьяк', 'Селен', 'Бром', 'Криптон', '*', '*'],
  ['Рубидий', 'Стронций', 'Иттрий', 'Цирконий', 'Ниобий', 'Молибден', 'Технеций', 'Рутений', 'Родий', 'Паладий'],
  ['Серебро', 'Кадмий', 'Индий', 'Олово', 'Сурьма', 'Теллур', 'Йод', 'Ксенон', '*', '*'],
  ['Цезий', 'Барий', 'Лантан', 'Гафний', 'Тантал', 'Вольфрам', 'Рений', 'Осмий', 'Иридий', 'Платина'],
  ['Золото', 'Ртуть', 'Таллий', 'Свинец', 'Висмут', 'Полоний', 'Астат', 'Радон', '*', '*'],
  ['Франций', 'Радий', 'Актиний', 'Резерфордий', 'Дубний', 'Сиборгий', 'Борий', 'Гасий', 'Мейтрений', 'Дармштадтий']
]

xsDown = [0.149, 0.207, 0.264, 0.320, 0.389, 0.435, 0.493, 0.550, 0.607, 0.664, 0.721, 0.779, 0.835, 0.893, 0.950]
ysDown = [0.873, 0.915, 0.957]
elementsDown = [
  ['Церий', 'Празеодим', 'Неодим', 'Прометий', 'Самарий', 'Европий', 'Галидоний', 'Тербий', 'Диспрозий',
  'Гольмий', 'Эрбий', 'Тулий', 'Иттербий', 'Лютеций'],
  ['Торий', 'Протактиний', 'Уран', 'Нептуний', 'Плутоний', 'Америций', 'Кюрий', 'Берклий', 'Калифорний',
  'Эйнштейний', 'Фермий', 'Менделевий', 'Нобелий', 'Лоуренсий']
]

shaderInactive = "shaderInactive"
shaderActive = "shaderActive"

const findElement = function(x, y, xs, ys, elements) {
  for (let i = 1; i < xs.length; i++) {
    for (let j = 1; j < ys.length; j++) {
      if (x >= xs[i - 1] && x < xs[i] && y >= ys[j - 1] && y < ys[j]) {
        return elements[j - 1][i - 1]
      }
    }
  }
  return false
}

const chooseElement = function(x, y) {
  return findElement(x, y, xsMain, ysMain, elementsMain) ||
    findElement(x, y, xsDown, ysDown, elementsDown) ||
    "*"
}

chooseMultipleState = false;
chosenElems = new Set()
elemToDiv = new Map()

const drawShaders = function(xs, ys, elements) {
  let table = $('.table')
  let tableContainer = document.getElementsByClassName("tableContainer")[0]
  console.log(table.width(), table.height())
  for (let i = 1; i < xs.length; i++) {
    for (let j = 1; j < ys.length; j++) {
      let newdiv = document.createElement("div")
      elemToDiv.set(elements[j - 1][i - 1], newdiv)
      newdiv.className = shaderInactive
      newdiv.style.position = "absolute"
      offset = table.offset()
      width = table.width()
      height = table.height()
      newdiv.style.top = offset.top + ys[j - 1] * height
      newdiv.style.left = offset.left + xs[i - 1] * width
      newdiv.style.width = (xs[i] - xs[i - 1]) * width
      newdiv.style.height = (ys[j] - ys[j - 1]) * height
      tableContainer.appendChild(newdiv)
    }
  }
}

const addShaders = function() {
  drawShaders(xsMain, ysMain, elementsMain)
  drawShaders(xsDown, ysDown, elementsDown)
}

$(document).ready(function(){
  $('.table').click(function (ev) {
    const $div = $(ev.target);
    const offset = $div.offset();
    let x = ev.clientX - offset.left;
    let y = ev.clientY - offset.top;
    height = $div.height()
    width = $div.width()
    x /= width
    y /= height

    elem = chooseElement(x, y)
    if (elem != "*") {
      if (chooseMultipleState) {
        if (chosenElems.has(elem)) {
          elemToDiv.get(elem).className = shaderInactive
          chosenElems.delete(elem)
        } else {
          elemToDiv.get(elem).className = shaderActive
          chosenElems.add(elem)
        }
        console.log(chosenElems)
      } else {
        window.location.href = "/show?element=" + elem;
      }
    }
    console.log('x: ' + x + ', y: ' + y + ', elem' + chooseElement(x, y));
  });

  $('.button').click(function() {
    if (chooseMultipleState == false) {
      chooseMultipleState = true
      chosenElems = new Set()
      $('.button').html('Открыть несколько')
    } else {
      window.location.href = "/show?element=" + Array.from(chosenElems).join()
      chooseMultipleState = false
      $('.button').html('Выбрать несколько')
    }
  })
});

$(window).on('load', function(){
  addShaders()
})
