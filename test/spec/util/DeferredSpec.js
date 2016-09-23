'use strict';

var Deferred = require('../../../lib/util/Deferred');

describe('Deferred', function () {

    it('should call executor', function () {
        var executor = jasmine.createSpy('executor');
        new Deferred(executor);
        expect(executor).toHaveBeenCalled();
    });

    describe('Deferred.resolve', function () {

        it('should resolve immediatly', function () {
            var then = jasmine.createSpy('then');

            Deferred.resolve('foo').then(then);

            expect(then).toHaveBeenCalledWith('foo');
        });

    });

    describe('Deferred.reject', function () {

        it('should reject immediatly', function () {
            var then = jasmine.createSpy('then');
            var fail = jasmine.createSpy('fail');

            Deferred.reject('foo').then(then, fail);

            expect(then).not.toHaveBeenCalled();
            expect(fail).toHaveBeenCalledWith('foo');
        });

    });

    describe('Deferred.all', function () {

        it('should resolve when all has resolved', function () {
            var then = jasmine.createSpy('then');

            Deferred.all([
                Deferred.resolve('foo'),
                Deferred.resolve('bar'),
            ]).then(then);

            expect(then).toHaveBeenCalledWith(['foo', 'bar']);
        });

        it('should convert non-promises to resolved promises', function () {
            var then = jasmine.createSpy('then');

            Deferred.all([
                'foo',
                'bar',
            ]).then(then);

            expect(then).toHaveBeenCalledWith(['foo', 'bar']);
        });

        it('should reject all if one is rejected', function () {
            var then = jasmine.createSpy('then');
            var fail = jasmine.createSpy('fail');

            Deferred.all([
                'foo',
                Deferred.reject('bar'),
            ]).then(then, fail);

            expect(then).not.toHaveBeenCalled();
            expect(fail).toHaveBeenCalledWith('bar');
        });

        it('should ignore resolves after one was rejected', function () {
            var then = jasmine.createSpy('then');
            var fail = jasmine.createSpy('fail');

            Deferred.all([
                Deferred.reject('bar'),
                'foo'
            ]).then(then, fail);

            expect(then).not.toHaveBeenCalled();
            expect(fail).toHaveBeenCalledWith('bar');
        });
    });

    it('should not be possible to resolve after reject', function () {
        var then = jasmine.createSpy('then');
        var fail = jasmine.createSpy('fail');

        new Deferred(function (resolve, reject) {
            reject('foo');
            resolve('bar');
        }).then(then, fail);

        expect(then).not.toHaveBeenCalled();
        expect(fail).toHaveBeenCalledWith('foo');
    });

    it('should not be possible to reject after resolve', function () {
        var then = jasmine.createSpy('then');
        var fail = jasmine.createSpy('fail');

        new Deferred(function (resolve, reject) {
            resolve('foo');
            reject('bar');
        }).then(then, fail);

        expect(fail).not.toHaveBeenCalled();
        expect(then).toHaveBeenCalledWith('foo');
    });

    it('should call then handler when resolved', function () {
        var then = jasmine.createSpy('then');

        new Deferred(function (resolve) {
            resolve('foo');
        }).then(then);

        expect(then).toHaveBeenCalledWith('foo');
    });

    it('should call error handler when rejected', function () {
        var then = jasmine.createSpy('then');
        var fail = jasmine.createSpy('fail');

        new Deferred(function (resolve, reject) {
            reject('foo');
        }).then(then, fail);

        expect(then).not.toHaveBeenCalled();
        expect(fail).toHaveBeenCalledWith('foo');
    });

    it('should reject asyncrounsly', function (done) {
        var then = jasmine.createSpy('then');
        var fail = jasmine.createSpy('fail');

        new Deferred(function (resolve, reject) {
            setTimeout(function () {
                reject('foo');

                expect(then).not.toHaveBeenCalled();
                expect(fail).toHaveBeenCalledWith('foo');
                done();
            }, 0);
        }).then(then, fail);
    });

    it('should resolve asyncrounsly', function (done) {
        var then = jasmine.createSpy('then');
        var fail = jasmine.createSpy('fail');

        new Deferred(function (resolve, reject) {
            setTimeout(function () {
                resolve('foo');

                expect(fail).not.toHaveBeenCalled();
                expect(then).toHaveBeenCalledWith('foo');
                done();
            }, 0);
        }).then(then, fail);
    });

    it('should not throw when no handlers registered and promise is rejected', function () {
        expect(function () {
            new Deferred(function (resolve, reject) {
                reject('foo');
            });
        }).not.toThrow();
    });

    it('should not throw when no handlers registered and promise is resolved', function () {
        expect(function () {
            new Deferred(function (resolve, reject) {
                resolve('foo');
            });
        }).not.toThrow();
    });

    describe('then', function () {

        it('should return self to allow call-chain', function () {
            var promise = new Deferred(function () {});
            expect(promise.then(function () {})).toBe(promise);
        });

        it('should not throw when no error handler given and promise was rejected', function () {
            var then = jasmine.createSpy('then');

            expect(function () {
                new Deferred(function (resolve, reject) {
                    reject('foo');
                }).then(then);
            }).not.toThrow();
        });

        it('should not throw when no handler given and promise was resolved', function () {
            var then = jasmine.createSpy('then');

            expect(function () {
                new Deferred(function (resolve, reject) {
                    resolve('foo');
                }).then();
            }).not.toThrow();
        });

    });

    describe('catch', function () {

        it('should return self to allow call-chain', function () {
            var promise = new Deferred(function () {});
            expect(promise.catch(function () {})).toBe(promise);
        });

        it('should NOT call callback when resolved', function () {
            var fail = jasmine.createSpy('fail');

            new Deferred(function (resolve, reject) {
                resolve('foo');
            }).catch(fail);

            expect(fail).not.toHaveBeenCalled();
        });

        it('should call callback when rejected', function () {
            var fail = jasmine.createSpy('fail');

            new Deferred(function (resolve, reject) {
                reject('foo');
            }).catch(fail);

            expect(fail).toHaveBeenCalledWith('foo');
        });

        it('should not throw when no error handler given and promise was rejected', function () {
            var then = jasmine.createSpy('then');

            expect(function () {
                new Deferred(function (resolve, reject) {
                    reject('foo');
                }).then(then);
            }).not.toThrow();
        });

        it('should not throw when no handler given and promise was resolved', function () {
            var then = jasmine.createSpy('then');

            expect(function () {
                new Deferred(function (resolve, reject) {
                    resolve('foo');
                }).then();
            }).not.toThrow();
        });

    });

});