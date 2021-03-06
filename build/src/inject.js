/// <reference path="refs.d.ts" />

var $InjectProvider = [function () {
        'use strict';

        this.$get = [
            '$injector',
            function ($injector) {
                function createInvoker(fn) {
                    if (isInjectable(fn)) {
                        var injector = new InjectFn(fn, $injector);
                        return function (locals) {
                            return injector.invoker(locals);
                        };
                    }
                    return null;
                }

                return {
                    //Note: Rerouting of injector functions in cases where those are move convinient.
                    get: $injector.get,
                    annotate: $injector.annotate,
                    instantiate: $injector.instantiate,
                    invoke: $injector.invoke,
                    accepts: isInjectable,
                    create: createInvoker
                };
            }];
    }];
angular.module('dotjem.routing').provider('$inject', $InjectProvider);

//Note: All parts that has been commented out here is purpously left there as they are for a later optimization.
//      of all internal inject handlers.
var InjectFn = (function () {
    //private invokerFn: dotjem.routing.IInvoker;
    function InjectFn(fn, $inject) {
        this.fn = fn;
        this.$inject = $inject;
        //var last;
        if (isArray(fn)) {
            //last = fn.length - 1;
            //this.func = fn[last];
            this.func = fn[fn.length - 1];
            //this.dependencies = fn.slice(0, last);
        } else if (isFunction(fn)) {
            this.func = fn;
            //if (fn.$inject) {
            //    this.dependencies = fn.$inject;
            //} else {
            //    this.dependencies = this.extractDependencies(fn);
            //}
        }
    }
    //private extractDependencies(fn: any) {
    //    var fnText,
    //        argDecl,
    //        deps = [];
    //    if (fn.length) {
    //        fnText = fn.toString().replace(InjectFn.STRIP_COMMENTS, '');
    //        argDecl = fnText.match(InjectFn.FN_ARGS);
    //        forEach(argDecl[1].split(InjectFn.FN_ARG_SPLIT), function (arg) {
    //            arg.replace(InjectFn.FN_ARG, function (all, underscore, name) {
    //                deps.push(name);
    //            });
    //        });
    //    }
    //    return deps;
    //}
    InjectFn.prototype.invoker = function (locals) {
        return this.$inject.invoke(this.fn, this.func, locals);
        //Note: This part does not work, nor is it optimized as it should.
        //      generally when creating a handler through here locals are static meaning we can predict how the arg
        //      array should be resolved, therefore we can cache all services we require from the injector and just
        //      patch in locals on calls.
        //
        //if (this.invokerFn == null) {
        //    this.invokerFn = (locals?: any) => {
        //        var args = [];
        //        var l = this.dependencies.length;
        //        var i = 0, key;
        //        for (; i < length; i++) {
        //            key = this.dependencies[i];
        //            args.push(
        //              locals && locals.hasOwnProperty(key)
        //              ? locals[key]
        //              : this.$inject.get(key)
        //            );
        //        }
        //        return this.func.apply(self, args);
        //    };
        //}
        //return this.invokerFn(locals);
    };
    InjectFn.FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
    InjectFn.FN_ARG_SPLIT = /,/;
    InjectFn.FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
    InjectFn.STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    return InjectFn;
})();
