/// <reference path="../refs.d.ts" />

/// <reference path="stateRules.ts" />
/// <reference path="stateFactory.ts" />

class State {
    private _children: { [name: string]: State; } = {};
    private _self: dotjem.routing.IRegisteredState;
    private _reloadOnOptional: boolean;
    private _route: any;
    private _scrollTo: any;

    get children(): any { return this._children; }
    get fullname(): string { return this._fullname; }
    get name(): string { return this._name; }
    get reloadOnOptional(): boolean { return this._reloadOnOptional; }
    get self(): dotjem.routing.IRegisteredState { return copy(this._self); }
    get parent(): State { return this._parent; }
    get route(): any { return this._route; }
    get root(): State {
        if (this.parent === null) {
            return this;
        }
        return this._parent.root;
    }

    set route(value: any) {
        if (isUndefined(value)) {
            throw Error(errors.routeCannotBeUndefined);
        }
        this._route = value;
    }

    set reloadOnOptional(value: boolean) {
        this._reloadOnOptional = value;
    }

    get scrollTo() {
        return this._scrollTo;
    }

    get views() {
        return this.self.views;
    }

    get resolve() {
        return this.self.resolve;
    }

    constructor(private _name: string, private _fullname: string, _self: dotjem.routing.IState, private _parent?: State) {
        this._self = <dotjem.routing.IRegisteredState>_self;
        this._self.$fullname = _fullname;
        this._reloadOnOptional = !isDefined(_self.reloadOnSearch) || _self.reloadOnSearch;

        this._scrollTo = 'top';

        if (_parent && isDefined(_parent.scrollTo)) {
            this._scrollTo = _parent.scrollTo;
        }

        if (isDefined(this._self.scrollTo)) {
            this._scrollTo = this._self.scrollTo;
        }
    }

    public add(child: State): State {
        this._children[child.name] = child;
        return this;
    }

    public resolveRoute(): string {
        return isDefined(this.route) ? this.route.route
             : isDefined(this.parent) ? this.parent.resolveRoute()
             : '';
    }

    public is(state: string) {
        return this.fullname === state || this.fullname === rootName + '.' + state;
    }

    public isActive(state: string) {
        if (this.is(state)) {
            return true;
        }

        return this.parent && this.parent.isActive(state) || false;
    }
}