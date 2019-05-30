import {IRunError, error} from "../../executable";
import {failure, result, Result} from "../../result";
import {IModel} from "../../model";
import {CRUDExecutable} from "../crud";

export class ReadExecutable<K> extends CRUDExecutable<K, IModel, K, never> {

    protected async _execute(key :K) :Promise<Result<IModel, IRunError>> {
        const record = await this._storage.load(key);
        if (record.isFailure) {
            return failure(record.errors.map(err => error(err.description, 'read from storage')));
        }
        return result(record.get());
    }
}
