import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lsfbjcjmybdamchendow.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzZmJqY2pteWJkYW1jaGVuZG93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NzIyMjYsImV4cCI6MjA4MDQ0ODIyNn0._ayT5rjHbalKIFRnlnZI4Zk23z441kxcudqLsQ7KHDg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
