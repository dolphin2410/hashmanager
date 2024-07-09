import { CID } from "multiformats/cid"
import fs from "fs"
import { FsBlockstore } from "blockstore-fs"

const createNode = async () => {
    const { createHelia } = await import("helia")
    const { unixfs } = await import("@helia/unixfs")

    const blockstore = new FsBlockstore("./ipfs-storage/")

    const helia = await createHelia({
        blockstore
    })
    
    const helia_fs = unixfs(helia)

    return helia_fs
}

export async function download_from_ipfs(hash: string, target: string) {
    const heliaNode = await createNode()

    const stream = fs.createWriteStream(target)

    stream.once("open", async (_fd) => {
        const cid = CID.parse(hash)
        for await (const buf of heliaNode.cat(cid)) {
            stream.write(buf)
        }
        stream.end()
    })
}