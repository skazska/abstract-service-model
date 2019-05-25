import {IStorage, IStorageError} from "../storage";
import {IModel, IModelKey, IModelProperties} from "../model";
import {Result} from "../result";

export abstract class RecordStorage implements IStorage<IModelKey, IModelProperties> {
    abstract create(data: IModelProperties, key?: IModelKey): IModel

    abstract load(key: IModelKey): Promise<Result<IModel, IStorageError>>

    abstract save(data: IModel): Promise<Result<any, IStorageError>>

    abstract erase(key: IModelKey): Promise<Result<any, IStorageError>>
}

