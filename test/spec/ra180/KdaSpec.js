'use strict';

require('../../TestHelper');

describe("KDA", function() {

    beforeEach(bootstrapDart380());

    beforeEach(inject(function(mod, selfTest, eventBus) {
        var isReady = false;
        eventBus.on('ready', function () {
            isReady = true;
        });
        mod.set(mod.SKYDD);
        while (!isReady) {
            jasmine.clock().tick(1000);
        }
    }));

    it("should hide BD1,BD2,SYNK and PNY while in KLAR", inject(function (mod, keyboard, smallDisplay) {
        mod.set(mod.KLAR);
        keyboard.trigger('4');
        expect(smallDisplay.toString()).toMatch(/^FR\:[0-9]{5}$/);
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe("  (KDA) ");
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe("        ");

    }));

    it("should have correct standard FR values", inject(function (mod, keyboard, smallDisplay, channel) {
        keyboard.trigger('4');
        channel.set(1);
        expect(smallDisplay.toString()).toBe("FR:30025");
        channel.set(2);
        expect(smallDisplay.toString()).toBe("FR:40025");
        channel.set(3);
        expect(smallDisplay.toString()).toBe("FR:50025");
        channel.set(4);
        expect(smallDisplay.toString()).toBe("FR:60025");
        channel.set(5);
        expect(smallDisplay.toString()).toBe("FR:70025");
        channel.set(6);
        expect(smallDisplay.toString()).toBe("FR:80025");
        channel.set(7);
        expect(smallDisplay.toString()).toBe("FR:87975");
        channel.set(8);
        expect(smallDisplay.toString()).toBe("FR:42025");
    }));

    it("should have correct standard BD1 values", inject(function (mod, keyboard, smallDisplay, channel) {
        keyboard.trigger('4');
        keyboard.trigger('⏎');
        channel.set(1);
        expect(smallDisplay.toString()).toBe("BD1:9000");
        channel.set(2);
        expect(smallDisplay.toString()).toBe("BD1:9000");
        channel.set(3);
        expect(smallDisplay.toString()).toBe("BD1:9000");
        channel.set(4);
        expect(smallDisplay.toString()).toBe("BD1:9000");
        channel.set(5);
        expect(smallDisplay.toString()).toBe("BD1:9000");
        channel.set(6);
        expect(smallDisplay.toString()).toBe("BD1:9000");
        channel.set(7);
        expect(smallDisplay.toString()).toBe("BD1:9000");
        channel.set(8);
        expect(smallDisplay.toString()).toBe("BD1:9000");
    }));

    it("should be possible to disable, and re-enable, KLAR", inject(function (keyboard, smallDisplay) {
        keyboard.trigger('4');
        keyboard.trigger('ÄND');
        keyboard.trigger('*');
        keyboard.trigger('*');
        expect(smallDisplay.toString()).toBe("FR:**   ");
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toMatch(/^\*\*:[0-9]{5}$/);
        keyboard.trigger('SLT');

        keyboard.trigger('4');
        expect(smallDisplay.toString()).toMatch(/^\*\*:[0-9]{5}$/);
        keyboard.trigger('ÄND');
        keyboard.trigger('*');
        keyboard.trigger('*');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toMatch(/^FR:[0-9]{5}$/);
        keyboard.trigger('SLT');
    }));

    it("should not be possible to disable KLAR in KLAR-mod", inject(function (mod, keyboard, smallDisplay) {
        mod.set(mod.KLAR);
        keyboard.trigger('4');
        keyboard.trigger('ÄND');
        keyboard.trigger('*');
        keyboard.trigger('*');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe("FR:     ");
    }));

    it("should auto re-enable KLAR while in KLAR-mod", inject(function(mod, keyboard, smallDisplay) {
        keyboard.trigger('4');
        keyboard.trigger('ÄND');
        keyboard.trigger('*');
        keyboard.trigger('*');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toMatch(/^\*\*:[0-9]{5}$/);
        mod.set(mod.KLAR);
        expect(smallDisplay.toString()).toBe("**:00000");
        mod.set(mod.SKYDD);
        expect(smallDisplay.toString()).toMatch(/^\*\*:[0-9]{5}$/);
    }));

    it("should not display BD2 when BD1 is 9000", inject(function(keyboard, smallDisplay) {
        keyboard.trigger('4');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).not.toMatch(/^BD2:[0-9]{4}$/);
    }));

    it("should display BD2 when BD1 is not 9000", inject(function(keyboard, smallDisplay) {
        keyboard.trigger('4');
        keyboard.trigger('⏎');
        keyboard.trigger('ÄND');
        keyboard.triggerMany("3040");
        keyboard.trigger('⏎');
        keyboard.triggerMany("5060");
        keyboard.trigger('⏎');
        keyboard.trigger('SLT');

        keyboard.trigger('4');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toMatch(/^BD2:[0-9]{4}$/);
    }));

    it("should navigate KDA", inject(function (keyboard, smallDisplay) {
        keyboard.trigger('4');
        expect(smallDisplay.toString()).toMatch(/^FR:[0-9]{5}$/);
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toMatch(/^BD1:[0-9]{4}$/);
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe("SYNK=NEJ");
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe("PNY:### ");
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe("  (KDA) ");
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe("        ");
    }));

    it("should return to main menu on SLT from FR", inject(function(keyboard, smallDisplay) {
        keyboard.trigger('4');
        expect(smallDisplay.toString()).toMatch(/^FR:[0-9]{5}$/);
        keyboard.trigger('SLT');
        expect(smallDisplay.toString()).toBe("        ");
    }));

    it("should return to main menu on SLT from BD1", inject(function(keyboard, smallDisplay) {
        keyboard.trigger('4');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toMatch(/^BD1:[0-9]{4}$/);
        keyboard.trigger('SLT');
        expect(smallDisplay.toString()).toBe("        ");
    }));

    it("should return to main menu on SLT from SYNK", inject(function(keyboard, smallDisplay) {
        keyboard.trigger('4');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe("SYNK=NEJ");
        keyboard.trigger('SLT');
        expect(smallDisplay.toString()).toBe("        ");
    }));

    it("should return to main menu on SLT from PNY", inject(function(keyboard, smallDisplay) {
        keyboard.trigger('4');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe("PNY:### ");
        keyboard.trigger('SLT');
        expect(smallDisplay.toString()).toBe("        ");
    }));

    it("should return to main menu on SLT from KDA", inject(function(keyboard, smallDisplay) {
        keyboard.trigger('4');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe("  (KDA) ");
        keyboard.trigger('SLT');
        expect(smallDisplay.toString()).toBe("        ");
    }));

    it("should allow modification of SYNK when in sync", inject(function(keyboard, smallDisplay, kdaMenu, memory) {
        var kda = memory.get('kda');
        kda[0].synk = true;
        memory.set('kda', kda);

        keyboard.trigger('4');
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe("SYNK:JA ");
    }));

    it("should allow edit of frequency", inject(function (keyboard, smallDisplay) {
        keyboard.trigger('4');
        keyboard.trigger('ÄND');
        keyboard.trigger('6');
        keyboard.trigger('5');
        keyboard.trigger('4');
        keyboard.trigger('3');
        keyboard.trigger('1');
        keyboard.trigger('⏎');
        keyboard.trigger('SLT');
        keyboard.trigger('4');
        expect(smallDisplay.toString()).toBe("FR:65431");
    }));

    it("should reject frequency lower than 30.000 MHz", inject(function (keyboard, smallDisplay) {
        keyboard.trigger('4');
        keyboard.trigger('ÄND');
        keyboard.trigger('2');
        keyboard.trigger('9');
        keyboard.trigger('9');
        keyboard.trigger('9');
        keyboard.trigger('9');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).not.toBe("FR:29999");
    }));

    it("should allow frequency equal to 30.000 MHz", inject(function (keyboard, smallDisplay) {
        keyboard.trigger('4');
        keyboard.trigger('ÄND');
        keyboard.trigger('3');
        keyboard.trigger('0');
        keyboard.trigger('0');
        keyboard.trigger('0');
        keyboard.trigger('0');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe("FR:30000");
    }));

    it("should reject frequency higher than 87.975 MHz", inject(function (keyboard, smallDisplay) {
        keyboard.trigger('4');
        keyboard.trigger('ÄND');
        keyboard.trigger('8');
        keyboard.trigger('7');
        keyboard.trigger('9');
        keyboard.trigger('7');
        keyboard.trigger('6');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).not.toBe("FR:87976");
    }));

    it("should allow frequency equal to 87.975 MHz", inject(function (keyboard, smallDisplay) {
        keyboard.trigger('4');
        keyboard.trigger('ÄND');
        keyboard.trigger('8');
        keyboard.trigger('7');
        keyboard.trigger('9');
        keyboard.trigger('7');
        keyboard.trigger('5');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe("FR:87975");
    }));

    it("should modify BD2 after BD1", inject(function (keyboard, smallDisplay) {
        keyboard.trigger('4');
        keyboard.trigger('⏎');
        keyboard.trigger('ÄND');
        keyboard.trigger('4');
        keyboard.trigger('5');
        keyboard.trigger('5');
        keyboard.trigger('5');
        expect(smallDisplay.toString()).toBe("BD1:4555");
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe("BD2:    ");
        keyboard.trigger('6');
        keyboard.trigger('5');
        keyboard.trigger('7');
        keyboard.trigger('5');
        expect(smallDisplay.toString()).toBe("BD2:6575");
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe("BD1:4555");
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe("BD2:6575");
    }));

    it("should modify BD1 on AND for BD2", inject(function (keyboard, smallDisplay) {
        keyboard.trigger('4');
        keyboard.trigger('⏎');
        keyboard.trigger('ÄND');
        keyboard.triggerMany("3040");
        keyboard.trigger('⏎');
        keyboard.triggerMany("5060");
        keyboard.trigger('⏎');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toMatch(/^BD2:[0-9]{4}$/);
        keyboard.trigger('ÄND');
        expect(smallDisplay.toString()).toBe("BD1:    ");
    }));

    it("should modify PNY via PN1-8", inject(function (keyboard, smallDisplay) {
        keyboard.trigger('4');   // FR
        keyboard.trigger('⏎'); // BD1
        keyboard.trigger('⏎'); // SYNK
        keyboard.trigger('⏎'); // PNY=###
        keyboard.trigger('ÄND');
        expect(smallDisplay.toString()).toBe("PN1:    ");
        keyboard.trigger('4');
        keyboard.trigger('4');
        keyboard.trigger('2');
        keyboard.trigger('2');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe("PN2:    ");
        keyboard.trigger('2');
        keyboard.trigger('2');
        keyboard.trigger('1');
        keyboard.trigger('1');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe("PN3:    ");
        keyboard.trigger('3');
        keyboard.trigger('3');
        keyboard.trigger('0');
        keyboard.trigger('0');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe("PN4:    ");
        keyboard.trigger('5');
        keyboard.trigger('5');
        keyboard.trigger('1');
        keyboard.trigger('1');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe("PN5:    ");
        keyboard.trigger('4');
        keyboard.trigger('3');
        keyboard.trigger('2');
        keyboard.trigger('5');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe("PN6:    ");
        keyboard.trigger('5');
        keyboard.trigger('6');
        keyboard.trigger('2');
        keyboard.trigger('1');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe("PN7:    ");
        keyboard.trigger('3');
        keyboard.trigger('2');
        keyboard.trigger('0');
        keyboard.trigger('1');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toBe("PN8:    ");
        keyboard.trigger('5');
        keyboard.trigger('1');
        keyboard.trigger('0');
        keyboard.trigger('4');
        keyboard.trigger('⏎');
        expect(smallDisplay.toString()).toMatch(/^PNY:[0-9]{3} $/);
        keyboard.trigger('SLT');
        keyboard.trigger('4');   // FR
        keyboard.trigger('⏎'); // BD1
        keyboard.trigger('⏎'); // SYNK
        keyboard.trigger('⏎'); // PNY=###
        expect(smallDisplay.toString()).toMatch(/^PNY:[0-9]{3} $/);
    }));

    it("should refresh FR value when changing channel", inject(function (keyboard, smallDisplay, channel) {
        keyboard.trigger('4');

        channel.set(2);
        var channel2 = smallDisplay.toString();
        channel.set(3);
        var channel3 = smallDisplay.toString();
        channel.set(4);
        var channel4 = smallDisplay.toString();
        channel.set(5);
        var channel5 = smallDisplay.toString();
        channel.set(6);
        var channel6 = smallDisplay.toString();
        channel.set(7);
        var channel7 = smallDisplay.toString();
        channel.set(8);
        var channel8 = smallDisplay.toString();
        channel.set(1);
        var channel1 = smallDisplay.toString();

        expect(channel1).not.toBe(channel2);
        expect(channel2).not.toBe(channel3);
        expect(channel3).not.toBe(channel4);
        expect(channel4).not.toBe(channel5);
        expect(channel5).not.toBe(channel6);
        expect(channel6).not.toBe(channel7);
        expect(channel7).not.toBe(channel8);
        expect(channel8).not.toBe(channel1);
    }));
});