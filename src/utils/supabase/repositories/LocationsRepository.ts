import { SupabaseClient } from '@supabase/supabase-js';
import BaseRepository from './BaseRepository';

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
