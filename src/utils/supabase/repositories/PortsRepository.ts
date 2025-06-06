import { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import BaseRepository from './BaseRepository';

export type Port = {
  id: string;
};

export default class PortsRepository extends BaseRepository<Port> {
  constructor(supabaseClient: SupabaseClient) {
    super(supabaseClient, 'ports');
  }
}
