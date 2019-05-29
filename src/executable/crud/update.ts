import {IRunError, error} from "../../executable";
import {failure, result, Result} from "../../result";
import {IModel} from "../../model";
import {CRUDExecutable} from "../crud";

export interface IUpdateOptions<K, P> {
    key :K,
    data :P
}

export class UpdateExecutable<K, P> extends CRUDExecutable<IUpdateOptions<K, P>, IModel, K, P> {

    protected async _execute(params :IUpdateOptions<K, P>) :Promise<Result<IModel, IRunError>> {
        const response = await this._storage.save(params.data, params.key);
        if (response.isFailure) {
            return failure(response.errors.map(err => error(err.description, 'save to storage')));
        }
        const properties = response.get();
        return result(this._modelFactory.model(params.key, properties));
    }
}
