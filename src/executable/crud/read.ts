import {IRunError, Executable} from "../../executable";
import {failure, result, Result} from "../../result";
import {IModel} from "../../model";
import {CRUDExecutable} from "../crud";

export class ReadCRUDExecutable<K, P> extends CRUDExecutable<K, IModel, K, P> {

    protected async _execute(key :K) :Promise<Result<IModel, IRunError>> {
        const dataResult = await this._storage.load(key);
        if (dataResult.isFailure) {
            return failure(dataResult.errors.map(err => Executable.error(err.description, 'read from storage')));
        }
        return result(dataResult.get());
    }
}
