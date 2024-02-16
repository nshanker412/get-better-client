import { LeaderboardProfileType } from './LeaderboardProfile.type';

/**
 * Data models for the server response
 */

export interface LeaderboardApiBody {
    username: string,
    feedType: 'friends'  | 'public',
    limit: number,
}

export interface LeaderboardConsistencyApiModel {
    name: string;
    username: string  ;
    consistency: number;
}
  

export interface LeaderboardChallengesApiModel {
    name: string;
    username: string;
    challengesComplete: number;
  }


/**
 * Data models for the Leaderboard component
 */
export interface LeaderboardProfileConsistency {
    name: string;
    username: string;
    consistency: number;
    type: LeaderboardProfileType.CONSISTENCY;
}


export interface LeaderboardProfileChallenges {
    name: string;
    username: string;
    challengesComplete: number;
    type: LeaderboardProfileType.CHALLENGES;
}

export type LeaderboardProfile = LeaderboardProfileConsistency | LeaderboardProfileChallenges;

