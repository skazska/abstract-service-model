export interface IModelKey {
    // [prop :string] :any
}

export interface IModelProperties {
    // [prop :string] :any
}

export interface IModel {
    /**
     * @property
     * holds key fields
     */

    readonly key :IModelKey;
    /**
     * @property
     * holds data fields
     */
    properties :IModelProperties;

    /**
     * @property
     * provides combined keys and data fields record
     */
    readonly data :any;

    /**
     * updates data fields
     */
    update (properties :IModelProperties) :IModel;
}

export interface IModelConstructor {
    new (key :IModelKey, properties :IModelProperties) :IModel;

    keyNames: ReadonlyArray<string>;
}