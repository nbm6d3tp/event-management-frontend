import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lmapqwxheetscsdyjvsi.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtYXBxd3hoZWV0c2NzZHlqdnNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkwNTMxMzcsImV4cCI6MjAzNDYyOTEzN30.ZvYQH89BVLOQT_7bOj75tjCBzlBGqWgfI8ojNS8BuCA';
const supabaseUrlImages =
  'https://lmapqwxheetscsdyjvsi.supabase.co/storage/v1/object/public/Images/';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  uploadImage(file: File, path: string) {
    return this.supabase.storage.from('public').upload(path, file);
  }
}
