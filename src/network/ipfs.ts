import { createHelia } from "helia"

import { CID } from "multiformats/cid"
import fs from "fs"
import { FsBlockstore } from "blockstore-fs"
import { FsDatastore } from "datastore-fs"

export const createNode = async () => {
    const blockstore = new FsBlockstore("./ipfs-storage/")
    const datastore = new FsDatastore("./ipfs-datastore")

    const helia = await createHelia({
        blockstore,
        datastore
    })
    
    console.log(`ID: ${helia.libp2p.peerId}`)
    console.log("MULTIADDRs")

    console.log(helia.libp2p.getMultiaddrs())

    const cleanup = async () => {
        await blockstore.close()
        console.log("blockstore closed")
        await datastore.close()
        console.log("datastore closed")
        await helia.libp2p.stop()
        console.log("libp2p stopped")
        await helia.stop()
        console.log("helia closed")
    }

    return { helia, cleanup }
}

export async function download_from_ipfs(hash: string, target: string) {
    const { unixfs } = await import("@helia/unixfs")

    const { helia, cleanup } = await createNode()
    const helia_fs = unixfs(helia)

    const stream = fs.createWriteStream(target)

    stream.once("open", async (_fd) => {
        const cid = CID.parse(hash)
        for await (const buf of helia_fs.cat(cid)) {
            stream.write(buf)
        }
        stream.end()
    })

    cleanup()
}