const zksync = require('zksync-crypto');

zksync.zksync_crypto_init();

let pk = zksync.privateKeyFromSeed(new Uint8Array(40));
console.log('pk=', pk)
const msg = (new TextEncoder('utf-8')).encode('ala ma kota i psa')
console.log('signature=', zksync.sign_musig(pk, msg))
