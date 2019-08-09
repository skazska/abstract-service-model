import {IRunError, AbstractExecutable} from "../../executable";
import {GenericResult} from "../../result";
import {CRUDExecutable, ICUExecuteOptions} from "../crud";

export class CreateCRUDExecutable<K, P> extends CRUDExecutable<ICUExecuteOptions<K, P>, any, K, P> {

    protected async _execute(params :ICUExecuteOptions<K, P>) :Promise<GenericResult<any, IRunError>> {

        // if key is not provided, try obtain new from storage
        if (!params.model.hasKey()) {
            let key = (await this.storage.newKey()).wrap(
                key => key,
                err => AbstractExecutable.error(err.description, 'ask new key from storage')
            );
            params.model.setKey(key.get());
        }

        // save
        return (await this.storage.save(params.model, params.options)).wrap(
            result => params.model,
            error => AbstractExecutable.error(error.description, 'save to storage')

        );
    }
}
