import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wxgmpftjfytpmyvweago.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4Z21wZnRqZnl0cG15dndlYWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3NzAwMDUsImV4cCI6MjEwNzM0NjAwNX0.ZyhS2MjBcdGhcnfo-Msjsipktj5g1MAY9kA_Q3X6caE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)