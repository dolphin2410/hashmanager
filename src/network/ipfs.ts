import { CID } from "multiformats/cid"
import fs from "fs"
import { FsBlockstore } from "blockstore-fs"
import { FsDatastore } from "datastore-fs"

export const createNode = async () => {
    const { createHelia } = await import("helia")

    const blockstore = new FsBlockstore("./ipfs-storage/")
    const datastore = new FsDatastore("./ipfs-datastore")

    const helia = await createHelia({
        blockstore,
        datastore
    })
    
    console.log(`ID: ${helia.libp2p.peerId}`)
    console.log("MULTIADDRs")

    console.log(helia.libp2p.getMultiaddrs())

    return helia
}

export async function download_from_ipfs(hash: string, target: string) {
    const { unixfs } = await import("@helia/unixfs")

    const helia = await createNode()
    const helia_fs = unixfs(helia)

    const stream = fs.createWriteStream(target)

    stream.once("open", async (_fd) => {
        const cid = CID.parse(hash)
        for await (const buf of helia_fs.cat(cid)) {
            stream.write(buf)
        }
        stream.end()
    })

    helia.stop()
}