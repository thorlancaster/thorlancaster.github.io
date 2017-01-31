/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* SHA-1 (FIPS 180-4) implementation in JavaScript                    (c) Chris Veness 2002-2016  */
/*                                                                                   MIT Licence  */
/* www.movable-type.co.uk/scripts/sha1.html                                                       */
/*                                                                                                */
/*  - see http://csrc.nist.gov/groups/ST/toolkit/secure_hashing.html                              */
/*        http://csrc.nist.gov/groups/ST/toolkit/examples.html                                    */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';


/**
 * SHA-1 hash function reference implementation.
 *
 * This is a direct implementation of FIPS 180-4, without any optimisations. It is intended to aid
 * understanding of the algorithm rather than for production use, though it could be used where
 * performance is not critical.
 *
 * @namespace
 */
var Sha1 = {};


/**
 * Generates SHA-1 hash of string.
 *
 * @param   {string} msg - (Unicode) string to be hashed.
 * @param   {Object} [options]
 * @param   {string} [options.msgFormat=string] - Message format: 'string' for JavaScript string
 *   (gets converted to UTF-8 for hashing); 'hex-bytes' for string of hex bytes ('616263' = 'abc') .
 * @param   {string} [options.outFormat=hex] - Output format: 'hex' for string of contiguous
 *   hex bytes; 'hex-w' for grouping hex bytes into groups of (4 byte / 8 character) words.
 * @returns {string} Hash of msg as hex character string.
 */
Sha1.hash = function(msg, options) {
    var defaults = { msgFormat: 'string', outFormat: 'hex' };
    var opt = Object.assign(defaults, options);

    switch (opt.msgFormat) {
        default: // default is to convert string to UTF-8, as SHA only deals with byte-streams
        case 'string':   msg = Sha1.utf8Encode(msg);       break;
        case 'hex-bytes':msg = Sha1.hexBytesToString(msg); break; // mostly for running tests
    }

    // constants [§4.2.1]
    var K = [ 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6 ];

    // initial hash value [§5.3.1]
    var H = [ 0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0 ];

    // PREPROCESSING [§6.1.1]

    msg += String.fromCharCode(0x80);  // add trailing '1' bit (+ 0's padding) to string [§5.1.1]

    // convert string msg into 512-bit/16-integer blocks arrays of ints [§5.2.1]
    var l = msg.length/4 + 2; // length (in 32-bit integers) of msg + ‘1’ + appended length
    var N = Math.ceil(l/16);  // number of 16-integer-blocks required to hold 'l' ints
    var M = new Array(N);

    for (var i=0; i<N; i++) {
        M[i] = new Array(16);
        for (var j=0; j<16; j++) {  // encode 4 chars per integer, big-endian encoding
            M[i][j] = (msg.charCodeAt(i*64+j*4)<<24) | (msg.charCodeAt(i*64+j*4+1)<<16) |
                (msg.charCodeAt(i*64+j*4+2)<<8) | (msg.charCodeAt(i*64+j*4+3));
        } // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
    }
    // add length (in bits) into final pair of 32-bit integers (big-endian) [§5.1.1]
    // note: most significant word would be (len-1)*8 >>> 32, but since JS converts
    // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
    M[N-1][14] = ((msg.length-1)*8) / Math.pow(2, 32); M[N-1][14] = Math.floor(M[N-1][14]);
    M[N-1][15] = ((msg.length-1)*8) & 0xffffffff;

    // HASH COMPUTATION [§6.1.2]

    for (var i=0; i<N; i++) {
        var W = new Array(80);

        // 1 - prepare message schedule 'W'
        for (var t=0;  t<16; t++) W[t] = M[i][t];
        for (var t=16; t<80; t++) W[t] = Sha1.ROTL(W[t-3] ^ W[t-8] ^ W[t-14] ^ W[t-16], 1);

        // 2 - initialise five working variables a, b, c, d, e with previous hash value
        var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4];

        // 3 - main loop (use JavaScript '>>> 0' to emulate UInt32 variables)
        for (var t=0; t<80; t++) {
            var s = Math.floor(t/20); // seq for blocks of 'f' functions and 'K' constants
            var T = (Sha1.ROTL(a,5) + Sha1.f(s,b,c,d) + e + K[s] + W[t]) >>> 0;
            e = d;
            d = c;
            c = Sha1.ROTL(b, 30) >>> 0;
            b = a;
            a = T;
        }

        // 4 - compute the new intermediate hash value (note 'addition modulo 2^32' – JavaScript
        // '>>> 0' coerces to unsigned UInt32 which achieves modulo 2^32 addition)
        H[0] = (H[0]+a) >>> 0;
        H[1] = (H[1]+b) >>> 0;
        H[2] = (H[2]+c) >>> 0;
        H[3] = (H[3]+d) >>> 0;
        H[4] = (H[4]+e) >>> 0;
    }

    // convert H0..H4 to hex strings (with leading zeros)
    for (var h=0; h<H.length; h++) H[h] = ('00000000'+H[h].toString(16)).slice(-8);

    // concatenate H0..H4, with separator if required
    var separator = opt.outFormat=='hex-w' ? ' ' : '';

    return H.join(separator);
};


