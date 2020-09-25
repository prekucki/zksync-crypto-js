let m = require('./zksync-crypto-js.js')
console.log('out = ', m.ccall('hello_world', 'string'))
console.log('out = ', m.ccall('one', 'number'))

function privateKeyFromSeed(input) {
    if (!(input instanceof Uint8Array)) {
        input = new Uint8Array(input);
    }
    const ptr = m._malloc(input.length);
    const out_ptr = m._malloc(32);
    try {
        m.HEAPU8.set(input, ptr);
        let result = m._private_key_from_seed(ptr, input.length, out_ptr);
        console.log('result=', result);
        let output = new Uint8Array(m.HEAPU8.buffer, out_ptr, 32);
        return output;
    }
    finally {
        m._free(ptr);
        m._free(out_ptr);
    }
}

function copyToHeap(input) {
    if (!(input instanceof Uint8Array)) {
        input = new Uint8Array(input);
    }
    const ptr = m._malloc(input.length);
    m.HEAPU8.set(input, ptr);
    return ptr;
}

function signMusig(private_key, msg) {
    const OUT_SIZE = 96;
    const private_key_ptr = copyToHeap(private_key);
    const msg_ptr = copyToHeap(msg);
    const out_ptr =  m._malloc(OUT_SIZE);
    try {
        m._sign_musig(private_key_ptr, private_key.length, msg_ptr, msg.length, out_ptr);
        return new Uint8Array(m.HEAPU8.buffer, out_ptr, OUT_SIZE);
    }
    finally {
        m._free(out_ptr);
        m._free(msg_ptr);
        m._free(private_key_ptr);
    }
}

let pk = privateKeyFromSeed(new Uint8Array(40));
console.log('pk=', pk)
console.log('signature=', signMusig(pk, "ala ma kota i psa"))
