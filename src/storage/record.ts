import {IStorage, IStorageError} from "../storage";
import {IModel, IModelKey, IModelProperties} from "../model";
import {Result} from "../result";

export abstract class RecordStorage implements IStorage<IModelKey, IModelProperties> {
    abstract read(key :IModelKey) :Promise<Result<IModel, IStorageError>>
    abstract write(data :IModelProperties, key? :IModelKey) :Promise<Result<any, IStorageError>>
    abstract erase(key:IModelKey) :Promise<Result<any, IStorageError>>

