
import {
  LeaderboardConsistencyApiModel,
  LeaderboardProfileConsistency
} from '../models/LeaderboardProfile';
import { LeaderboardProfileType } from '../models/LeaderboardProfile.type';

export const mapConsistencyApiResponse = (data: LeaderboardConsistencyApiModel[]): LeaderboardProfileConsistency[] => {
    return data
      .filter(user => user.username && user.name && user.consistency !== undefined) // Filter items based on conditions
      .map(user => ({
        // Since the filter guarantees that name and username are defined, the non-null assertion operator (!) can be used.
        // However, in TypeScript, it's safer to avoid it if your runtime environment might not guarantee these fields.
        // The example below assumes the fields are guaranteed by the filter.
        name: user.name ?? 'Unknown', // Fallback for 'undefined' is technically not needed here due to the filter
        username: user.username,
        consistency: user.consistency,
        type: LeaderboardProfileType.CONSISTENCY,
      }));
  }