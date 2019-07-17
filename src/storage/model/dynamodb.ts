import {AbstractModelStorage, IModelStorageConfig} from "../model";
import {GenericModel} from "../../model";
import {failure, GenericResult, success} from "../../result";
import {IStorageError, IStorageOperationOptions} from "../../storage";

import DynamoDB = require('aws-sdk/clients/dynamodb');
import {
    AttributeMap,
    ConditionExpression,
    ConsistentRead,
    ExpressionAttributeNameMap,
    ExpressionAttributeValueMap,
    GetItemInput,
    Key,
    PutItemInput,
    ProjectionExpression,
    ReturnConsumedCapacity,
    ReturnItemCollectionMetrics,
    ReturnValue,
    UpdateExpression,
    UpdateItemInput, UpdateItemOutput, PutItemOutput, DeleteItemInput, DeleteItemOutput
} from "aws-sdk/clients/dynamodb";

export interface IDynamodbModelStorageConfig<K, P> extends IModelStorageConfig<K,P> {
    client :DynamoDB;
    table: string;
}

export interface IDynamodbStorageOperatorOptions extends IStorageOperationOptions {
    returnConsumedCapacity?: ReturnConsumedCapacity;
    /**
     * One or more substitution tokens for attribute names in an expression. The following are some use cases for using ExpressionAttributeNames:   To access an attribute whose name conflicts with a DynamoDB reserved word.   To create a placeholder for repeating occurrences of an attribute name in an expression.   To prevent special characters in an attribute name from being misinterpreted in an expression.   Use the # character in an expression to dereference an attribute name. For example, consider the following attribute name:    Percentile    The name of this attribute conflicts with a reserved word, so it cannot be used directly in an expression. (For the complete list of reserved words, see Reserved Words in the Amazon DynamoDB Developer Guide). To work around this, you could specify the following for ExpressionAttributeNames:    {"#P":"Percentile"}    You could then use this substitution in an expression, as in this example:    #P = :val     Tokens that begin with the : character are expression attribute values, which are placeholders for the actual value at runtime.  For more information on expression attribute names, see Specifying Item Attributes in the Amazon DynamoDB Developer Guide.
     */
    expressionAttributeNames? :ExpressionAttributeNameMap;
}

export interface IDynamodbStorageGetOptions extends IDynamodbStorageOperatorOptions {
    /**
     * Determines the read consistency model: If set to true, then the operation uses strongly consistent reads; otherwise, the operation uses eventually consistent reads.
     */
    consistentRead? :ConsistentRead;
    /**
     * A string that identifies one or more attributes to retrieve from the table. These attributes can include scalars, sets, or elements of a JSON document. The attributes in the expression must be separated by commas. If no attribute names are specified, then all attributes are returned. If any of the requested attributes are not found, they do not appear in the result. For more information, see Specifying Item Attributes in the Amazon DynamoDB Developer Guide.
     */
    projectionExpression? :ProjectionExpression;
}

