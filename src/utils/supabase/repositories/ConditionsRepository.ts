// repositories/InstallationsRepository.ts
import BaseRepository from './BaseRepository';
import { SupabaseClient } from '@supabase/auth-helpers-nextjs';

export type Condition = {
  id: string;
};

export default class ConditionsRepository extends BaseRepository<Condition> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'conditions');
  }
}
