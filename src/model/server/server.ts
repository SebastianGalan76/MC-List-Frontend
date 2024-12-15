import { ServerMode } from "../../service/serverMode.service";
import { ServerVersion } from "../../service/serverVersion.service";

export interface Server{
    id: number;
    ip: string;
    port: number;
    detail: ServerDetails;
    name: ServerName;
    description: string;
    banner: string;
    premium: boolean;
    mods: boolean;
    mode: ServerMode | null;
    online: boolean;
    onlinePlayers: number;
    promotionPoints: number;
    versions: ServerVersion[];
    links: ServerLink[];
    subServers: SubServer[];
    staff: ServerStaff[];
    roles: ServerRole[];
    role: ServerUserRole;
    ratings: PlayerRating[];
    votes: number;
    
    hourlyPlayerCounts: PlayerCountStatistic[];
    dailyPlayerCounts: PlayerCountStatistic[];
}

export interface ServerList {
    id: number;
    ip: string;
    port: number;
    detail: ServerDetails;
    name: ServerName;

    online: boolean;
    premium: boolean;
    mods: boolean;
    
    players: number;
    promotionPoints: number;
    votes: number;

    mode: ServerMode | null;
    versions: ServerVersion[];
}

export interface ServerDetails{
    id: number;
    motdHtml: string;
    motdClean: string;
    icon: string;
}

export interface ServerName{
    id: number;
    name: string;
    color: string;
}

export interface ServerLink{
    id: number;
    index: number;
    name: string;
    url: string;
}

export interface ServerRole{
    email: string;
    role: ServerUserRole;
}

export enum ServerUserRole{
    HELPER = 500, MODERATOR = 750, ADMINISTRATOR = 1000, OWNER = 5000
}

export interface SubServer{
    id: number;
    index: number;
    name: ServerName;
    mode: ServerMode;
    versions: ServerVersion[];
}

export interface ServerStaff{
    id: number;
    index: number;
    name: string;
    color: string;
    players: ServerStaffPlayer[];
}

export interface ServerStaffPlayer{
    id: number | null;
    index: number;
    nick: string;
    discord: string;
    instagram: string;
    tiktok: string;
    youtube: string;
}

export interface PlayerRating{
    id: number;
    category: RatingCategory;
    userId: number;
    rating: number;
}

export interface RatingCategory{
    id: number;
    name: string;
}

export interface PlayerCountStatistic{
    id: number;
    time: string;
    playerCount: number;
}