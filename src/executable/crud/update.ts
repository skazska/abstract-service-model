import {IRunError, AbstractExecutable} from "../../executable";
import {GenericResult} from "../../result";
import {CRUDExecutable, ICUExecuteOptions} from "../crud";

export class UpdateCRUDExecutable<K, P> extends CRUDExecutable<ICUExecuteOptions<K, P>, any, K, P> {

    protected async _execute(params :ICUExecuteOptions<K, P>) :Promise<GenericResult<any, IRunError>> {
        // save
        return (await this.storage.save(params.model, params.options)).wrap(
            result => params.model,
            error => AbstractExecutable.error(error.description, 'save to storage')
        );
    }
}
