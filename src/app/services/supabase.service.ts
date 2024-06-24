import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lmapqwxheetscsdyjvsi.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtYXBxd3hoZWV0c2NzZHlqdnNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxOTA1MzEzNywiZXhwIjoyMDM0NjI5MTM3fQ.ZA_bIisWc6iqPUoMbfjn2eAsMmn7hdlzC24BApnFb1s';

export const supabaseUrlPublic =
  'https://lmapqwxheetscsdyjvsi.supabase.co/storage/v1/object/public/';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  uploadImage(bucket: 'events' | 'avatars', file: File | undefined) {
    if (!file)
      return Promise.resolve({
        data: null,
        error: null,
      });
    return this.supabase.storage
      .from(`Images/${bucket}`)
      .upload(file.name, file);
  }
}
