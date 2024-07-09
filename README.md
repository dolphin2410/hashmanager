# HashManager For RNE
Database for IPFS Hashes

## How To Use
#### General Use
Topic: `rne/{from}/{to}/{request_type}`

#### Adding data to the database
Topic: `rne/client/hashmanager/add_to_database`

Message: `{hash}/{Action}/{Status}/{SQL Timestamp}`

Explanation: accepts hash, action, status and an sql timestamp. Hash should be a string, `action` can be `bathroom`, `dining_room`, etc. `status` can be `sitting`, `standing`, `lying_down`, etc. timestamp should be in the format of `YY-MM-DD HH:MM:SS`.

#### Retrieving hash from the database
Topic: `rne/client/hashmanager/retrieve_with_filter`

Message: `{filter_type}/{filter_arg_1}/{filter_arg_2(optional)}`

Explanation: `filter_type` can be either `date`, `action`, `status`. If `filter_type` is `date`, it accepts two arguments, and filters hashes which are timestamped between the two given arguments. If `filter_type` is either `action` or `status`, it accepts one argument and matches hashes that has the corresponding `action` or `status` metadata.

#### Retrieving metadata from the database
Topic: `rne/client/hashmanager/retrieve_metadata`

Message: `{hash}`

Explanation: returns metadata with the given `hash`

## TODO
- multiple filters at once