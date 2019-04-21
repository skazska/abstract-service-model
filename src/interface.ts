import {ModelConstructor, ModelInterface, ModelKeyInterface, ModelPropertiesInterface} from "./model/interface";
import {ServiceInterface} from "./service/interface";

export interface ListOptionsInterface {
    //TODO
}

export interface ServiceModelInterface {
    /**
     * @property
     * holds key field names
     */
    readonly modelConstructor :ModelConstructor;

    /**
     * @property
     * holds key fields
     */
    readonly service :ServiceInterface;

    load (key :ModelKeyInterface) :Promise<ModelInterface>

    list (options :ListOptionsInterface) :Promise<Array<ModelInterface>>

    create (key :ModelKeyInterface, properties :ModelPropertiesInterface) :Promise<ModelInterface>

    delete (key :ModelKeyInterface) :Promise<boolean>
}

export interface ServiceModelConstructor {
    new (id :any, properties :object) :ServiceModelInterface;
}