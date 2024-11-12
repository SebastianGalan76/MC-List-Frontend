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
    mode: ServerMode;
    online: boolean;
    onlinePlayers: number;
    promotionPoints: number;
    versions: ServerVersion[];
    links: ServerLink[];
}

export interface ServerDetails{
    motdHtml: string;
    motdClean: string;
    icon: string;
}

export interface ServerName{
    name: string;
    color: string;
}

export interface ServerLink{
    index: number;
    name: string;
    url: string;
}