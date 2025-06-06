import { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import BaseRepository from './BaseRepository';

export type Part = {
  id: string;
};

export default class PartsRepository extends BaseRepository<Part> {
  constructor(supabaseClient: SupabaseClient) {
    super(supabaseClient, 'parts');
  }
}