import { DatabaseManager, SupabaseFilter } from '../database/database.manager'
import Database from '../database/database'
import { SupabaseClient } from '@supabase/supabase-js/src'

class KeyStoreManager {
  private databaseTableName = 'Keys'
  private supabaseDatabase: SupabaseClient
  private supabaseDatabaseManager: DatabaseManager
  constructor() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.supabaseDatabase = Database.getSupabaseDatabase()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
    this.supabaseDatabaseManager = new DatabaseManager(this.supabaseDatabase)
  }

  async addKey(apiKey: ApiKey) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    await this.supabaseDatabaseManager.addData(this.databaseTableName, [apiKey.getJson()])
  }

  async getKey(source: string): Promise<{ [p: string]: any }[] | null> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    return await this.supabaseDatabaseManager.fetchDataWWhere(
      this.databaseTableName,
      new SupabaseFilter('source', source)
    )
  }
}

class ApiKey {
  source: string
  value: string

  constructor(source: string, value: string) {
    this.source = source
    this.value = value
  }

  getJson(): { [p: string]: any } {
    return {
      source: this.source,
      value: this.value
    }
  }
}
