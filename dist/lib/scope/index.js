"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var variable_1 = require("./variable");
var Scope = (function () {
    function Scope(parent, isolated) {
        if (parent === void 0) { parent = null; }
        if (isolated === void 0) { isolated = false; }
        this.context = {};
        this.parent = parent;
        this.isolated = isolated;
    }
    Scope.prototype.global = function () {
        var scope = this;
        while (scope.parent) {
            scope = scope.parent;
        }
        return scope;
    };
    Scope.prototype.clone = function () {
        var cloneScope = new Scope(this.parent, this.isolated);
        var names = Object.getOwnPropertyNames(this.context);
        for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
            var name_1 = names_1[_i];
            var variable = this.context[name_1];
            cloneScope[variable.kind](name_1, variable.get());
        }
        return cloneScope;
    };
    Scope.prototype.find = function (name) {
        if (this.context.hasOwnProperty(name)) {
            return this.context[name];
        }
        else if (this.parent) {
            return this.parent.find(name);
        }
        else {
            var win = this.global().find('window').get();
            if (win.hasOwnProperty(name)) {
                return new variable_1.Prop(win, name);
            }
            else {
                return null;
            }
        }
    };
    Scope.prototype.var = function (name, value) {
        var scope = this;
        while (scope.parent && !scope.isolated) {
            scope = scope.parent;
        }
        scope.context[name] = new variable_1.Var('var', value);
        return true;
    };
    Scope.prototype.let = function (name, value) {
        var variable = this.context[name];
        if (!variable) {
            this.context[name] = new variable_1.Var('let', value);
            return true;
        }
        else {
            return false;
        }
    };
    Scope.prototype.const = function (name, value) {
        var variable = this.context[name];
        if (!variable) {
            this.context[name] = new variable_1.Var('const', value);
            return true;
        }
        else {
            return false;
        }
    };
    return Scope;
}());
exports.default = Scope;
//# sourceMappingURL=index.js.map