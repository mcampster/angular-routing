/// <reference path="../../lib/angular/angular-1.0.d.ts" />
/// <reference path="../interfaces.d.ts" />
/// <reference path="../common.ts" />



interface IViewScope extends ng.IScope {
    refresh?: (data?: any) => void;
}

/**
 * @ngdoc directive
 * @name dotjem.routing.directive:jemView
 * @restrict ECA
 * 
 * @description
 *
 * @element ANY
 * @param {string} jemView Name of the view
 *
 * @scope
 * @example
    <example module="ngViewExample" deps="angular-route.js" animations="true">
 */
var jemViewDirective = [<any>'$state', '$scroll', '$compile', '$controller', '$view', '$animator',
function ($state, $scroll, $compile, $controller, $view: dotjem.routing.IViewService, $animator) {
    'use strict';
    return {
        restrict: 'ECA',
        terminal: true,
        link: function (scope, element: JQuery, attr) {
            var viewScope: IViewScope,
                controller,
                name = attr['jemView'] || attr.name,
                doAnimate = isDefined(attr.ngAnimate),
                onloadExp = attr.onload || '',
                animate = $animator(scope, attr),
                version = -1;

            scope.$on('$viewChanged', (event, updatedName) => {
                if (updatedName === name) update(doAnimate);
            });
            scope.$on('$viewRefresh', (event, refreshName, refreshData) => {
                if (refreshName === name) {
                    if (isFunction(viewScope.refresh)) {
                        viewScope.refresh(refreshData);
                    } else {
                        viewScope.$broadcast('$refresh', refreshName, refreshData)
                    }
                }
            });
            scope.$on('$stateChangeSuccess', () => update(doAnimate));
            update(false);

            function destroyScope() {
                if (viewScope) {
                    viewScope.$destroy();
                    viewScope = null;
                }
            }

            function clearContent(doAnimate) {
                if (doAnimate)
                    animate.leave(element.contents(), element);
                else
                    element.html('');

                destroyScope();
            }

            function update(doAnimate) {
                var view = $view.get(name),
                    controller;

                if (view && view.template) {
                    if (view.version === version)
                        return;

                    version = view.version;
                    controller = view.controller;

                    view.template.then((html) => {
                        clearContent(doAnimate);
                        if (doAnimate)
                            animate.enter(angular.element('<div></div>').html(html).contents(), element);
                        else
                            element.html(html);

                        var link = $compile(element.contents()),
                            locals;

                        viewScope = scope.$new();
                        if (controller) {
                            locals = copy(view.locals);
                            locals.$scope = viewScope;
                           
                            controller = $controller(controller, locals);
                            element.contents().data('$ngControllerController', controller);
                        }

                        link(viewScope);

                        viewScope.$emit('$viewContentLoaded');
                        viewScope.$eval(onloadExp);
                    });
                } else {
                    clearContent(doAnimate);
                }
            }
        }
    };
}];

angular.module('dotjem.routing').directive('jemView', jemViewDirective);