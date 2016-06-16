function getBlueprint(centerPoint, lineSpace){
    var lines = new Group();
    var centerPoint =  centerPoint % lineSpace;

    // Vertical lines
    for(var i = centerPoint.x; i <= view.size.width; i += lineSpace){
        var fromPoint = new Point(i, 0);
        var toPoint = new Point(i, view.size.height);
        var line = new Path.Line(fromPoint, toPoint, 10);
        lines.addChild(line);
    }
    // Horizontal lines
    for(var i = centerPoint.y; i <= view.size.height; i += lineSpace){
        var fromPoint = new Point(0, i);
        var toPoint = new Point(view.size.width, i);
        var line = new Path.Line(fromPoint, toPoint, 10);
        lines.addChild(line);
    }

    return lines;
}

function getLogo(centerPoint, sideSize){
    var logoSize = new Size(sideSize, sideSize);
    var leftTopCorner = new Point(centerPoint - logoSize / 2);
    var logo = new Group();
    logo.addChild(new Path.Rectangle(leftTopCorner, logoSize / 3));
    logo.addChild(new Path.Rectangle(leftTopCorner + [0, 2 / 3 * sideSize], logoSize / 3));
    var armPath = new Path();
    armPath.add(new Point(leftTopCorner + [sideSize / 3, sideSize / 2]));
    armPath.add(new Point(leftTopCorner + [2 / 3 * sideSize, 0]));
    armPath.add(new Point(leftTopCorner + [sideSize, 0]));
    armPath.add(new Point(leftTopCorner + [2 / 3 * sideSize, sideSize / 2]));
    armPath.add(new Point(leftTopCorner + logoSize));
    armPath.add(new Point(leftTopCorner + [2 / 3 * sideSize, sideSize]));
    armPath.closed = true;
    logo.addChild(armPath);
    return logo;
}   

function getConstructionLines(group){
    var resultGroup = new Group();
    var currentSegment;
    var currentPoint;
    for(var i = 0; i < group.children.length; i++){
        for(var j = 0; j < group.children[i].segments.length; j++){
            currentSegment = group.children[i].segments[j];
            currentPoint = currentSegment.point;
            resultGroup.addChild(makeMultipleLines(currentPoint, projectToAll(currentPoint)));
        }
    }
    return resultGroup;
}

function makeMultipleLines(startPoint, arrayOfEndPoints){
    var lines = new Group();
    for(var i = 0; i < arrayOfEndPoints.length; i++){
        lines.addChild(new Path.Line(startPoint, arrayOfEndPoints[i]));
    }
    return lines;
}

function projectToAll(point){
    var projectedPoint = [
        projectToRight(point),
        projectToLeft(point),
        projectToTop(point),
        projectToBottom(point)
    ];
    return projectedPoint;
}

function projectToRight(point){
    return new Point(view.size.width,point.y);
}

function projectToLeft(point){
    return new Point(0, point.y);
}

function projectToTop(point){
  return new Point(point.x, 0);
}

function projectToBottom(point){
  return new Point(point.x, view.size.height);
}

lastCenterPoint = view.center;

function onResize(event){
    view.scrollBy(lastCenterPoint.subtract(view.center));
    lastCenterPoint = view.center;
}

var maxLineSpace = 100;
var stepNumber = 2;
var blueprint = new Group();
for(var i = 0; i < stepNumber; i++){
    var step = (i + 1) / stepNumber;
    blueprint.addChild(getBlueprint(lastCenterPoint, maxLineSpace * step));
}

var mainColor = new Color('#BED4E9');
blueprint.strokeColor = mainColor;
blueprint.blendMode = 'lighter';
blueprint.opacity = 0.25;

var logo = getLogo(lastCenterPoint, 600);
logo.strokeColor = mainColor;
logo.opacity = 0;
logo.strokeWidth = 3;

var constructLines = getConstructionLines(logo);
constructLines.strokeColor = mainColor;
constructLines.dashArray = [10, 50]

function onFrame(event){
    constructLines.opacity *= 0.99;
    logo.opacity = 1 - constructLines.opacity;

    // if(logo.opacity >= 0.9) {
    //     blueprint.opacity *= 0.99;
    // }
}