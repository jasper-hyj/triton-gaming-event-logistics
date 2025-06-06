import BaseRepository from './BaseRepository';
import { SupabaseClient } from '@supabase/supabase-js';
export type Source = {
  id: string;
};

export default class SourcesRepository extends BaseRepository<Source> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'sources');
  }
}
