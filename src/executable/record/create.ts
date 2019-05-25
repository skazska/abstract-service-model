import {IRunError, error} from "../../executable";
import {failure, result, Result} from "../../result";
import {IModel, IModelKey, IModelProperties} from "../../model";
import {RecordExecutable} from "../record";

export interface ICreateRecordOptions {
    key? :IModelKey,
    data :IModelProperties
}

export class CreateRecordExecutable extends RecordExecutable {
    protected async _execute(params :ICreateRecordOptions) :Promise<Result<IModel, IRunError>> {
        const record = this._storage.create(params.data, params.key);
        const response = await this._storage.save(record);
        if (response.isFailure) {
            return failure(response.errors.map(err => error(err.description, 'save to storage')));
        }
        return result(response.get());
    }
}
