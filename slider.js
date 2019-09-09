function drag () {

  var slider = document.getElementsByClassName("slider")[0];
  var range = document.getElementsByClassName("range")[0];
  var handle1 = document.getElementsByClassName("handle")[0];
  var handle2 = document.getElementsByClassName("handle")[1];

  var handle2Left = parseInt(handle2.style.left);
  var handle1Left = parseInt(handle1.style.left);

  var data = {
    tactile : false,
    dualInput : false,
    width: 500,
    minPrice : 0,
    maxPrice : 0,
    initPrice1 : parseInt(handle1.classList[1].split('-')[1]),
    initPrice2 : parseInt(handle2.classList[1].split('-')[1]),
  }

  var actualPrice1;
  var actualPrice2;

  var handleWidth = data.width * 0.05

  function pixelToPrice(left) {
    return Math.round(left * data.maxPrice / (data.width - handleWidth));
  }

  function sliderClass () {
    for(var i = 1; i < slider.classList.length; i++) {
      wclass = slider.classList[i].split('-');

      switch (wclass[0]) {
        case 'dualInput':
          data.dualInput = wclass[1];
          break;

        case 'm$':
          data.minPrice = parseInt(wclass[1]);
          break;

        case 'M$':
          data.maxPrice = parseInt(wclass[1]);
          break;

        default:
          console.log('Class name not supported : ' + wclass.join('-'))
      }
    }
  }

  function getClient (event) {
    var x = event.clientX;
    return x - handleWidth;
  }

  function getClientTactile (event) {
    var x = event.touches[0].clientX;
    return x - handleWidth;
  }

  function movemove1(x) {
    if (data.dualInput === 'false') {
      range.style.left = x + 'px';
      range.style.width = data.width - x + 'px';

      actualPrice1 = pixelToPrice(handle1Left);
    }

    else if(data.dualInput === 'true') {
      handle2Left = parseInt(handle2.style.left);
      handle1Left = parseInt(handle1.style.left);

      if ((handle1Left >= handle2Left - handleWidth)) {
        handle1.style.left = handle2Left - handleWidth - 1 + 'px';
        handle1Left = parseInt(handle1.style.left);
      }

      range.style.left = handle1Left + handleWidth + 'px';
      range.style.width = handle2Left - handle1Left - handleWidth + 1 + 'px';

      actualPrice1 = pixelToPrice(handle1Left);
      actualPrice2 = pixelToPrice(handle2Left);
    }
  }

  function movemove2() {
    handle2Left = parseInt(handle2.style.left);
    handle1Left = parseInt(handle1.style.left);

    if ((handle2Left <= handle1Left + handleWidth)) {
      handle2.style.left = handle1Left + handleWidth + 1 + 'px';
      handle2Left = parseInt(handle2.style.left);
    }

    range.style.left = handle1Left + handleWidth + 'px';
    range.style.width = handle2Left - handle1Left - handleWidth + 1 + 'px';

    actualPrice1 = pixelToPrice(handle1Left);
    actualPrice2 = pixelToPrice(handle2Left);
  }

  function move1 (event) {
    var x;

    if (tactile === true) {
      x = getClientTactile(event);
    }
    else {
      x = getClient(event);
    }

    if (x < (data.width - handleWidth) && x > 0) {
      handle1.style.left = x + 'px';

      movemove1(x);
    }

    else if (x > (data.width - handleWidth)) {
      x = data.width - handleWidth;
      handle1.style.left = x + 'px';

      movemove1(x);
    }

    else if (x < 0) {
      x = 0;
      handle1.style.left = 0 + 'px';

      movemove1(x);
    }
  }

  function move2 (event) {
    var x;

    if (tactile === true) {
      x = getClientTactile(event);
    }
    else {
      x = getClient(event);
    }

    if (x <= (data.width - handleWidth) && x > 0) {
      handle2.style.left = x + 'px';

      movemove2();
    }

    else if (x > (data.width - handleWidth)) {
      x = data.width - handleWidth;
      handle2.style.left = x + 'px';

      movemove2();
    }

    else if (x < 0) {
      x = 0;
      handle2.style.left = 0 + 'px';

      movemove2();
    }
  }

  function startDraging1 () {
      tactile = false;
      window.addEventListener('mousemove', move1);
  }

  function startDraging2 () {
    tactile = false;
    window.addEventListener('mousemove', move2);
  }

  function startDraging1Tactile () {
    tactile = true;
    window.addEventListener('touchmove', move1);
  }

  function startDraging2Tactile () {
    tactile = true;
    window.addEventListener('touchmove', move2);
  }

  sliderClass();

  handle1.style.left = data.initPrice1 + 'px';

  if (data.dualInput === 'false') {
    handle2.style.display = 'none';

    range.style.width = (data.width - data.initPrice1) + 'px';
    range.style.left = data.initPrice1 + 'px';
  }
  
  else if (data.dualInput === "true") {
    handle2.style.left = data.initPrice2 + 'px';
    range.style.width = data.initPrice2 - data.initPrice1 - handleWidth + 'px';
    range.style.left = data.initPrice1 + handleWidth + 'px';
  }

  handle1.addEventListener('mousedown', startDraging1);
  handle2.addEventListener('mousedown', startDraging2);

  handle1.addEventListener('touchstart', startDraging1Tactile);
  handle2.addEventListener('touchstart', startDraging2Tactile);

  window.addEventListener('mouseup', function () {
    window.removeEventListener('mousemove', move1);
    window.removeEventListener('mousemove', move2);
  });

  window.addEventListener('touchend', function () {
    window.removeEventListener('touchmove', move1);
    window.removeEventListener('touchmove', move2);
  });
  
}