export interface ModelKeyInterface {
    // [prop :string] :any
}

export interface ModelPropertiesInterface {
    // [prop :string] :any
}

export interface ModelInterface {
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
    readonly data :any;

    /**
     * updates data fields
     */
    update (properties :ModelPropertiesInterface) :ModelInterface;
}

export interface ModelConstructor {
    new (key :ModelKeyInterface, properties :ModelPropertiesInterface) :ModelInterface;

    keyNames: ReadonlyArray<string>;
}