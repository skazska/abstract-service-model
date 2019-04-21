export interface ModelKeyInterface {
    [prop :string] :any
}

export interface ModelPropertiesInterface {
    [prop :string] :any
}

export interface ModelInterface {
    /**
     * @property
     * holds key field names
     */
    readonly keys :ReadonlyArray<string>;

    /**
     * @property
     * holds key fields
     */

    readonly key :ModelKeyInterface;
    /**
     * @property
     * holds data fields
     */
    properties :ModelPropertiesInterface;

    /**
     * @property
     * provides combined keys and data fields record
     */
    readonly data :object;

    /**
     * updates data fields
     */
    update (properties :ModelPropertiesInterface) :ModelInterface;
}

export interface ModelConstructor {
    new (id :ModelKeyInterface, properties :ModelPropertiesInterface) :ModelInterface;
}