interface IDynamodbStorageModifyOptions extends IDynamodbStorageOperatorOptions {
    /**
     * Use ReturnValues if you want to get the item attributes as they appeared before they were updated with the PutItem request. For PutItem, the valid values are:    NONE - If ReturnValues is not specified, or if its value is NONE, then nothing is returned. (This setting is the default for ReturnValues.)    ALL_OLD - If PutItem overwrote an attribute name-value pair, then the content of the old item is returned.    The ReturnValues parameter is used by several DynamoDB operations; however, PutItem does not recognize any values other than NONE or ALL_OLD.
     */
    returnValues?: ReturnValue;
    /**
     * Determines whether item collection metrics are returned. If set to SIZE, the response includes statistics about item collections, if any, that were modified during the operation are returned in the response. If set to NONE (the default), no statistics are returned.
     */
    returnItemCollectionMetrics?: ReturnItemCollectionMetrics;
    /**
     * A condition that must be satisfied in order for a conditional PutItem operation to succeed. An expression can contain any of the following:   Functions: attribute_exists | attribute_not_exists | attribute_type | contains | begins_with | size  These function names are case-sensitive.   Comparison operators: = | &lt;&gt; | &lt; | &gt; | &lt;= | &gt;= | BETWEEN | IN      Logical operators: AND | OR | NOT    For more information on condition expressions, see Condition Expressions in the Amazon DynamoDB Developer Guide.
     */
    conditionExpression?: ConditionExpression;
    /**
     * One or more substitution tokens for attribute names in an expression. The following are some use cases for using ExpressionAttributeNames:   To access an attribute whose name conflicts with a DynamoDB reserved word.   To create a placeholder for repeating occurrences of an attribute name in an expression.   To prevent special characters in an attribute name from being misinterpreted in an expression.   Use the # character in an expression to dereference an attribute name. For example, consider the following attribute name:    Percentile    The name of this attribute conflicts with a reserved word, so it cannot be used directly in an expression. (For the complete list of reserved words, see Reserved Words in the Amazon DynamoDB Developer Guide). To work around this, you could specify the following for ExpressionAttributeNames:    {"#P":"Percentile"}    You could then use this substitution in an expression, as in this example:    #P = :val     Tokens that begin with the : character are expression attribute values, which are placeholders for the actual value at runtime.  For more information on expression attribute names, see Specifying Item Attributes in the Amazon DynamoDB Developer Guide.
     */
    expressionAttributeNames?: ExpressionAttributeNameMap;
    /**
     * One or more values that can be substituted in an expression. Use the : (colon) character in an expression to dereference an attribute value. For example, suppose that you wanted to check whether the value of the ProductStatus attribute was one of the following:   Available | Backordered | Discontinued  You would first need to specify ExpressionAttributeValues as follows:  { ":avail":{"S":"Available"}, ":back":{"S":"Backordered"}, ":disc":{"S":"Discontinued"} }  You could then use these values in an expression, such as this:  ProductStatus IN (:avail, :back, :disc)  For more information on expression attribute values, see Condition Expressions in the Amazon DynamoDB Developer Guide.
     */
    expressionAttributeValues?: ExpressionAttributeValueMap;
}

export interface IDynamodbStorageSaveOptions extends IDynamodbStorageModifyOptions {
    /**
     * An expression that defines one or more attributes to be updated, the action to be performed on them, and new values for them. The following action values are available for UpdateExpression.    SET - Adds one or more attributes and values to an item. If any of these attributes already exist, they are replaced by the new values. You can also use SET to add or subtract from an attribute that is of type Number. For example: SET myNum = myNum + :val   SET supports the following functions:    if_not_exists (path, operand) - if the item does not contain an attribute at the specified path, then if_not_exists evaluates to operand; otherwise, it evaluates to path. You can use this function to avoid overwriting an attribute that may already be present in the item.    list_append (operand, operand) - evaluates to a list with a new element added to it. You can append the new element to the start or the end of the list by reversing the order of the operands.   These function names are case-sensitive.    REMOVE - Removes one or more attributes from an item.    ADD - Adds the specified value to the item, if the attribute does not already exist. If the attribute does exist, then the behavior of ADD depends on the data type of the attribute:   If the existing attribute is a number, and if Value is also a number, then Value is mathematically added to the existing attribute. If Value is a negative number, then it is subtracted from the existing attribute.  If you use ADD to increment or decrement a number value for an item that doesn't exist before the update, DynamoDB uses 0 as the initial value. Similarly, if you use ADD for an existing item to increment or decrement an attribute value that doesn't exist before the update, DynamoDB uses 0 as the initial value. For example, suppose that the item you want to update doesn't have an attribute named itemcount, but you decide to ADD the number 3 to this attribute anyway. DynamoDB will create the itemcount attribute, set its initial value to 0, and finally add 3 to it. The result will be a new itemcount attribute in the item, with a value of 3.    If the existing data type is a set and if Value is also a set, then Value is added to the existing set. For example, if the attribute value is the set [1,2], and the ADD action specified [3], then the final attribute value is [1,2,3]. An error occurs if an ADD action is specified for a set attribute and the attribute type specified does not match the existing set type.  Both sets must have the same primitive data type. For example, if the existing data type is a set of strings, the Value must also be a set of strings.    The ADD action only supports Number and set data types. In addition, ADD can only be used on top-level attributes, not nested attributes.     DELETE - Deletes an element from a set. If a set of values is specified, then those values are subtracted from the old set. For example, if the attribute value was the set [a,b,c] and the DELETE action specifies [a,c], then the final attribute value is [b]. Specifying an empty set is an error.  The DELETE action only supports set data types. In addition, DELETE can only be used on top-level attributes, not nested attributes.    You can have many actions in a single expression, such as the following: SET a=:value1, b=:value2 DELETE :value3, :value4, :value5  For more information on update expressions, see Modifying Items and Attributes in the Amazon DynamoDB Developer Guide.
     */
    updateExpression?: UpdateExpression;
}

