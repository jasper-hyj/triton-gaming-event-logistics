import { SupabaseClient } from '@supabase/supabase-js';
import BaseRepository from './BaseRepository';

export type Type = {
  id: string;
};

export default class TypesRepository extends BaseRepository<Type> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'types');
  }
}
