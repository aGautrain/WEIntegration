export interface AccountInterface {
    email: string;
    password: string;
    name: string;
    firstName: string;
    team: string;
    thumbnail: string;
}

export interface CredentialsInterface {
    email: string;
    password: string;
}

export interface TeamInterface {
    name: string;
    points?: number;
    nbMembers?: number;
    thumbnail: string;
    members?: Array<PlayerInterface>;
    
    createdAt?: Date;
    updatedAt?: Date;
    
}

// Overview of a player (populated)
export interface PlayerInterface {
    firstName: string;
    name: string;
    points: number;
    team: string;
    thumbnail: string;
}


// When detailing a player
export interface PlayerDetailsInterface {
    challengesTodo: Array<ChallengeInterface>;
    challengesDoing: Array<ChallengeInterface>;
    challengesDone: Array<ChallengeInterface>;
    team: TeamInterface;
    
    name: string;
    firstName: string;
    thumbnail: string;
    isCaptain: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    id: number;
    
    points?: number;
}

export interface ChallengeInterface {
    name: string;
    desc: string;
    collective: boolean;
    category: string;
    thumbnail?: string;
    reward: number;
    createdAt?: Date;
    updatedAt?: Date;
    
    status?: ChallengeState;
}

export enum ChallengeState {
    pending,
    obtained,
    available
}

export interface StoryRecordInterface {
    date: Date;
    desc: string;
}