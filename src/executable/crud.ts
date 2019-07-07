import {AbstractExecutable, IExecutableConfig} from "../executable";
import {AbstractModelStorage} from "../storage/model";

export interface ICRUDExecutableConfig<K, P> extends IExecutableConfig {
    storage :AbstractModelStorage<K, P>
}

export abstract class CRUDExecutable<I, O, K, P> extends AbstractExecutable<I, O> {
    protected _storage :AbstractModelStorage<K, P>;

    protected constructor(props :ICRUDExecutableConfig<K, P>) {
        super(props);
        this._storage = props.storage;
    }
}
