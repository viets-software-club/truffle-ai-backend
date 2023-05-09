import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yipnhkmklmbuxjwzpipg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpcG5oa21rbG1idXhqd3pwaXBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODM0OTAwMjYsImV4cCI6MTk5OTA2NjAyNn0.5H4WqY1uUq9IiCGrPvM96NSrTLO6pPUUS1gMb4Ubxds';

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
