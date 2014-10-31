(function() {

  window.xfrm = function xfrm(el, xlatX, xlatY, scale, rot) {
    xlatX = typeof xlatX === 'undefined' ? 0 : xlatX;
    xlatY = typeof xlatY === 'undefined' ? 0 : xlatY;
    scale = typeof scale === 'undefined' ? 1 : scale;
    rot   = typeof rot === 'undefined' ? 0 : rot;
    var xfrm =
      'translate3d(' + xlatX + 'px, ' + xlatY + 'px, 0px) ' +
      'scale3d(' + scale + ', ' + scale + ', 1) ' +
      'rotate(' + rot + 'deg)';
    el.style.mozTransform =
    el.style.msTransform =
    el.style.webkitTransform =
    el.style.transform = xfrm;
  };

  var pidx = -1;
  var idx = 0;
  var startColor = '1194e7';
  var endColor = '00ffba';
  window.slides = [];
  window.presoSpring = new rebound.SpringSystem().createSpring(7, 4);

  var renderSlide = function(i, prog, appearing, bck) {
    var slide = slides[i];
    if (!slide) {
      return;
    }

    var lowClamped = Math.max(0, prog);
    var clamped = Math.min(1, lowClamped);
    var rot = -15;


    slide.style.visibility = 'visible';

    if (bck) {
      if (appearing) {
        prog = 1 - prog;
        var x = prog * -window.innerWidth / 1.5;
        var y = prog * -window.innerHeight;
        var r = prog * rot
        xfrm(slide, 0, y, 1, 0);
        slide.style.opacity = 1;
      } else {
        var scale = rebound.util.mapValueInRange(lowClamped, 1, 0, 0.75, 1);
        xfrm(slide, 0, 0, scale, 0);
        slide.style.opacity = 1 - clamped;
      }
    } else {
      if (appearing) {
        var scale = rebound.util.mapValueInRange(lowClamped, 0, 1, 0.75, 1);
        xfrm(slide, 0, 0, scale, 0);
        slide.style.opacity = clamped;
      } else {
        var x = prog * -window.innerWidth;
        var y = prog * -window.innerHeight;
        var r = prog * rot
        xfrm(slide, 0, y, 1, 0);
      }
    }
  };

  var hideSlide = function(i) {
    var slide = slides[i];
    if (slide) {
      slide.style.opacity = 0;
    }
  }

  var presoSpringListener = {
    onSpringUpdate: function(s) {
      var val = s.getCurrentValue();
      var end = s.getEndValue();
      var bck = pidx > idx ? true : false;
      for (var i = 0, len = slides.length; i < len; i++) {
        if (i === idx || i === pidx) {
          var prog = rebound.util.mapValueInRange(val, pidx, idx, 0, 1);
          renderSlide(
            i,
            prog,
            i === idx, /* appearing */
            bck /* reverse */
          );
        } else {
          hideSlide(i);
        }
      }
      var c = rebound.util.interpolateColor(val, startColor, endColor, 0, slides.length - 1);
      console.log(c);
      document.body.style.background = c;
    }
  };

  window.next = function() {
    if (idx === slides.length - 1) {
      return;
    }
    pidx=idx;
    idx+=1;
    presoSpring.setEndValue(idx);
  };

  window.prev = function() {
    if (idx === 0) {
      return;
    }
    pidx=idx;
    idx-=1;
    presoSpring.setEndValue(idx);
  };

  document.addEventListener('keydown', function(e) {
    console.log(e.keyCode);
    switch (e.keyCode) {
      case 32:
      case 110:
      case 39:
        next();
        break;
      case 112:
      case 37:
      case 80:
        prev();
        break;
    }
    e.preventDefault();
  });

  document.addEventListener('click', function(e) {
    next();
  });

  document.addEventListener('DOMContentLoaded', function() {
    slides = document.getElementsByClassName('slide');
    for (var i = 0; i < slides.length; i++) {
      slides[i].style.zIndex = slides.length - i;
    }
    presoSpring.addListener(presoSpringListener);
    presoSpring.setCurrentValue(0);
  });

})();
