'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var threesixty = function threesixty(container, images, options) {
  if (!container) {
    throw new Error('A container argument is required');
  }

  if (!images) {
    throw new Error('An images argument is required');
  }

  var defaults = {
    interactive: true,
    currentFrame: 0
  };

  var o = Object.assign({}, defaults, options);

  var isTouchSupported = 'ontouchstart' in window;
  var startEvent = isTouchSupported ? 'touchstart' : 'mousedown';
  var stopEvent = isTouchSupported ? 'touchend' : 'mouseup';
  var moveEvent = isTouchSupported ? 'touchmove' : 'mousemove';

  var totalFrames = images.length;

  var mouseX = 0;
  var oldMouseX = 0;

  //------------------------------------------------------------------------------
  //
  //  Initialisation
  //
  //------------------------------------------------------------------------------

  var init = function init() {
    preloadimages(images, start);
  };

  var preloadimages = function preloadimages(sourceImages, cb) {

    var total = sourceImages.length;
    var loaded = 0;

    var onload = function onload() {
      if (++loaded >= total) cb(finalImages);
    };

    var finalImages = sourceImages.map(function (item) {
      var image = new Image();
      image.src = item;
      image.onload = onload;
      image.onerror = onload;
      image.onabort = onload;
      image.draggable = false;
      return image;
    });
  };

  var start = function start(loadedImages) {
    images = loadedImages;

    emptyDomNode(container);
    container.appendChild(images[o.currentFrame]);

    if (o.interactive) {
      initListeners();
    }
  };

  //------------------------------------------------------------------------------
  //
  //  Events
  //
  //------------------------------------------------------------------------------

  var initListeners = function initListeners() {
    container.addEventListener(startEvent, startDrag);
  };

  var drag = function drag(e) {
    e.preventDefault();

    mouseX = e.pageX !== undefined ? e.pageX : e.changedTouches[0].pageX;

    if (mouseX < oldMouseX) {
      previous();
    } else if (mouseX > oldMouseX) {
      next();
    }

    oldMouseX = mouseX;
  };

  var startDrag = function startDrag(e) {
    e.preventDefault();
    document.addEventListener(moveEvent, drag);
    document.addEventListener(stopEvent, stopDrag);
  };

  var stopDrag = function stopDrag(e) {
    e.preventDefault();
    document.removeEventListener(moveEvent, drag);
    document.removeEventListener(stopEvent, stopDrag);
  };

  //------------------------------------------------------------------------------
  //
  //  Sequence management
  //
  //------------------------------------------------------------------------------

  var replaceImage = function replaceImage() {
    container.replaceChild(images[o.currentFrame], container.childNodes[0]);
  };

  var previous = function previous() {
    o.currentFrame--;
    if (o.currentFrame < 0) o.currentFrame = totalFrames - 1;
    replaceImage();
  };

  var next = function next() {
    o.currentFrame++;
    if (o.currentFrame === totalFrames) o.currentFrame = 0;
    replaceImage();
  };

  var isInteractive = function isInteractive() {
    return o.interactive;
  };
  var getCurrentFrame = function getCurrentFrame() {
    return o.currentFrame;
  };

  var goToFrame = function goToFrame( frame ){
    o.currentFrame = frame;
    replaceImage();
  }

  var oldImgSrc,
      oldImgPosition;

  var swapImage = function swapImage(src){

    if( oldImgPosition != o.currentFrame ||  oldImgSrc != images[o.currentFrame].src){
      resetImage();
    }

    if( src != '' ){

      oldImgPosition = o.currentFrame;
      oldImgSrc = images[o.currentFrame].src;

      images[o.currentFrame].src = src;
      replaceImage();

    }

  }

  var resetImage = function resetImage(){

      if(typeof(oldImgPosition) !== 'undefined'){
        images[oldImgPosition].src = oldImgSrc;
        replaceImage();
      }
  }

  //------------------------------------------------------------------------------
  //
  //  API
  //
  //------------------------------------------------------------------------------

  return {
    init: init,
    previous: previous,
    next: next,
    isInteractive: isInteractive,
    getCurrentFrame: getCurrentFrame,
    goToFrame: goToFrame,
    swapImage: swapImage,
    resetImage: resetImage,
    totalFrames: totalFrames,
    images: images
  };

};

//------------------------------------------------------------------------------
//
//  Utilities
//
//------------------------------------------------------------------------------

var emptyDomNode = function emptyDomNode(element) {
  if (element.hasChildNodes()) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
};

exports.default = threesixty;
module.exports = exports['default'];