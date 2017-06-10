xsMain = [0.152, 0.233, 0.315, 0.396, 0.477, 0.559, 0.640, 0.721, 0.803, 0.884, 0.965]
ysMain = [0.233, 0.293, 0.354, 0.412, 0.471, 0.530, 0.589, 0.648, 0.708, 0.767, 0.825]
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

xsDown = [0.152, 0.210, 0.269, 0.327, 0.385, 0.443, 0.501, 0.559, 0.615, 0.674, 0.732, 0.792, 0.849, 0.908, 0.965]
ysDown = [0.886, 0.927, 0.969]
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
  let table = $('#table')
  let tableContainer = document.getElementById("tableContainer")
  console.log(table.width(), table.height())
  for (let i = 1; i < xs.length; i++) {
    for (let j = 1; j < ys.length; j++) {
      let newdiv = document.createElement("div")
      elemToDiv.set(elements[j - 1][i - 1], newdiv)
      newdiv.className = shaderInactive
      newdiv.style.position = "absolute"
      offset = table.position()
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
  $('#table').click(function (ev) {
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

  $('#chooseButton').click(function() {
    if (chooseMultipleState == false) {
      chooseMultipleState = true
      chosenElems = new Set()
      $('#chooseButton').html('Открыть несколько')
    } else {
      window.location.href = "/show?element=" + Array.from(chosenElems).join()
      chooseMultipleState = false
      $('#chooseButton').html('Выбрать несколько')
    }
  })
});

$(window).on('load', function(){
  addShaders()
})
