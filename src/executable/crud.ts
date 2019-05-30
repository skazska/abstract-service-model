import {Executable, IExecutableConfig} from "../executable";
import {IStorage} from "../storage";
import {IModelFactory} from "../model";

export interface ICRUDExecutableConfig<K, P> extends IExecutableConfig {
    storage :IStorage<K, P>
    modelFactory :IModelFactory<K, P>
}

export abstract class CRUDExecutable<I, O, K, P> extends Executable<I, O> {
    protected _storage :IStorage<K, P>;
    protected _modelFactory :IModelFactory<K, P>;

    protected constructor(props :ICRUDExecutableConfig<K, P>) {
        super(props);
        this._storage = props.storage;
        this._modelFactory = props.modelFactory;
    }
}
