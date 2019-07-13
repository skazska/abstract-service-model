import {IRunError, AbstractExecutable} from "../../executable";
import {failure, success, GenericResult} from "../../result";
import {IModel} from "../../model";
import {CRUDExecutable} from "../crud";

export class ReadCRUDExecutable<K, P> extends CRUDExecutable<K, IModel, K, P> {

    protected async _execute(key :K) :Promise<GenericResult<IModel, IRunError>> {
        const dataResult = await this._storage.load(key);
        if (dataResult.isFailure) {
            return failure(dataResult.errors.map(err => AbstractExecutable.error(err.description, 'read from storage')));
        }
        return success(dataResult.get());
    }
}
