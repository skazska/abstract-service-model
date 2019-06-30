import {Executable, IExecutableConfig} from "../executable";
import {ModelStorage} from "../storage/model";

export interface ICRUDExecutableConfig<K, P> extends IExecutableConfig {
    storage :ModelStorage<K, P>
}

export abstract class CRUDExecutable<I, O, K, P> extends Executable<I, O> {
    protected _storage :ModelStorage<K, P>;

    protected constructor(props :ICRUDExecutableConfig<K, P>) {
        super(props);
        this._storage = props.storage;
    }
}
