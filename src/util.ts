import { filter_with_query, Metadata } from "./database"

export function process_filter_query(input_string: string, limit: number): Metadata[] {
    let parse_split = input_string.split("/")

    if (parse_split.length < 2) {
        console.log("Too Less Arguments")
        return []
    }

    if (parse_split.length > 3) {
        console.log("Too Many Arguments")
        return []
    }

    let query_action = parse_split.shift()!! // removed first element from parse_split


    let arg1 = parse_split[0]
    let arg2 = parse_split.length == 2 ? parse_split[1] : null

    return filter_with_query(query_action, limit, arg1, arg2)
}