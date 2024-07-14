import { createNode } from "./network/ipfs";

(async () => {
    const { helia, cleanup } = await createNode()
    setTimeout(() => {
        cleanup()
    }, 2000)
})()