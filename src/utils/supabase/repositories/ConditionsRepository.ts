import { SupabaseClient } from '@supabase/supabase-js';
import BaseRepository from './BaseRepository';

export type Condition = {
  id: string;
};

export default class ConditionsRepository extends BaseRepository<Condition> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'conditions');
  }
}
