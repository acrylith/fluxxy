import Dexie, { type EntityTable } from 'dexie'

interface FeedIcon {
    id: number;
    // icon_id: number,
    data: string;
    mime_type?: string;
}

export const idxDB = new Dexie('fluxy-db') as Dexie & {
    icons: EntityTable<
        FeedIcon,
        'id'
    >
}

idxDB.version(1).stores({
    icons: '++id, data, mime_type'
})