export interface IDynamodbStorageDelOptions extends IDynamodbStorageModifyOptions {}


const attachParams = (params :object, options :any) => {
    Object.keys(options||{}).forEach(key => {
        params[key.charAt(0).toUpperCase() + key.slice(1)] = options[key];
    });
    return params;
};

const objectToKey = (obj :any) :Key => {
    //TODO there possibly some transformations may be required
    return <Key>obj;
};

const objectToAttributeMap = (obj :any) :AttributeMap => {
    //TODO there possibly some transformations may be required
    return <AttributeMap>obj;
};


export class DynamodbModelStorage<K, P> extends AbstractModelStorage<K,P> {
    private _client :DynamoDB;
    private _table: string;

    constructor(props :IDynamodbModelStorageConfig<K,P>) {
        super(props);
        this._client = props.client;
        this._table = props.table
    }

    get client() :DynamoDB { return this._client; }
    get table() :string { return this._table; }

    data(key:K, props: P) :Promise<GenericResult<GenericModel<K,P>, IStorageError>> {
        const data = this._modelFactory.model(key, props);
        return Promise.resolve(success(data));
    }

    newKey(): Promise<GenericResult<K, IStorageError>> {
        return Promise.resolve(failure([AbstractModelStorage.error('use natural key')]));
    }

    load(key :K, options: IDynamodbStorageGetOptions) :Promise<GenericResult<GenericModel<K,P>, IStorageError>> {
        return new Promise((resolve) => {
            const params = attachParams({
                TableName: this._table,
                Key: objectToKey(key)
            }, options);
            this._client.getItem(<GetItemInput>params, (err, data) => {
                if (err) return resolve(failure([AbstractModelStorage.error(err.message, 'dynamodb')]));
                if (!data.Item) return resolve(failure([AbstractModelStorage.error('not found')]));
                resolve(success(this._modelFactory.dataModel(data.Item)));
            });
        });
    }
    save(data :GenericModel<K,P>, options: IDynamodbStorageSaveOptions)
        :Promise<GenericResult<UpdateItemOutput|PutItemOutput, IStorageError>> {
        return new Promise((resolve) => {
            if (options && options.updateExpression) {
                // update
                let params = attachParams({
                    TableName: this._table,
                    Key: objectToKey(data.key)
                }, options);
                this._client.updateItem(<UpdateItemInput>params, (err, data) => {
                    if (err) return resolve(failure([AbstractModelStorage.error(err.message, 'dynamodb')]));
                    resolve(success(data));
                });
            } else {
                // put
                let params = attachParams({
                    TableName: this._table,
                    Item: objectToAttributeMap(data.data)
                }, options);
                this._client.putItem(<PutItemInput>params, (err, data) => {
                    if (err) return resolve(failure([AbstractModelStorage.error(err.message, 'dynamodb')]));
                    resolve(success(data));
                });
            }
        });
    }
    erase(key :K, options? :IDynamodbStorageDelOptions) :Promise<GenericResult<DeleteItemOutput, IStorageError>> {
        return new Promise((resolve) => {
            const params = attachParams({
                TableName: this._table,
                Key: objectToKey(key)
            }, options);
            this._client.deleteItem(<DeleteItemInput>params, (err, data) => {
                if (err) return resolve(failure([AbstractModelStorage.error(err.message, 'dynamodb')]));
                resolve(success(data));
            });
        });
    }
}
