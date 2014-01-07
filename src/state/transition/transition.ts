/// <reference path="../../refs.d.ts" />

interface IContext {
    begin(): ng.IPromise;
}

interface ITransition {
    push(stage: IStage);
    execute(context: IContext): ITransition;
}

interface IStage {
    execute(context: IContext): ng.IPromise;
}

interface IStageFactory {
    (): IStage;
}

interface IFactory {
    create(state: any, params: any, updateroute?: bool): ITransition;
}



//TODO: stateTransition.create should be surfice for the factory.
class Factory implements IFactory {
    factories: IStageFactory[] = [];

    constructor(public inject: ng.auto.IInjectorService, private q: ng.IQService) { }

    public create(state: any, params: any, updateroute?: bool) : ITransition {
        var trans = new Transition(state, params, updateroute);
        forEach(this.factories,  (fac: IStageFactory) => {
            //TODO: Use injection.
            var stage = null;
            trans.push(fac());
        });
        return trans;
    }
}

class Transition implements ITransition {
    stages: IStage[] = [];

    constructor(private state: any, private params: any, private updateroute?: bool) {

    }

    public push(stage: IStage) {
        this.stages.push(stage);
    }

    public execute(context: IContext): ITransition {
        var q: ng.IPromise = context.begin();
        forEach(this.stages, function (stage: IStage) {
            q = q.then(function () {
                return stage.execute(context);
            });
        });

        return this;
    }
}