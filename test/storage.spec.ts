// const sinon = require('sinon');
// import "mocha";
// import {expect, use}  from "chai";
// import * as sinonChai from "sinon-chai";
// import * as chaiAsPromised from "chai-as-promised"
// use(chaiAsPromised);
// use(sinonChai);
//
// import {Service} from "../src/storage";
//
// describe('storage', () => {
//     // describe('#create(data :Object) :Promise<any>', () => {
//     //     let storage :Service = null;
//     //     before(() => {
//     //         storage = new Service({option: 'option'});
//     //     });
//     //
//     //     it('implemented', () => {
//     //         expect(storage).to.have.property('create').which.is.a('function');
//     //     });
//     //
//     //     it('returns undefined', () => {
//     //         let result = storage.create({id: 'id'});
//     //         expect(result).to.eventually.become(undefined);
//     //     });
//     // });
//
//     describe('#load(id :any) :Promise<any>', () => {
//         let storage :Service = null;
//         before(() => {
//             storage = new Service({option: 'option'});
//         });
//
//         it('implemented', () => {
//             expect(storage).to.have.property('load').which.is.a('function');
//         });
//
//         it('returns undefined', () => {
//             let result = storage.load({id: 'id'});
//             expect(result).to.eventually.become(undefined);
//         });
//     });
//
//     describe('#extract(options :IExtractOptions) :Promise<any>', () => {
//         let storage :Service = null;
//         before(() => {
//             storage = new Service({option: 'option'});
//         });
//
//         it('implemented', () => {
//             expect(storage).to.have.property('extract').which.is.a('function');
//         });
//
//         it('returns undefined', () => {
//             let result = storage.extract({id: 'id'});
//             expect(result).to.eventually.become(undefined);
//         });
//     });
//
//     describe('#save(id :any, data:Object) :Promise<any>', () => {
//         let storage :Service = null;
//         before(() => {
//             storage = new Service({option: 'option'});
//         });
//
//         it('implemented', () => {
//             expect(storage).to.have.property('save').which.is.a('function');
//         });
//
//         it('returns undefined', () => {
//             let result = storage.save({id: 'id'}, {data: 'data'});
//             expect(result).to.eventually.become(undefined);
//         });
//     });
//
//     describe('#erase(id :any) :Promise<any>', () => {
//         let storage :Service = null;
//         beforeEach(() => {
//             storage = new Service({option: 'option'});
//         });
//
//         it('implemented', () => {
//             expect(storage).to.have.property('erase').which.is.a('function');
//         });
//
//         it('returns undefined', () => {
//             let result = storage.erase({id: 'id'});
//             expect(result).to.eventually.become(undefined);
//         });
//     });
//
// });
