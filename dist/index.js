(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('pado/dist')) :
  typeof define === 'function' && define.amd ? define(['exports', 'pado/dist'], factory) :
  (factory((global.module = {}),global.dist));
}(this, (function (exports,dist) { 'use strict';

  var spawn = function spawn(module, argv) {};

  exports.promise = dist.promise;
  exports.compose = dist.awaitCompose;
  exports.spawn = spawn;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
