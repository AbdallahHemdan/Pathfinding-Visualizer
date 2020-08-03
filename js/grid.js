let Grid = (function () {
  const ZERO = 0;
  let grid;
  let width, height;
  let disableEditing = false;
  let visualizationSpeed = 60;
  let sizeOfNode = 27;
  let mapEnum = {
    empty: ZERO,
    start: 1,
    goal: 2,
    obstacle: 3,
  };

  const initTheGrid = (wid, hei) => {
    grid = document.querySelector('.grid');
    grid.addEventListener('click', function (action) {
      if (action.target.classList.contains('node') && !disableEditing) {
        onNodeClicked(action);
      }
    });
    (width = wid), (height = hei);
    renderTheGrid();
    randomizeObstacles();
  };

  const onNodeClicked = action => {
    let node = action.target;
    let typeOfNode = getTypeOfNode(node);
    let selected = getSelected();

    // If there's a selected node..
    if (selected) {
      unselectSelectedNode();
      if (isStartNode(node) || isTargetNode(node)) {
        if (selected !== node) {
          console.log('Selected Node used');
          selectNode(node);
        }
      } else {
        setTypeToNode(getTypeOfNode(selected), node);
        setTypeToNode('empty', selected);
      }
      return;
    }

    // Check for node type
    if (typeOfNode === 'start' || typeOfNode === 'goal') {
      selectNode(node);
    } else if (typeOfNode === 'obstacle') {
      setTypeToNode('empty', node);
    } else {
      setTypeToNode('obstacle', node);
    }
  };

  const renderTheGrid = () => {
    for (let row = ZERO; row < height; row++) {
      for (let col = ZERO; col < width; col++) {
        let node = document.createElement('div');
        node.className = 'node empty';
        node.id = `${col}-${row}`;
        node.style.width = `${sizeOfNode}px`;
        node.style.height = `${sizeOfNode}px`;
        node.style.top = `${row * sizeOfNode + row + 1}px`;
        node.style.left = `${col * sizeOfNode + col + 1}px`;
        grid.appendChild(node);
      }
    }
    grid.style.width = `${width * sizeOfNode + width + 1}px`;
    grid.style.height = `${height * sizeOfNode + height + 1}px`;

    setTypeToNode(
      'start',
      getNodeByPosition(getRandomNumber(ZERO, ZERO), getRandomNumber(ZERO, ZERO)),
    );
    setTypeToNode(
      'goal',
      getNodeByPosition(
        getRandomNumber(width - 1, width - 1),
        getRandomNumber(height - 1, height - 1),
      ),
    );
  };

  const outputGridAs2DArray = () => {
    let array = [];
    for (let row = ZERO; row < height; row++) {
      array[row] = [];
      for (let col = ZERO; col < width; col++) {
        array[row][col] = mapEnum[getTypeOfNode(getNodeByPosition(col, row))];
      }
    }
    return array;
  };

  const walkOverPath = path => {
    if (disableEditing) return;
    disableEditing = true;
    clearPath();
    unselectSelectedNode();

    path.forEach((pathElement, index) => {
      (function (i) {
        setTimeout(function () {
          setTypeToNode('path', getNodeByPosition(pathElement.x, pathElement.y));
          if (path.length - 1 === i) disableEditing = false;
        }, (i + 1) * visualizationSpeed);
      })(index);
    });
  };

  const clearGridObstaclesAndPaths = () => {
    if (disableEditing) return;
    clearPath();
    grid.querySelectorAll(':not(.start):not(.goal)').forEach(n => {
      setTypeToNode('empty', n);
    });
  };

  const randomizeObstacles = () => {
    if (disableEditing) return;
    clearGridObstaclesAndPaths();
    let noOfObstacles = (width * height) / 5;

    for (let obstacleNo = ZERO; obstacleNo < noOfObstacles; obstacleNo++) {
      let node = getNodeByPosition(
        getRandomNumber(ZERO, width - 1),
        getRandomNumber(ZERO, height - 1),
      );
      if (!isStartNode(node) && !isTargetNode(node)) {
        setTypeToNode('obstacle', node);
      }
    }
  };

  const setTypeToNode = (typeOfNode, node) => {
    if (typeOfNode === 'path') {
      node.classList.add('path');
      return;
    }
    node.className = 'node ' + typeOfNode;
  };

  const isStartNode = node => node.classList.contains('start');

  const isTargetNode = node => node.classList.contains('goal');

  const getTypeOfNode = node => node.classList.item(1);

  const getNodeByPosition = (x, y) => document.getElementById(x + '-' + y);

  const clearPath = () => {
    grid.querySelectorAll('.path').forEach(nodeToClear => {
      nodeToClear.classList.remove('path');
    });
  };

  const selectNode = node => {
    node.classList.add('selected');
  };

  const unselectSelectedNode = () => {
    let node = getSelected();
    if (node) {
      node.classList.remove('selected');
    }
  };

  const getSelected = () => grid.querySelector('.selected');

  const walkFast = () => (visualizationSpeed = 50);

  const walkMedium = () => (visualizationSpeed = 100);

  const walkSlow = () => (visualizationSpeed = 200);

  const getRandomNumber = (from, to) => Math.floor(Math.random() * (to - from + 1)) + from;

  // Public interface
  // Syntax: publicNameOfTheFunction (name to call it) : localFunctionName (actual name)
  return {
    initTheGrid: initTheGrid,
    walkOverPath: walkOverPath,
    randomizeObstacles: randomizeObstacles,
    clearGridObstaclesAndPaths: clearGridObstaclesAndPaths,
    outputGridAs2DArray: outputGridAs2DArray,
    visualizationSpeed: visualizationSpeed,
    walkFast: walkFast,
    walkMedium: walkMedium,
    walkSlow: walkSlow,
  };
})();
