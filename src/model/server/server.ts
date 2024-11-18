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
    roles: ServerRole[];
    role: ServerUserRole;
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
    HELPER = 'Helper', MODERATOR = "Moderator", ADMINISTRATOR = "Administrator", OWNER = "Właściciel"
}

export interface SubServer{
    id: number;
    index: number;
    name: ServerName;
    mode: ServerMode;
    versions: ServerVersion[];
}