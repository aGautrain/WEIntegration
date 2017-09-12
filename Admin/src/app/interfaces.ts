export interface Claim {
    claimer: Player;
    challenge: Challenge;
    resolved: boolean;
    resolution: string;
    claimerComment: string;
    solverComment: string;
    claimerProof: string;
    updatedAt?: Date;
    createdAt?: Date;
    id: number;
}

export interface Challenge {
    name: string;
    desc: string;
    collective: boolean;
    category: string;
    thumbnail?: string;
    reward: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Player {
    name: string;
    firstName: string;
    team: string;
    thumbnail: string;
    advantage: number;
    isCaptain: boolean;
    createdAt: Date;
    updatedAt: Date;
    id: number;
}

export interface Team {
    members: Array<any>;
    name: string;
    thumbnail: string;
    advantage: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Note {
    content: string;
    team?: string;
    player?: string;
    global?: boolean;
    createdAt: Date;
    updatedAt: Date;
    id: string;
}
