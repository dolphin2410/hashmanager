import Database from "better-sqlite3"

export class Metadata {
  hash: string
  action: string
  status: string
  timestamp: string

  constructor(hash: string, action: string, status: string, timestamp: string) {
    this.hash = hash
    this.action = action
    this.status = status
    this.timestamp = timestamp
  }
}

export function add_to_database(metadata: Metadata) {
  const db = new Database("./hash_metadata_database.db")

  db.pragma("journal_mode = WAL")

  const queryString = "INSERT INTO hash_metadata_table (hash, creation_date, action, status) VALUES (?, ?, ?, ?)"
  
  const stmt = db.prepare(queryString)
  stmt.run(metadata.hash, metadata.timestamp, metadata.action, metadata.status)
}

export function filter_with_query(key: string, limit: number, arg1: string, arg2: string | null): Metadata[] {
  const db = new Database("./hash_metadata_database.db")

  db.pragma("journal_mode = WAL")

  const sql_query = create_selection_sql_query(key)

  if (sql_query != null) {
    const stmt = db.prepare(sql_query);
    
    if (arg2 == null) {
      return (stmt.all(arg1, limit) as any[]).map(e => new Metadata(e.hash, e.action, e.status, e.creation_date))
    } else {
      return (stmt.all(arg1, arg2, limit) as any[]).map(e => new Metadata(e.hash, e.action, e.status, e.creation_date))
    }
  }

  return []
}

function create_selection_sql_query(key: string): string | null {
  if (key == "date") {
      return `SELECT * FROM hash_metadata_table WHERE creation_date BETWEEN ? AND ? LIMIT ?`
  } else if (key == "action") {
      return "SELECT * FROM hash_metadata_table WHERE action = ? LIMIT ?"
  } else if (key == "status") {
      return "SELECT * FROM hash_metadata_table WHERE status = ? LIMIT ?"
  }

  return null
}

export function data_from_hash(hash: string) {
  const db = new Database("./hash_metadata_database.db")

  db.pragma("journal_mode = WAL")

  const sql_query = `SELECT * FROM hash_metadata_table WHERE hash = ?`

  const stmt = db.prepare(sql_query)

  const raw_data = stmt.get(hash) as any

  return new Metadata(raw_data.hash, raw_data.action, raw_data.status, raw_data.creation_date)
}