import { ServerMode } from "../../service/serverMode.service";

export interface Server{
    id: number;
    ip: string;
    port: number;
    detail: ServerDetails;
    name: string;
    description: string;
    banner: string;
    premium: boolean;
    mods: boolean;
    mode: ServerMode;
    online: boolean;
    onlinePlayers: number;
    promotionPoints: number;
}

export interface ServerDetails{
    motdHtml: string;
    motdClean: string;
    icon: string;
}