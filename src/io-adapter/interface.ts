import {IModelConstructor, IModel, IModelKey, IModelProperties} from "../model";
import {IListOptions} from "../options/list";


export interface IIOAdapter {

    /**
     * @property
     * holds key field names
     */
    readonly modelConstructor :IModelConstructor;

    /**
     * Converts raw data to model key
     * @param raw
     * @param options
     */
    key (raw: any, options? :any) :IModelKey;

    model (key: any, data: any, options? :any) :IModel;

    data (model :IModel, options? :any): any;

    listData (list :Array<IModel>, options?: IListDataOptions);

    listOptions (options: any) :IListOptions;
}

export interface IIOAdapterConstructor {
    new () :IIOAdapter;
}