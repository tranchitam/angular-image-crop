AngularJS Image Crop Directive
===============

A simple Angular.js image crop directive which supports image cropping, translating, rotating and zooming.

License: [MIT](http://www.opensource.org/licenses/mit-license.php)

## Requirements
- AngularJS
- JQuery
- JQuery Mouse Wheel

## Installing

User Bower:
* Install with [Bower][bower]: `$ bower install ngImageCrop`

Download from github:
* Download latest *[dist/ngImageCrop.js][ngImageCrop.js]* or *[dist/ngImageCrop.min.js][ngImageCrop.min.js]*.

**Note:** Dependencies:
* angular.js v1.2.x
* jquery.js v^2.2.1
* jquery-mousewheel.js v^3.1.13

Development
---------------

* Install Node.js & Bower modules: `$ npm install`
* Start local web server: `$ npm start` and check demo at link ([http://localhost:8080/examples/])
* Minify source code and copy to dist folder: `grunt build`

Issues
---------------

Please feel free to add any issues to the GitHub issue tracker.

Usage
---------------
- Use control + mouse drag drop to crop image.
- Use mouse drag drop to move(translate) the image.
- Use mouse wheel to zoom in and zoom out image.
- Rotate(Not implemented yet)

### Add files

Add all dependencies to your application. Make sure the `ngImageCrop.min.js` file is appended **after** the `angular.min.js` library:

```html
<script src="bower_components/jquery/dist/jquery.min.js"></script>
<script src="bower_components/jquery-mousewheel/jquery.mousewheel.min.js"></script>
<script src="bower_components/angular/angular.min.js"></script>
<script src="bower_components/angular-image-crop/dist/ngImageCrop.min.js"></script>
```

### Add module dependency

Add the image crop module as a dependency to your application module:

```js
var app = angular.module('DemoApp', ['ngImageCrop']);
```

### Add image-crop-directive in your html file

```html
<body oncontextmenu="return false;" style="-webkit-user-select: none; -moz-user-select: none; user-select: none;">
<div class="container-fluid" ng-controller="appController">
    <div class="row">
        <image-crop-directive image-data="imageData"
                              width="800"
                              height="500"
                              do-cropping="doCropping($imageData, $imageType)"
                              do-load-image="doLoadImage($imageSrc)"></image-crop-directive>
    </div>
</div>
```

### Set image-data in your angular controller

```js
<script>
    var app = angular.module('DemoApp', ['ngImageCrop']);
    app.controller('appController', ['$scope', function ($scope) {
        // Set image data
        $scope.imageData = {data: '<your image url>'}
    }]);
</script>
```

## image-crop-directive configurations

```html
<image-crop-directive
    imageData="{object}"
    width="{number}"
    height="{number}"
    do-cropping="{cropCallBackFunction}"
    do-load-image="{loadCallBackFunction}">
</image-crop-directive>
```

### imageData

An object has data property which indicates image url. For example: {data: 'images/picture.png'}.

### width

A number which is canvas width.

### height

A number which is canvas height.

### cropCallBackFunction

A callback function invoked when we crop image. This callback has 2 arguments:
- $imageData: This is cropped image data in base64.
- $imageType: Image type.

### loadCallBackFunction

A call back function has 1 argument: 
- $imageSrc: This is image url when it load successfully.

### Example:

Here is the complete example which use Bootstrap, Jquery, JqueryMousewWheel, AngularJs and inject image-crop-directive:
- It shows the image crop directive
- When cropping image, the bootstrap modal will show the image you have just cropped.

```html
<!DOCTYPE html>
<html lang="en" ng-app="DemoApp" ng-cloak>
<head>
    <title>Angular Image Crop Demo</title>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta name="description" content=""/>
    <style>
        [ng\:cloak], [ng-cloak], [data-ng-cloak], [x-ng-cloak], .ng-cloak, .x-ng-cloak {
            display: none !important;
        }
    </style>

    <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css"/>

    <script src="bower_components/jquery/dist/jquery.min.js"></script>
    <script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
    <script src="bower_components/jquery-mousewheel/jquery.mousewheel.min.js"></script>
    <script src="bower_components/angular/angular.min.js"></script>
    <script src="bower_components/angular-image-crop/dist/ngImageCrop.min.js"></script>

    <script>
        var app = angular.module('DemoApp', ['ngImageCrop']);
        app.controller('appController', ['$scope', function ($scope) {
            $scope.doCropping = function ($imageData, $imageType) {
                $('#cropImage')[0].src = $imageData;
                $('#imageCropModal').modal('show');
            }
            $scope.imageData = {data: 'https://avatars2.githubusercontent.com/u/7502937?v=3&s=460'}
        }]);
    </script>
</head>
<body oncontextmenu="return false;" style="-webkit-user-select: none; -moz-user-select: none; user-select: none;">
<div class="container-fluid" ng-controller="appController">
    <div class="row">
        <image-crop-directive image-data="imageData"
                              width="800"
                              height="500"
                              do-cropping="doCropping($imageData, $imageType)"
                              do-load-image="doLoadImage($imageSrc)"></image-crop-directive>
    </div>
</div>

<!-- Bootstrap modal -->
<div class="modal fade" id="imageCropModal" tabindex="-1" role="dialog" aria-labelledby="imageCropModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                        aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="imageCropModalLabel">Image Crop Data</h4>
            </div>
            <div class="modal-body">
                <img id="cropImage"/>
            </div>
        </div>
    </div>
</div>
</body>
</html>
```

### Todo:

- Implement rotate functionality.
- Add image filter to make image crop area lighter.
- Support more configurations