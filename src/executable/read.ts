import {Executable, IRunError} from "../executable";
import {Result} from "../result";
import {IModel, IModelKey} from "../model";
import {IIdentity} from "../auth";



export abstract class ReadExecutable extends Executable<IModelKey, IModel> {
    constructor (
        _storage :IStorage
    ) {}

    protected execute(params :IModelKey) :Promise<Result<IModel, IRunError>> {

    }
}
