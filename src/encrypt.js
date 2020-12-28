//Encryption/Decryption code taken from:
//https://gist.github.com/saulshanabrook/b74984677bccd08b028b30d9968623f5

import { AuthenticateUser } from './GraphqlQueries.js';

//Converts string to buffer
export function stringToBuf(str) {
    var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
}


//Converts buffer to string
export function bufToString(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}


//Weird non-whitespace characters appearing
//Cleans string
function cleanStr(str) {
    let accumulator = [];
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) !== 0) {
            accumulator.push(str.charAt(i));
        }
    }
    return accumulator.join("").trim();
}


function parseIntPswd(encryptedPswd) {
	//console.log("pass: " + encryptedPswd);
    let charArr = encryptedPswd.split(" ");
    let chars = [];
    for (var i = 0; i < charArr.length; i++) {
        const character = charArr[i];
        //console.log(character.toString());
        //console.log(String.fromCharCode(character));
        chars.push(String.fromCharCode(character));
	}
	//console.log(chars);
    return chars.join("");
}


//Loads most recently stored password data and authenticates user
export function loadKeyDecryptData(username, password, dbPswd) {
	callOnStore(function (store) {
		var getData = store.get(1);
		var str = '';
    	getData.onsuccess = async function() {
			var keys = getData.result.keys;
			
			var encrypted = stringToBuf(parseIntPswd(dbPswd));
			console.log(encrypted);

			try {
				var data = await decrypt(encrypted, keys);
				console.log(data);
				str = bufToString(data).toString().trim();
				
				let cleanString = cleanStr(str);
				console.log(cleanString);
				if (password === cleanString) {
					AuthenticateUser(username);
					console.log("Authentication succeeded");
				} else {
					console.log("Authentication failed, passwords do not match");
				}
			} catch (error) {
				console.log("Authentication failed");
			}
		};
	})
}



export function callOnStore(fn_) {

	// This works on all devices/browsers, and uses IndexedDBShim as a final fallback 
	var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

	// Open (or create) the database
	var open = indexedDB.open("MyDatabase", 1);

	// Create the schema
	open.onupgradeneeded = function() {
	    var db = open.result;
	    var store = db.createObjectStore("MyObjectStore", {keyPath: "id"});
	};


	open.onsuccess = function() {
	    // Start a new transaction
	    var db = open.result;
	    var tx = db.transaction("MyObjectStore", "readwrite");
	    var store = tx.objectStore("MyObjectStore");

	    fn_(store)


	    // Close the db when the transaction is done
	    tx.oncomplete = function() {
	        db.close();
	    };
	}
}

async function encryptDecrypt(data) {
	//var data = await makeData();
	console.log("generated data", data);
	var keys = await makeKeys()
	var encrypted = await encrypt(data, keys);
	console.log("encrypted", encrypted);
	var finalData = await decrypt(encrypted, keys);
	console.log("decrypted data", data);
}

/*
function makeData() {
	return window.crypto.getRandomValues(new Uint8Array(16))
}*/

export function makeKeys() {
	return window.crypto.subtle.generateKey(
    {
        name: "RSA-OAEP",
        modulusLength: 2048, //can be 1024, 2048, or 4096
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: {name: "SHA-256"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
    },
    false, //whether the key is extractable (i.e. can be used in exportKey)
    ["encrypt", "decrypt"] //must be ["encrypt", "decrypt"] or ["wrapKey", "unwrapKey"]
   )
}

export function encrypt(data, keys) {
	return window.crypto.subtle.encrypt(
    {
        name: "RSA-OAEP",
        //label: Uint8Array([...]) //optional
    },
    keys.publicKey, //from generateKey or importKey above
    data //ArrayBuffer of data you want to encrypt
	)
}


async function decrypt(data, keys) {
	return new Uint8Array(await window.crypto.subtle.decrypt(
	    {
	        name: "RSA-OAEP",
	        //label: Uint8Array([...]) //optional
	    },
	    keys.privateKey, //from generateKey or importKey above
	    data //ArrayBuffer of the data
	));
}