import { SupabaseClient } from '@supabase/supabase-js/src'

export class DatabaseManager {
  private supabase: SupabaseClient

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase
  }

  setSupabase(supabase: SupabaseClient) {
    this.supabase = supabase
  }

  async fetchData(tableName: string): Promise<{ [p: string]: any }[] | null> {
    const { data, error } = await this.supabase.from(tableName).select()
    console.error(error)
    return data
  }

  async fetchDataWWhere(
    tableName: string,
    filter: SupabaseFilter
  ): Promise<{ [p: string]: any }[] | null> {
    const { data, error } = await this.supabase
      .from(tableName)
      .select()
      .eq(filter.key, filter.value)
    console.error(error)
    return data
  }

  /*
  This is an example function, which adds a new row in the database.
  */
  async addData(tableName: string, newValue: Array<{ [p: string]: any }>) {
    const { error } = await this.supabase.from(tableName).insert(newValue)
    console.error(error)
  }

  /*
  This is an example function, which removes existing rows in the database.
  */
  async removeData(tableName: string, filter: SupabaseFilter) {
    const { error } = await this.supabase.from(tableName).delete().eq(filter.key, filter.value)
    console.error(error)
  }

  /*
  This is an example function, which updates existing rows in the database.
  */
  async updateData(tableName: string, newValue: never, filter: SupabaseFilter) {
    const { error } = await this.supabase
      .from(tableName)
      .update(newValue)
      .eq(filter.key, filter.value)
    console.error(error)
  }
}

export class SupabaseFilter {
  key: string
  value: string

  constructor(key: string, value: string) {
    this.key = key
    this.value = value
  }
}