/**
 * Function 'f' [§4.1.1].
 * @private
 */
Sha1.f = function(s, x, y, z)  {
    switch (s) {
        case 0: return (x & y) ^ (~x & z);           // Ch()
        case 1: return  x ^ y  ^  z;                 // Parity()
        case 2: return (x & y) ^ (x & z) ^ (y & z);  // Maj()
        case 3: return  x ^ y  ^  z;                 // Parity()
    }
};

/**
 * Rotates left (circular left shift) value x by n positions [§3.2.5].
 * @private
 */
Sha1.ROTL = function(x, n) {
    return (x<<n) | (x>>>(32-n));
};


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */


/**
 * Encodes multi-byte string to utf8 - monsur.hossa.in/2012/07/20/utf-8-in-javascript.html
 */
Sha1.utf8Encode = function(str) {
    return unescape(encodeURIComponent(str));
};


/**
 * Converts a string of a sequence of hex numbers to a string of characters (eg '616263' => 'abc').
 */
Sha1.hexBytesToString = function(hexStr) {
    hexStr = hexStr.replace(' ', ''); // allow space-separated groups
    var str = '';
    for (var i=0; i<hexStr.length; i+=2) {
        str += String.fromCharCode(parseInt(hexStr.slice(i, i+2), 16));
    }
    return str;
};


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
if (typeof module != 'undefined' && module.exports) module.exports = Sha1; // CommonJs export




/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Block TEA (xxtea) Tiny Encryption Algorithm                        (c) Chris Veness 2002-2016  */
/*  - www.movable-type.co.uk/scripts/tea-block.html                                  MIT Licence  */
/*                                                                                                */
/* Algorithm: David Wheeler & Roger Needham, Cambridge University Computer Lab                    */
/*            http://www.cl.cam.ac.uk/ftp/papers/djw-rmn/djw-rmn-tea.html (1994)                  */
/*            http://www.cl.cam.ac.uk/ftp/users/djw3/xtea.ps (1997)                               */
/*            http://www.cl.cam.ac.uk/ftp/users/djw3/xxtea.ps (1998)                              */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';


/**
 * Tiny Encryption Algorithm
 *
 * @namespace
 */
var Tea = {};


/**
 * Encrypts text using Corrected Block TEA (xxtea) algorithm.
 *
 * @param   {string} plaintext - String to be encrypted (multi-byte safe).
 * @param   {string} password - Password to be used for encryption (1st 16 chars).
 * @returns {string} Encrypted text (encoded as base64).
 */
Tea.encrypt = function(plaintext, password) {
    plaintext = String(plaintext);
    password = String(password);

    if (plaintext.length == 0) return('');  // nothing to encrypt

    //  v is n-word data vector; converted to array of longs from UTF-8 string
    var v = Tea.strToLongs(Tea.utf8Encode(plaintext));
    //  k is 4-word key; simply convert first 16 chars of password as key
    var k = Tea.strToLongs(Tea.utf8Encode(password).slice(0,16));

    v = Tea.encode(v, k);

    // convert array of longs to string
    var ciphertext = Tea.longsToStr(v);

    // convert binary string to base64 ascii for safe transport
    return Tea.base64Encode(ciphertext);
};


/**
 * Decrypts text using Corrected Block TEA (xxtea) algorithm.
 *
 * @param   {string} ciphertext - String to be decrypted.
 * @param   {string} password - Password to be used for decryption (1st 16 chars).
 * @returns {string} Decrypted text.
 * @throws  {Error}  Invalid ciphertext
 */
Tea.decrypt = function(ciphertext, password) {
    ciphertext = String(ciphertext);
    password = String(password);

    if (ciphertext.length == 0) return('');

    //  v is n-word data vector; converted to array of longs from base64 string
    var v = Tea.strToLongs(Tea.base64Decode(ciphertext));
    //  k is 4-word key; simply convert first 16 chars of password as key
    var k = Tea.strToLongs(Tea.utf8Encode(password).slice(0,16));

    v = Tea.decode(v, k);

    var plaintext = Tea.longsToStr(v);

    // strip trailing null chars resulting from filling 4-char blocks:
    plaintext = plaintext.replace(/\0+$/,'');

    return Tea.utf8Decode(plaintext);
};


