'use strict';

require('../../../TestHelper');

describe("features/key-checksum", function() {

    beforeEach(bootstrapDart380());

	it("should calculate pn checksum", inject(function (keyChecksum) {
		expect(keyChecksum.getChecksum("751")).toBe("7513");
		expect(keyChecksum.getChecksum("442")).toBe("4422");
		expect(keyChecksum.getChecksum("221")).toBe("2211");
		expect(keyChecksum.getChecksum("330")).toBe("3300");
		expect(keyChecksum.getChecksum("551")).toBe("5511");
		expect(keyChecksum.getChecksum("432")).toBe("4325");
		expect(keyChecksum.getChecksum("562")).toBe("5621");
		expect(keyChecksum.getChecksum("320")).toBe("3201");
		expect(keyChecksum.getChecksum("510")).toBe("5104");
		expect(keyChecksum.getChecksum("350")).toBe("3506");
	}));

	it("should invalidate pn", inject(function (keyChecksum) {
		expect(keyChecksum.isValidGroup("7510")).toBe(false);
		expect(keyChecksum.isValidGroup("4421")).toBe(false);
		expect(keyChecksum.isValidGroup("2210")).toBe(false);
	}));

	it("should validate pn", inject(function (keyChecksum) {
		expect(keyChecksum.isValidGroup("7513")).toBe(true);
		expect(keyChecksum.isValidGroup("4422")).toBe(true);
		expect(keyChecksum.isValidGroup("2211")).toBe(true);
	}));

	it("should calculate pny", inject(function (keyChecksum) {
		expect(keyChecksum.getChecksum(["4422", "2211", "3300", "5511", "4325", "5621", "3201", "5104"])).toBe("762");
	}));

	it("should generate valid pn", inject(function (keyChecksum) {
		var keys = keyChecksum.next();

		for (var i=0; i < keys.groups.length; i++) {
			expect(keyChecksum.isValidGroup(keys.groups[i])).toBe(true);
		}

		expect(keys.checksum).toBe(keyChecksum.getChecksum(keys.groups));
	}));

});