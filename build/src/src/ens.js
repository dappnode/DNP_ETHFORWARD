const Web3 = require('web3');
const CID = require('cids');
const multihash = require('multihashes');
const multicodec = require('multicodec');

const ensAddr = '0x314159265dd8dbb310642f98f50c066173c1259b';
const ensAbi = require('./abi/ens.json');
const resolverAbi = require('./abi/resolverAbi.json');

const WEB3HOSTWS = process.env.WEB3HOSTWS || "ws://my.ethchain.dnp.dappnode.eth:8546";

const TEXT_INTERFACE_ID = "0x59d1d43c";
const CONTENTHASH_INTERFACE_ID = "0xbc1c58d1";
const CONTENT_INTERFACE_ID = "0xd8389dc5";

var web3 = new Web3(WEB3HOSTWS);
console.log('Connected web3 to ' + WEB3HOSTWS);

setInterval(function() {
    web3.eth.net.isListening().then().catch(e => {
        console.log('[ - ] Lost connection to the node: ' + WEB3HOSTWS + ', reconnecting');
        web3.setProvider(WEB3HOSTWS);
    })
}, 10000)

function namehash(name) {
    var node = '0x0000000000000000000000000000000000000000000000000000000000000000';
    if (name != '') {
        var labels = name.split(".");
        for (var i = labels.length - 1; i >= 0; i--) {
            node = web3.utils.sha3(node + web3.utils.sha3(labels[i]).slice(2), { encoding: 'hex' });
        }
    }
    return node.toString();
}

function decodeContentHash(contentHash) {
    if (contentHash === '0x0000000000000000000000000000000000000000000000000000000000000000') {
        return
    }
    if (contentHash !== '0x') {
        const hex = contentHash.substring(2)
        const buf = multihash.fromHexString(hex)
        return '/ipfs/' + multihash.toB58String(multihash.encode(buf, 'sha2-256'))
    } else {
        return
    }
}

async function getResolverType(resolverAddress) {
    var resolver = new web3.eth.Contract(resolverAbi, resolverAddress);  
    if(await resolver.methods.supportsInterface(CONTENTHASH_INTERFACE_ID).call()) return CONTENTHASH_INTERFACE_ID;
    if(await resolver.methods.supportsInterface(TEXT_INTERFACE_ID).call()) return TEXT_INTERFACE_ID;
    if(await resolver.methods.supportsInterface(CONTENT_INTERFACE_ID).call()) return CONTENT_INTERFACE_ID;
    else return null;
}

exports.getContent = async (name) => {

    const node = namehash(name);
    console.log('Request: ' + name + ', computed node: ' + node);
    var ens = new web3.eth.Contract(ensAbi, ensAddr);

    try {
        web3.eth.net.isListening().then().catch(e => { return "0x"; })
        const resolverAddress = await ens.methods.resolver(node).call();
        console.log("resolverAddress: " + resolverAddress);
        if (resolverAddress === '0x0000000000000000000000000000000000000000') {
            return "0x404";
        }
        const resolverType = await getResolverType(resolverAddress)
        console.log('Resolver type: ' + resolverType)
        const resolver = new web3.eth.Contract(resolverAbi, resolverAddress);
        let content;
        switch (resolverType) {
            case CONTENTHASH_INTERFACE_ID:
                const contenthash = await resolver.methods.contenthash(node).call()
                if(contenthash !== '0x'){
                    const contentHashEncoded = Buffer.from(contenthash.slice(2),'hex');
                    console.log('content codec: ' + multicodec.getCodec(contentHashEncoded))
                    let value = multicodec.getCodec(contentHashEncoded).startsWith('ipfs') ? multicodec.rmPrefix(contentHashEncoded) : null
                    if(value){
                        let cid = new CID(value);	
                        content = '/ipfs/' + multihash.toB58String(cid.multihash)
                        console.log('content decoded: ' + content)
                    }
                    break
                }
            /* this part is deprecated, it is maintained to preserve compatibility */
            case TEXT_INTERFACE_ID:
                content = await resolver.methods.text(node, "dnslink").call();
                content = content.startsWith('/ipfs/') ? content : null
                if (content || resolverType == CONTENTHASH_INTERFACE_ID)
                    break                
            case CONTENT_INTERFACE_ID:
                const contentEncoded = await resolver.methods.content(node).call();
                console.log('contentEncoded: ' + contentEncoded)
                content = decodeContentHash(contentEncoded)
                console.log('content decoded: ' + content)
                break
            default:
                console.error('Unkown type')
        }
        return content || "0x404"
    } catch (e) {
        console.log(e.message)
        return "0x"
    }
}