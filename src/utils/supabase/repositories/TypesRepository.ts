import BaseRepository from './BaseRepository';
import { SupabaseClient } from '@supabase/auth-helpers-nextjs';

export type Type = {
  id: string;
};

export default class TypesRepository extends BaseRepository<Type> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'types');
  }
}
