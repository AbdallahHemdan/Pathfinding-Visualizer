let app = (function () {
  const initializeTheBoard = () => Grid.initTheGrid(40, 15);

  const findPath = () => {
    let path = AStar.findPath(Grid.outputGridAs2DArray());
    if (path) {
      Grid.walkOverPath(path);
    } else {
      startNoPathOverLay();
    }
  };

  const findPathWithCustomSpeed = speed => {
    switch (speed) {
      case 'Fast':
        Grid.walkFast();
        findPath();
        console.log(`fast`);
        break;
      case 'Medium':
      default:
        Grid.walkMedium();
        findPath();
        console.log(`Medium`);
        break;
      case 'Slow':
        Grid.walkSlow();
        findPath();
        console.log(`Slow`);
        break;
    }
  };

  const launch = () => {
    initializeTheBoard();
    startFirstOverLay();
    typeWriter();
  };

  /**
   * Overlay effect
   */
  async function startFirstOverLay() {
    document.getElementById('overlay-1').style.display = 'block';
    randomizeEffect();
    await sleep(3200);
    endFirstOverLay();
    startOnClickOverLay();
  }

  const endFirstOverLay = () => {
    document.getElementById('overlay-1').style.display = 'none';
    randomizeEffect();
  };

  async function startNoPathOverLay() {
    document.getElementById('overlay-2').style.display = 'block';
    await sleep(4000);
    endNoPathOverLay();
  }

  const endNoPathOverLay = () => {
    document.getElementById('overlay-2').style.display = 'none';
  };

  const startOnClickOverLay = () => {
    document.getElementById('overlay-3').style.display = 'block';
    randomizeEffect();
  };

  const endClickOverLay = () => {
    document.getElementById('overlay-3').style.display = 'none';
    randomizeEffect();
  };

  /**
   * Randomize effect
   */
  const randomizeEffect = () => {
    let countOfRandomizeIterations = 120;
    while (countOfRandomizeIterations--) {
      setTimeout(function () {
        Grid.randomizeObstacles();
      }, 5);
    }
  };

  const typeWriter = () => {
    let elements = document.getElementsByClassName('typewrite');
    for (let i = 0; i < elements.length; i++) {
      let toRotate = elements[i].getAttribute('data-type');
      let period = elements[i].getAttribute('data-period');
      if (toRotate) {
        new TxtType(elements[i], JSON.parse(toRotate), period);
      }
    }

    // Inject CSS
    let css = document.createElement('style');
    css.type = 'text/css';
    css.innerHTML = '.typewrite > .wrap { border-right: 0.08em solid #fff}';
    document.body.appendChild(css);
  };

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  /**
   * Public Interface
   */
  return {
    launch: launch,
    findPath: findPath,
    findPathWithCustomSpeed: findPathWithCustomSpeed,
    endFirstOverLay: endFirstOverLay,
    startNoPathOverLay: startNoPathOverLay,
    endNoPathOverLay: endNoPathOverLay,
    endClickOverLay: endClickOverLay,
  };
})();

// Type-Writer Effect
class TxtType {
  constructor(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
  }
  tick() {
    let i = this.loopNum % this.toRotate.length;
    let fullTxt = this.toRotate[i];

    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';
    let that = this;
    let delta = 200 - Math.random() * 100;
    if (this.isDeleting) {
      delta /= 2;
    }

    if (!this.isDeleting && this.txt === fullTxt) {
      delta = this.period;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.loopNum++;
      delta = 500;
    }

    setTimeout(() => that.tick(), delta / 2);
  }
}
