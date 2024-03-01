import { CardioExerciseDetail, ExerciseDetail, ExerciseMainCategory, ExerciseRoutine, PlanCategory } from "../plan.types";


export type PlanModel  = {
    id: string; // {username}-{planType}-{timestamp}
    username: string;
    userId: string | null;
    planName: string;
    description: string;
    data: {
        planCategory: PlanCategory | null;
        subcategory: ExerciseMainCategory | null;
        selectedExercises: ExerciseDetail[] | null;
        selectedCardioExercise: CardioExerciseDetail | null;
        routine: ExerciseRoutine[] | [];
    },
    createdAt: number; // UTC timestamp
    updatedAt: number | null; // UTC timestamp
    deletedAt: number | null
    icon: string | null; // URI/URL to icons
    media: string[] | []; // URI/URL to images
    metadata: {
        private: boolean;
        social: {
            likes: string[], // User IDs
            comments: string[], // Comment IDs
        },
        tags: string[],
        location: {
            lat: number;
            long: number;
        }
    } | null;
}


