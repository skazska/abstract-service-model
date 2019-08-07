// // const sinon = require('sinon');
// import "mocha";
// import {expect, use}  from 'chai';
// // import sinonChai = require("sinon-chai");
// import {TestSchemaModel, Schema} from "./schema-model";
// // use(sinonChai);
//
// describe('schema model', () => {
//     describe('scenario1', () => {
//         let model :TestSchemaModel = null;
//         let schema :Schema = null;
//         beforeEach(() => {
//             schema = new Schema();
//         });
//         it('#create with correct data', () => {
//             model = new TestSchemaModel({id: 'id'}, {data: 'data'}, {schema: schema});
//             let status = model.validate();
//             expect(status.isFailure).eql(false);
//         });
//         it('#create with incorrect key', () => {
//             model = new TestSchemaModel({id: 'idddddddddddddd'}, {data: 'data'}, {schema: schema});
//             let status = model.validate();
//             expect(status.errors).eql([{description: 'length should be less than 10', field: 'id'}]);
//         });
//         it('#create with incorrect properties', () => {
//             model = new TestSchemaModel({id: 'idd'}, {}, {schema: schema});
//             let status = model.validate();
//             expect(status.errors).eql([{description: 'data or data1 field should present', field: '*'}]);
//         });
//         it('#create with incorrect key properties', () => {
//             model = new TestSchemaModel({id: 'idddddddddddddd'}, {}, {schema: schema});
//             let status = model.validate();
//             expect(status.errors).eql([{description: 'length should be less than 10', field: 'id'},
//                 {description: 'data or data1 field should present', field: '*'}]);
//         });
//
//     });
// });
