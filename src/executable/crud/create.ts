import {IRunError, error} from "../../executable";
import {failure, result, Result} from "../../result";
import {IModel} from "../../model";
import {CRUDExecutable} from "../crud";

export interface ICreateOptions<K, P> {
    key? :K,
    data :P
}

export class CreateExecutable<K, P> extends CRUDExecutable<ICreateOptions<K, P>, IModel, K, P> {
    protected async _execute(params :ICreateOptions<K, P>) :Promise<Result<IModel, IRunError>> {

        if (typeof params.key ==='undefined' && this._storage.newKey) {
            let key = await this._storage.newKey();
            if (key.isFailure) {
                return failure(
                    key.errors.map(err => error(err.description, 'ask new key from storage'))
                );
            }
            params.key = key.get();
        }

        const response = await this._storage.save(params.data, params.key);
        if (response.isFailure) {
            return failure(response.errors.map(err => error(err.description, 'save to storage')));
        }
        return result(response.get());
    }
}
