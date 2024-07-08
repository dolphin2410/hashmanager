import mqtt from "mqtt"
import { add_to_database, Metadata } from "./database.ts"
import { process_filter_query } from "./util.ts"

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

        add_to_database(metadata)
    } else if (target_action == "retrieve_with_filter") {
        let filter_results = process_filter_query(message.toString())

        client.publish(`rne/hashmanager/${source_objective}/return_data`, filter_results.map(e => e.hash).join("/"))
    }
})

// filter_with_query("date", "2023-04-20 01:00:00", "2023-04-30 01:00:00")
// filter_with_query("action", "dining_room", null)

console.log("hashmanager successfully launched")