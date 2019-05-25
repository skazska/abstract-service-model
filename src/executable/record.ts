import {Executable, IExecutableConfig} from "../executable";
import {IModel, IModelKey} from "../model";
import {RecordStorage} from "../storage/record";

export interface IRecordExecutableConfig extends IExecutableConfig {
    storage :RecordStorage
}

export abstract class RecordExecutable extends Executable<IModelKey, IModel> {
    protected _storage :RecordStorage;

    protected constructor(props :IRecordExecutableConfig) {
        super(props);
        this._storage = props.storage;
    }
}
