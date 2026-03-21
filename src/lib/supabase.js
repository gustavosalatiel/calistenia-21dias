import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bfpuizfnplqvixarumli.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmcHVpemZucGxxdml4YXJ1bWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMzEzNzQsImV4cCI6MjA4OTcwNzM3NH0.eNWq_GIFHjXX2DxYwLBKUphEgghX1BAVarnJeg7UEo0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
