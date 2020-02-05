let App = (function() {
  function initializeTheBoard() {
    Grid.initTheGrid(40, 15);
  }
  function findPath() {
    let path = AStar.findPath(Grid.outputGridAs2DArray());
    if (path) {
      Grid.walkOverPath(path);
    } else {
      startNoPathOverLay();
    }
  }
  function findPathWithCustomSpeed(speed) {
    switch (speed) {
      case "Fast":
        Grid.walkFast();
        findPath();
        console.log(`fast`);
        break;
      case "Medium":
      default:
        Grid.walkMedium();
        findPath();
        console.log(`Medium`);
        break;
      case "Slow":
        Grid.walkSlow();
        findPath();
        console.log(`Slow`);
        break;
    }
  }
  function launch() {
    initializeTheBoard();
    startFirstOverLay();
    typeWriter();
  }
  // overLay effect..
  async function startFirstOverLay() {
    document.getElementById("overlay-1").style.display = "block";
    randomizeEffect();
    await sleep(3200);
    endFirstOverLay();
    startOnClickOverLay();
  }
  function endFirstOverLay() {
    document.getElementById("overlay-1").style.display = "none";
    randomizeEffect();
  }
  async function startNoPathOverLay() {
    document.getElementById("overlay-2").style.display = "block";
    await sleep(4000);
    endNoPathOverLay();
  }
  function endNoPathOverLay() {
    document.getElementById("overlay-2").style.display = "none";
  }
  function startOnClickOverLay() {
    document.getElementById("overlay-3").style.display = "block";
    randomizeEffect();
  }
  function endClickOverLay() {
    document.getElementById("overlay-3").style.display = "none";
    randomizeEffect();
  }
  // Randomize Effect
  function randomizeEffect() {
    let countOfRandomizeIterations = 120;
    while (countOfRandomizeIterations--) {
      setTimeout(function() {
        Grid.randomizeObstacles();
      }, 5);
    }
  }
  function typeWriter() {
    var elements = document.getElementsByClassName("typewrite");
    for (var i = 0; i < elements.length; i++) {
      var toRotate = elements[i].getAttribute("data-type");
      var period = elements[i].getAttribute("data-period");
      if (toRotate) {
        new TxtType(elements[i], JSON.parse(toRotate), period);
      }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
    document.body.appendChild(css);
  }
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  // Public Interface
  return {
    launch: launch,
    findPath: findPath,
    findPathWithCustomSpeed: findPathWithCustomSpeed,
    endFirstOverLay: endFirstOverLay,
    startNoPathOverLay: startNoPathOverLay,
    endNoPathOverLay: endNoPathOverLay,
    endClickOverLay: endClickOverLay
  };
})();

// Type-Writer Effect
class TxtType {
  constructor(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = "";
    this.tick();
    this.isDeleting = false;
  }
  tick() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];
    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }
    this.el.innerHTML = '<span class="wrap">' + this.txt + "</span>";
    var that = this;
    var delta = 200 - Math.random() * 100;
    if (this.isDeleting) {
      delta /= 2;
    }
    if (!this.isDeleting && this.txt === fullTxt) {
      delta = this.period;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === "") {
      this.isDeleting = false;
      this.loopNum++;
      delta = 500;
    }
    setTimeout(function() {
      that.tick();
    }, delta / 2);
  }
}
