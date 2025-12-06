import Dexie, { type EntityTable } from 'dexie'
import type { Icon } from './types';

// interface FeedIcon {
//     id: number;
//     data: string;
//     mime_type?: string;
// }

export const idxDB = new Dexie('fluxy-db') as Dexie & {
    icons: EntityTable<
        Icon,
        'id'
    >
}

idxDB.version(1).stores({
    icons: '++id, data, mime_type'
})