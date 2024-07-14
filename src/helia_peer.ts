import { createNode } from "./network/ipfs";

(async () => {
    const { helia, cleanup } = await createNode()
    // await cleanup()
})()