import BaseRepository from './BaseRepository';
import { SupabaseClient } from '@supabase/auth-helpers-nextjs';

export type Installation = {
  id: string;
  platform: string;
  size: number;
};

export default class InstallationsRepository extends BaseRepository<Installation> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'installations');
  }
}
