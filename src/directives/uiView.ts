/// <reference path="../../lib/angular/angular-1.0.d.ts" />
/// <reference path="../interfaces.d.ts" />
/// <reference path="../common.ts" />

'use strict';

var uiViewDirective = [<any>'$state', '$anchorScroll', '$compile', '$controller', '$view',
function ($state, $anchorScroll, $compile, $controller, $view: ui.routing.IViewService) {
    return {
        restrict: 'ECA',
        terminal: true,
        link: function (scope, element, attr) {
            var viewScope,
                name = attr['uiView'] || attr.name,
                onloadExp = attr.onload || '';

            // Find the details of the parent view directive (if any) and use it
            // to derive our own qualified view name, then hang our own details
            // off the DOM so child directives can find it.
            //   var parent = element.parent().inheritedData('$uiView');
            //   name = name + '@' + (parent ? parent.state.name : '');
            //   var view = { name: name, state: null };
            //   element.data('$uiView', view);

            scope.$on('$stateChangeBegin', () => { });
            scope.$on('$viewChanged', update);
            scope.$on('$stateChangeSuccess', update);
            update();

            function resetScope(newScope?) {
                if (viewScope) {
                    viewScope.$destroy();
                }
                viewScope = newScope === 'undefined' ? null : newScope;
            }

            function clearContent() {
                element.html('');
                resetScope();
            }

            function update() {
                var view = $view.get(name),
                    controller,
                    version;

                if (view && view.template) {
                    if (view.version === version)
                        return;

                    controller = view.controller
                    version = view.version;

                    view.template.then((html) => {
                        element.html(html);
                        resetScope(scope.$new());

                        var link = $compile(element.contents());

                        if (controller) {
                            controller = $controller(controller, { $scope: viewScope });
                            element.contents().data('$ngControllerController', controller);
                        }

                        link(viewScope);
                        viewScope.$emit('$viewContentLoaded');
                        viewScope.$eval(onloadExp);

                        $anchorScroll();
                    });
                } else {
                    clearContent();
                }
            }
        }
    };
}];

angular.module('ui.routing').directive('uiView', uiViewDirective);