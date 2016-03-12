/**
 * Created by tranchitam on 3/12/16.
 */

(function (window, angular) {
    'use strict';
    angular.module('ngImageCrop', []).directive('imageCropDirective', [function () {
        return {
            restrict: 'ACE',
            scope: {
                imageData: '=imageData',
                doCropping: '&doCropping',
                doLoadImage: '&doLoadImage'
            },
            template: '<canvas oncontextmenu="return false;" style="border: 1px solid #c9c9c9"></canvas>',
            link: function (scope, element, attrs) {
                var currentCropInfo;
                var canvas = $(element).find('canvas')[0];
                canvas.width = attrs.width;
                canvas.height = attrs.height;

                var imageControl = {width: 0, height: 0};
                var translatePos = {x: 0, y: 0};
                var scale = 1.0;
                var minScale = 0.1;
                var rotate = 0;
                var scaleMultiplier = 1.2;

                var image = new Image();
                image.onload = function () {
                    imageControl.width = image.width;
                    imageControl.height = image.height;
                    scale = Math.min(canvas.width / imageControl.width, canvas.height / imageControl.height);
                    minScale = scale;
                    rotate = 0;
                    currentCropInfo = null;
                    translatePos = {
                        x: canvas.width / 2,
                        y: canvas.height / 2
                    };

                    updateRotate(rotate);
                    draw(scale, translatePos);

                    scope.$apply(function (scope) {
                        scope.doLoadImage({$imageSrc: image.src});
                    });
                };

                image.onerror = function (event) {

                }

                var controls = {
                    mouseDown: false,
                    startDragOffset: {},
                    cropping: false
                };

                init();

                function init() {
                    $(canvas).on('mousedown', function (evt) {
                        controls.cropping = evt.ctrlKey;
                        controls.mouseDown = true;

                        var offsetX = (evt.offsetX || evt.pageX - $(evt.target).offset().left);
                        var offsetY = (evt.offsetY || evt.pageY - $(evt.target).offset().top);

                        if (controls.cropping) {
                            controls.startDragOffset.x = offsetX;
                            controls.startDragOffset.y = offsetY;
                        } else {
                            controls.startDragOffset.x = offsetX - translatePos.x;
                            controls.startDragOffset.y = offsetY - translatePos.y;
                        }
                        evt.preventDefault();
                        drawImage();
                    });

                    var nothing = function (evt) {
                        controls.mouseDown = false;
                        controls.cropping = false;
                        evt.preventDefault();
                    };

                    $(canvas).on('mouseup', function (evt) {
                        if (controls.cropping) {
                            var startX = controls.startDragOffset.x;
                            var startY = controls.startDragOffset.y;
                            var offsetX = (evt.offsetX || evt.pageX - $(evt.target).offset().left);
                            var offsetY = (evt.offsetY || evt.pageY - $(evt.target).offset().top);

                            var originalCanvas = document.createElement('canvas');
                            originalCanvas.style.background = "#ffffff";
                            originalCanvas.width = canvas.width / scale;
                            originalCanvas.height = canvas.height / scale;
                            var originalContext = originalCanvas.getContext('2d');
                            var originTranslatePos = {x: translatePos.x / scale, y: translatePos.y / scale};
                            var originRotate = rotate;

                            originalContext.clearRect(0, 0, originTranslatePos.width, originTranslatePos.height);
                            originalContext.save();
                            originalContext.translate(originTranslatePos.x, originTranslatePos.y);
                            originalContext.rotate(originRotate * Math.PI / 180);
                            originalContext.drawImage(image, imageControl.width / -2, imageControl.height / -2, imageControl.width, imageControl.height);
                            originalContext.restore();

                            var originStartX = startX / scale;
                            var originStartY = startY / scale;
                            var originOffsetX = offsetX / scale;
                            var originOffsetY = offsetY / scale;

                            var deltaOffsetX = Math.abs(originOffsetX - originStartX);
                            var deltaOffsetY = Math.abs(originOffsetY - originStartY);

                            if (deltaOffsetX > 0 && deltaOffsetY > 0) {
                                currentCropInfo = {startX: startX, startY: startY, offsetX: offsetX, offsetY: offsetY};

                                var imageData = originalContext.getImageData(Math.min(originStartX, originOffsetX), Math.min(originStartY, originOffsetY), deltaOffsetX, deltaOffsetY);
                                var h = imageData.height;
                                var w = imageData.width;

                                var newCanvas = document.createElement('canvas');
                                newCanvas.width = w;
                                newCanvas.height = h;
                                var newContext = newCanvas.getContext('2d');
                                newContext.putImageData(imageData, 0, 0);

                                var base64Data = newCanvas.toDataURL("image/jpeg");

                                scope.$apply(function (scope) {
                                    scope.doCropping({
                                        $imageData: base64Data,
                                        $imageType: "JPG"
                                    });
                                });
                            }
                        }

                        controls.mouseDown = false;
                        controls.cropping = false;
                        evt.preventDefault();
                    });

                    $(canvas).on('mouseover', nothing);
                    $(canvas).on('mouseout', nothing);

                    $(canvas).on('mousemove', function (evt) {
                        if (controls.mouseDown) {
                            var offsetX = (evt.offsetX || evt.pageX - $(evt.target).offset().left);
                            var offsetY = (evt.offsetY || evt.pageY - $(evt.target).offset().top);

                            if (controls.cropping) {
                                drawImage(offsetX, offsetY);
                            }
                            else {
                                var newTranslatePos = {
                                    x: offsetX - controls.startDragOffset.x,
                                    y: offsetY - controls.startDragOffset.y
                                };

                                if (currentCropInfo) {
                                    currentCropInfo = {
                                        startX: currentCropInfo.startX + newTranslatePos.x - translatePos.x,
                                        startY: currentCropInfo.startY + newTranslatePos.y - translatePos.y,
                                        offsetX: currentCropInfo.offsetX + newTranslatePos.x - translatePos.x,
                                        offsetY: currentCropInfo.offsetY + newTranslatePos.y - translatePos.y
                                    }
                                }
                                draw(scale, newTranslatePos);
                            }
                        }
                    });


                    if ($.fn.mousewheel) {
                        $(canvas).on('mousewheel', function (evt) {
                            evt.preventDefault();
                            var newScale = scale;
                            if (evt.deltaY < 0) {
                                newScale /= scaleMultiplier;
                            } else {
                                newScale *= scaleMultiplier;
                            }

                            if (newScale >= (minScale + "").substring(0, (minScale + "").length - 2) && newScale < 8) {
                                var offsetX = (evt.offsetX || evt.pageX - $(evt.target).offset().left);
                                var offsetY = (evt.offsetY || evt.pageY - $(evt.target).offset().top);

                                translatePos.x -= (offsetX - translatePos.x) * (newScale - scale) / scale;
                                translatePos.y -= (offsetY - translatePos.y) * (newScale - scale) / scale;

                                if (currentCropInfo) {
                                    currentCropInfo = {
                                        startX: currentCropInfo.startX - (offsetX - currentCropInfo.startX) * (newScale - scale) / scale,
                                        startY: currentCropInfo.startY - (offsetY - currentCropInfo.startY) * (newScale - scale) / scale,
                                        offsetX: currentCropInfo.offsetX - (offsetX - currentCropInfo.offsetX) * (newScale - scale) / scale,
                                        offsetY: currentCropInfo.offsetY - (offsetY - currentCropInfo.offsetY) * (newScale - scale) / scale
                                    }
                                }
                                draw(newScale);
                            }
                        });
                    }
                }

                function updatePosition(__scale, __translatePos) {
                    var oldScale = scale;
                    if (__scale >= (minScale + "").substring(0, (minScale + "").length - 2) && __scale < 8) {
                        scale = __scale;
                    }

                    if (!(__translatePos)) {
                        __translatePos = {
                            x: translatePos.x,
                            y: translatePos.y
                        };
                    }

                    if (__translatePos) {
                        translatePos.x = __translatePos.x;
                        translatePos.y = __translatePos.y;
                    }
                }

                function updateRotate(__rotate) {
                    if (__rotate != undefined) {
                        translatePos.x = canvas.width / 2;
                        translatePos.y = canvas.height / 2;
                        rotate = __rotate;
                    }
                }

                function draw(__scale, __translatePos, __rotate) {
                    updatePosition(__scale, __translatePos);
                    updateRotate(__rotate);
                    drawImage();
                }

                function drawImage(mouseX, mouseY, highlight) {
                    var context = canvas.getContext('2d');
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.save();
                    context.translate(translatePos.x, translatePos.y);
                    context.scale(scale, scale);
                    context.rotate(rotate * Math.PI / 180);
                    context.drawImage(image, imageControl.width / -2, imageControl.height / -2, imageControl.width, imageControl.height);
                    context.restore();

                    if (mouseX && mouseY) {
                        context.strokeStyle = '#0000ff';
                        context.fillStyle = 'rgba(0,0,255,0.05)';
                        context.beginPath();
                        context.rect(
                            Math.min(mouseX, controls.startDragOffset.x),
                            Math.min(mouseY, controls.startDragOffset.y),
                            Math.abs(mouseX - controls.startDragOffset.x),
                            Math.abs(mouseY - controls.startDragOffset.y));
                        context.fillRect(
                            Math.min(mouseX, controls.startDragOffset.x),
                            Math.min(mouseY, controls.startDragOffset.y),
                            Math.abs(mouseX - controls.startDragOffset.x),
                            Math.abs(mouseY - controls.startDragOffset.y));
                        context.stroke();
                    }
                }

                scope.$watch('imageData', function (oldValue, newValue) {
                    if (scope.imageData && scope.imageData.data) {
                        image.crossOrigin = 'Anonymous';
                        image.src = scope.imageData.data;
                    }
                });
            }
        }
    }]);
})(window, angular);