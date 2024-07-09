import mqtt from "mqtt"
import { add_to_database, Metadata, data_from_hash } from "./database"
import { process_filter_query } from "./util"
import { download_from_ipfs } from "./network/ipfs"

const client = mqtt.connect("mqtt://localhost")

// topic format: rne/<from>/<to>/<action> ....action can be add_database
// message format: hash/action/status/timestamp

client.on("connect", () => {
    client.subscribe("rne/+/hashmanager/+", (err) => {
        if (err) console.log(err)
    })
})

client.on("message", (topic, message) => {
    let topic_split = topic.split("/")
    let source_objective = topic_split[1] // the target_objective can be all, hashmanager
    let target_objective = topic_split[2] // the target_objective can be all, hashmanager
    let target_action = topic_split[3]

    if (target_action == "add_to_database") {
        let message_split = message.toString().split("/")
    
        let hash = message_split[0]
        let action = message_split[1]
        let status = message_split[2]
        let timestamp = message_split[3]

        let metadata = new Metadata(hash, action, status, timestamp)

        console.log(metadata)

        download_from_ipfs(hash, `dummy/${hash}.txt`)

        add_to_database(metadata)
    } else if (target_action == "retrieve_with_filter") {
        let message_split = message.toString().split("/")

        if (message.length == 0) {
            console.log("Invalid Input: RETRIEVE_WITH_FILTER")
            return
        }

        const limit = message_split.pop()!!

        let filter_results = process_filter_query(message_split.join("/"), parseInt(limit))

        client.publish(`rne/hashmanager/${source_objective}/filtered_hash`, filter_results.map(e => e.hash).join("/"))
    } else if (target_action == "retrieve_metadata") {
        const hash = message.toString()

        const metadata = data_from_hash(hash)

        client.publish(`rne/hashmanager/${source_objective}/hash_metadata`, `${metadata.action}/${metadata.status}/${metadata.timestamp}`)
    }
})

// filter_with_query("date", "2023-04-20 01:00:00", "2023-04-30 01:00:00")
// filter_with_query("action", "dining_room", null)

console.log("hashmanager successfully launched")