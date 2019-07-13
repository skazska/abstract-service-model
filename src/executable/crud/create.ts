import {IRunError, AbstractExecutable} from "../../executable";
import {failure, success, GenericResult} from "../../result";
import {IModel} from "../../model";
import {CRUDExecutable} from "../crud";

export interface ICreateOptions<K, P> {
    key? :K,
    data :P
}

export class CreateCRUDExecutable<K, P> extends CRUDExecutable<ICreateOptions<K, P>, IModel, K, P> {

    protected async _execute(params :ICreateOptions<K, P>) :Promise<GenericResult<IModel, IRunError>> {

        // if key is not provided, try obtain new from storage
        if (typeof params.key ==='undefined') {
            let key = await this._storage.newKey();
            if (key.isFailure) {
                return failure(
                    key.errors.map(
                        err => AbstractExecutable.error(err.description, 'ask new key from storage')
                    )
                );
            }
            params.key = key.get();
        }

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
            return failure(response.errors.map(
                err => AbstractExecutable.error(err.description, 'save to storage'))
            );
        }
        return success(response.get());
    }
}
