import {IRunError, AbstractExecutable} from "../../executable";
import {failure, result, GenericResult} from "../../result";
import {IModel} from "../../model";
import {CRUDExecutable} from "../crud";

export interface IUpdateOptions<K, P> {
    key :K,
    data :P
}

export class UpdateCRUDExecutable<K, P> extends CRUDExecutable<IUpdateOptions<K, P>, IModel, K, P> {

    protected async _execute(params :IUpdateOptions<K, P>) :Promise<GenericResult<IModel, IRunError>> {
        // compose model
        const dataResult = await this._storage.data(params.key, params.data);
        if (dataResult.isFailure) {
            return failure(dataResult.errors.map(
                err => AbstractExecutable.error(err.description, 'initiate new data model'))
            );
        }

        // save
        const response = await this._storage.save(dataResult.get());
        if (response.isFailure) {
            return failure(response.errors.map(err => AbstractExecutable.error(err.description, 'save to storage')));
        }
        return result(response.get());
    }
}
