import {IModelConstructor, IModel, IModelKey, IModelProperties} from "../model";

export interface IToModelOptions {
}

export interface IFromModelOptions {
}

export interface IIOAdapter {

    /**
     * @property
     * holds key field names
     */
    readonly modelConstructor :IModelConstructor;

    key (raw: any, options? :IToModelOptions) :IModelKey;

    model (key: any, data: any, options? :IToModelOptions) :IModel;

    data (model :IModel, options? :IFromModelOptions): any;

    listData (list :Array<IModel>, options? :IFromModelOptions)
}

export interface IIOAdapterConstructor {
    new () :IIOAdapter;
}