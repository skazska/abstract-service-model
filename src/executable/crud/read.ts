import {IRunError, error, IExecutableConfig} from "../../executable";
import {failure, result, Result} from "../../result";
import {IModel} from "../../model";
import {CRUDExecutable} from "../crud";
import {ModelStorage} from "../../storage/model";

export interface IReadExecutableConfig<K, P> extends IExecutableConfig {
    storage :ModelStorage<K, P>
}


export class ReadCRUDExecutable<K, P> extends CRUDExecutable<K, IModel, K, P> {

    protected async _execute(key :K) :Promise<Result<IModel, IRunError>> {
        const dataResult = await this._storage.load(key);
        if (dataResult.isFailure) {
            return failure(dataResult.errors.map(err => error(err.description, 'read from storage')));
        }
        return result(dataResult.get());
    }
}
