export interface Item {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    duration: string;
    playlists: Array<PlaylistItem>;
}

interface PlaylistItem {
    roomId: string;
    isCurrent: boolean;
    timeCreated: number;
}