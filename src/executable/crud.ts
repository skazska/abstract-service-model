import {AbstractExecutable, IExecutableConfig} from "../executable";
import {IStorage} from "../storage";
import {GenericModel} from "../model";

export interface ICRUDExecutableConfig<K, P> extends IExecutableConfig {
    storage :IStorage<K, P, GenericModel<K, P>>
}

export abstract class CRUDExecutable<I, O, K, P> extends AbstractExecutable<I, O> {
    protected storage :IStorage<K, P, GenericModel<K, P>>;

    protected constructor(props :ICRUDExecutableConfig<K, P>) {
        super(props);
        this.storage = props.storage;
    }
}