/**
 * XXTEA: encodes array of unsigned 32-bit integers using 128-bit key.
 *
 * @param   {number[]} v - Data vector.
 * @param   {number[]} k - Key.
 * @returns {number[]} Encoded vector.
 */
Tea.encode = function(v, k) {
    if (v.length < 2) v[1] = 0;  // algorithm doesn't work for n<2 so fudge by adding a null
    var n = v.length;

    var z = v[n-1], y = v[0], delta = 0x9e3779b9;
    var mx, e, q = Math.floor(6 + 52/n), sum = 0;

    while (q-- > 0) {  // 6 + 52/n operations gives between 6 & 32 mixes on each word
        sum += delta;
        e = sum>>>2 & 3;
        for (var p = 0; p < n; p++) {
            y = v[(p+1)%n];
            mx = (z>>>5 ^ y<<2) + (y>>>3 ^ z<<4) ^ (sum^y) + (k[p&3 ^ e] ^ z);
            z = v[p] += mx;
        }
    }

    return v;
};


/**
 * XXTEA: decodes array of unsigned 32-bit integers using 128-bit key.
 *
 * @param   {number[]} v - Data vector.
 * @param   {number[]} k - Key.
 * @returns {number[]} Decoded vector.
 */
Tea.decode = function(v, k) {
    var n = v.length;

    var z = v[n-1], y = v[0], delta = 0x9e3779b9;
    var mx, e, q = Math.floor(6 + 52/n), sum = q*delta;

    while (sum != 0) {
        e = sum>>>2 & 3;
        for (var p = n-1; p >= 0; p--) {
            z = v[p>0 ? p-1 : n-1];
            mx = (z>>>5 ^ y<<2) + (y>>>3 ^ z<<4) ^ (sum^y) + (k[p&3 ^ e] ^ z);
            y = v[p] -= mx;
        }
        sum -= delta;
    }

    return v;
};


/**
 * Converts string to array of longs (each containing 4 chars).
 * @private
 */
Tea.strToLongs = function(s) {
    // note chars must be within ISO-8859-1 (Unicode code-point <= U+00FF) to fit 4/long
    var l = new Array(Math.ceil(s.length/4));
    for (var i=0; i<l.length; i++) {
        // note little-endian encoding - endianness is irrelevant as long as it matches longsToStr()
        l[i] = s.charCodeAt(i*4)        + (s.charCodeAt(i*4+1)<<8) +
              (s.charCodeAt(i*4+2)<<16) + (s.charCodeAt(i*4+3)<<24);
    } // note running off the end of the string generates nulls since bitwise operators treat NaN as 0
    return l;
};


/**
 * Converts array of longs to string.
 * @private
 */
Tea.longsToStr = function(l) {
    var str = '';
    for (var i=0; i<l.length; i++) {
        str += String.fromCharCode(l[i] & 0xff, l[i]>>>8 & 0xff, l[i]>>>16 & 0xff, l[i]>>>24 & 0xff);
    }
    return str;
};


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */


/**
 * Encodes multi-byte string to utf8 - monsur.hossa.in/2012/07/20/utf-8-in-javascript.html
 */
Tea.utf8Encode = function(str) {
    return unescape(encodeURIComponent(str));
};

/**
 * Decodes utf8 string to multi-byte
 */
Tea.utf8Decode = function(utf8Str) {
    try {
        return decodeURIComponent(escape(utf8Str));
    } catch (e) {
        return utf8Str; // invalid UTF-8? return as-is
    }
};


/**
 * Encodes base64 - developer.mozilla.org/en-US/docs/Web/API/window.btoa, nodejs.org/api/buffer.html
 */
Tea.base64Encode = function(str) {
    if (typeof btoa != 'undefined') return btoa(str); // browser
    if (typeof Buffer != 'undefined') return new Buffer(str, 'binary').toString('base64'); // Node.js
    throw new Error('No Base64 Encode');
};

/**
 * Decodes base64
 */
Tea.base64Decode = function(b64Str) {
    if (typeof atob == 'undefined' && typeof Buffer == 'undefined') throw new Error('No base64 decode');
    try {
        if (typeof atob != 'undefined') return atob(b64Str); // browser
        if (typeof Buffer != 'undefined') return new Buffer(b64Str, 'base64').toString('binary'); // Node.js
    } catch (e) {
        throw new Error('Invalid ciphertext');
    }
};


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
if (typeof module != 'undefined' && module.exports) module.exports = Tea; // CommonJS export