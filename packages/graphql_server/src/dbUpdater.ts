import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

type Repository = {
  name: string
  owner: string
}

// does not work currently have to supply keys manually
//const supabase = createClient<Database>(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY)
const supabase = createClient<Database>('url', 'key')
const dbUpdater = async () => {
  // delete all projects that are not bookmarked and older than 23 hours and 50 minutes
  const { error: deletionError } = await supabase
    .from('project')
    .delete()
    .eq('is_bookmarked', false)
    .lt('created_at', getCutOffTime(23, 50))

  // get all projects that remain in the database
  const { data: existingRepos, error: error2 } = await supabase
    .from('project')
    .select('name, owned_by ( name )')

  // update the github statistics for all projects that remain in the database
  if (existingRepos) {
    updateRepos(existingRepos.map((repo) => ({ name: repo.name, owner: repo.owned_by?.name })))
  }

  // get trending repos from github
  // check whether they are already in the database
  // if yes, delete them from the list
  // gather Info for all that are still in the list
  // add them to the database
}

const getCutOffTime: (hours: number, minutes: number) => string = (
  hours: number,
  minutes: number
) => {
  const cutoffTime = new Date()
  cutoffTime.setHours(cutoffTime.getHours() - hours)
  cutoffTime.setMinutes(cutoffTime.getMinutes() - minutes)
  return cutoffTime.toISOString()
}

const updateRepos = (repos: Repository[]) => {
  return null
}

const getTrendingRepos = () => {
  return
}

dbUpdater()
