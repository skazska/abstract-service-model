import {IRunError, AbstractExecutable} from "../../executable";
import {GenericResult} from "../../result";
import {CRUDExecutable} from "../crud";
import {GenericModel} from "../../model";
import {IStorageOperationOptions} from "../../storage";

export interface IUpdateOptions<K, P> {
    model : GenericModel<K,P>,
    options?: IStorageOperationOptions
}

export class UpdateCRUDExecutable<K, P> extends CRUDExecutable<IUpdateOptions<K, P>, any, K, P> {

    protected async _execute(params :IUpdateOptions<K, P>) :Promise<GenericResult<any, IRunError>> {
        // save
        return (await this.storage.save(params.model, params.options)).wrap(
            result => params.model,
            error => AbstractExecutable.error(error.description, 'save to storage')
        );
    }
}
