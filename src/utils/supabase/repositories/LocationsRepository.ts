import BaseRepository from './BaseRepository';
import { SupabaseClient } from '@supabase/auth-helpers-nextjs';

export type Location = {
    id: string;
    building: string;
    direction: string;
};

export default class LocationsRepository extends BaseRepository<Location> {
    constructor(supabase: SupabaseClient) {
        super(supabase, 'locations');
    }
}
