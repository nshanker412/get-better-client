
/**
 * User type definition
 */
interface User {
    id: string;
    username: string;
    
    //... other shit
    plans: Plan[]
}
  

interface Like {
    id: string;
    userId: string;
    time: Date;
}

interface Comment {
    id: string;
    userId: string;
    content: string;

}


interface Post {
    id: string; 
    type: 'image' | 'video'
    media: URL[];
    tags: string[];
    metadata: {
        location?: []
    }
    deletedAt: Date | null

}

// interface userConfig {
//     userId: string;
    
// }


/**
 * NOTES / SHIT TO DO 
 * - add metadata tags under Post type to easily see plans linked
 */
  


/*----------------------------------------------------*/

  /**
   * Plan 
   */


    export enum PlanCategory {
        Workout = 'Workout',
        Cardio = 'Cardio',
        Nutrition = 'Nutrition',
    }



    


    interface WorkoutPlan {
        id: string;
        name: string;
        exercises: Exercise[];
        type: PlanCategory.Workout;
      }
    
    interface CardioPlan {
        id: string;
        name: string;
        activities: CardioActivity[];
        type: PlanCategory.Cardio;
    }

    interface NutritionPlan {
        id: string;
        name: string;
        meals: Meal;
        type: PlanCategory.Nutrition;
    }


    type PlanCategoryType = WorkoutPlan | CardioPlan | NutritionPlan;


    /**
     * Object interface for an individual plan (end result)
     */
    interface Plan {
        id: string;
        userId: string;
        private: boolean;
        name: string;
        description: string;
        type: PlanCategory;
        plan: PlanCategoryType[];
        createdAt: Date; // UTC timestamp
        updatedAt: Date; // UTC timestamp
        icon: string; // URI/URL to icons
        media: [], // URI/URL to images

        social: {
            likes: Like[],
            comments: Comment[],
        }
        metadata: {
            tags: string[],
            location: {
                lat: number;
                long: number;
            }
        } | null;
        deletedAt: Date | null

    }


/**
 * Plan Subcategories
 */






  interface Exercise {
      id: string;
      type: 'strength' | 'endurance';
    name: string;
    sets: number;
    reps: number;
    weight: number; 
      restPeriod: number; 
      duration: number;
      metadata: []
  }
  
  interface CardioActivity {
    id: string;
      name: string;
      types: 'run' | 'walk';
    duration: number; // Duration in minutes
    intensity: 'low' | 'medium' | 'high';
  }
  

  /**
   *    Subcategory Interfaces for Nutrition Plans
   */
  interface Meal {
    id: string;
    name: string;
    time: string; // Suggested time for the meal, e.g., "08:00", "12:30"
    calories: number;
    proteins: number; // grams
    carbs: number; // grams
    fats: number; // grams
    ingredients: Ingredient[];
  }
  
  interface Ingredient {
    id: string;
    name: string;
    quantity: number; // Quantity could be in grams, milliliters, or unit count
    unit: 'g' | 'ml' | 'unit';
  }
  


  /** 
   * Data
   */

// map categories to dropdown items

export const SelectCategoryDropdown = [

    {
        label: 'Workout',
        value: 'workout',
        search: 'workout'
    },
    {
        label: 'Cardio',
        value: 'cardio',
        search: 'cardio'
    },
    {
        label: 'Nutrition',
        value: 'nutrition',
        search: 'nutrition'
    }
]


export enum ExerciseMainCategory {
    Chest = "Chest",
    Back = "Back",
    Shoulders = "Shoulders",
    Legs = "Legs",
    Arms = "Arms",
    Push = "Push",
    Pull = "Pull",
}

// Assuming each category is simply a list of exercise names (strings)




type ExerciseDetail = {
    name: string;
    type: string; // This could represent a sub-category or a specific attribute of the exercise
}

export interface ExerciseCategories {
    [category: string]: ExerciseDetail[];
}

export const exercises: ExerciseCategories = {
    Chest: [
      { name: "Bench Press", type: "Strength" },
      { name: "Flat Incline Dumbbell Press", type: "Strength" },
      { name: "Inclined Dumbbell Press", type: "Strength" },
      { name: "Chest Fly", type: "Isolation" },
      { name: "Decline Press", type: "Strength" },
      { name: "Push-ups", type: "Bodyweight" }
    ],
    Back: [
      { name: "Dumbbell Rows", type: "Strength" },
      { name: "Lat Pull Downs", type: "Strength" },
      { name: "Cable Rows", type: "Strength" },
      { name: "Pull-ups", type: "Bodyweight" },
      { name: "Deadlift", type: "Compound" },
      { name: "Rear Delt Flys", type: "Isolation" },
      { name: "Face Pulls", type: "Isolation" }
    ],
    Shoulders: [
      { name: "Dumbbell Shoulder Press", type: "Strength" },
      { name: "Lateral Raises", type: "Isolation" },
      { name: "Shrugs", type: "Isolation" },
      { name: "Delt Raises", type: "Isolation" }
    ],
    Legs: [
      { name: "Squat", type: "Compound" },
      { name: "Leg Press", type: "Strength" },
      { name: "Leg Extension", type: "Isolation" },
      { name: "Leg Curls", type: "Isolation" },
      { name: "Calf Raises", type: "Isolation" },
      { name: "Deadlift", type: "Compound" }
    ],
    Arms: [
      { name: "Dumbbell Curls", type: "Isolation" },
      { name: "Tricep Pull Downs", type: "Isolation" },
      { name: "Hammer Curls", type: "Isolation" },
      { name: "Dips", type: "Bodyweight" },
      { name: "EZ Bar Curls", type: "Isolation" }
    ],
    Push: [
      { name: "Bench Press", type: "Strength" },
      { name: "Flat Incline Dumbbell Press", type: "Strength" },
      { name: "Inclined Dumbbell Press", type: "Strength" },
      { name: "Chest Fly", type: "Isolation" },
      { name: "Decline Press", type: "Strength" },
      { name: "Push-ups", type: "Bodyweight" }
    ],
    Pull: [
      { name: "Dumbbell Rows", type: "Strength" },
      { name: "Lat Pull Downs", type: "Strength" },
      { name: "Cable Rows", type: "Strength" },
      { name: "Pull-ups", type: "Bodyweight" },
      { name: "Deadlift", type: "Compound" },
      { name: "Rear Delt Flys", type: "Isolation" },
      { name: "Dumbbell Curls", type: "Isolation" },
      { name: "Chin Ups", type: "Bodyweight" }
    ],
};


// Main category dropdown items
export interface CategoryDropdownItem {
    label: string;
    value: string;
    type: PlanCategory;
    icon?: string; // Optional
}

export const planCategoryDropdownItems: CategoryDropdownItem[] = Object.entries(PlanCategory).map(([key, value]) => ({
    label: key, // Using enum key as label
    value: value, // Using enum value as value
    type: value as PlanCategory, // Correctly assigning the enum value to type
    // No need to explicitly assign an empty string to icon since it's optional
}));


// Workout subcategory dropdown items
export interface WorkoutSubcategoryDropdownItem {
    label: string;
    value: string;
    type: ExerciseMainCategory;
    icon?: string; // Optional
}

export const workoutSubcategoryDropdownItems: WorkoutSubcategoryDropdownItem[] = Object.entries(ExerciseMainCategory).map(([key, value]) => ({
    label: key, // Using enum key as label
    value: value, // Using enum value as value
    type: value as ExerciseMainCategory, // Correctly assigning the enum value to type
    // No need to explicitly assign an empty string to icon since it's optional
}));


type ExerciseType = {
    parent: ExerciseMainCategory; // Enum representing the main category of the exercise
    type: string; // Additional detail or sub-category of the exercise
};


export interface ExerciseDropdownItem {
    label: string;
    value: string;
    type: ExerciseType; // Updated to use ExerciseType
    icon?: string; // Optional
}


export function generateExerciseDropdownItems(category: ExerciseMainCategory): ExerciseDropdownItem[] {
    const exerciseDetails = (exercises as ExerciseCategories)[category];
    
    return exerciseDetails.map((detail) => {
        const exerciseType: ExerciseType = {
          parent: category,
          type: detail.type // Use the specific type of each exercise
        };

        return {
            label: detail.name, // Use the detailed name for label
            value: detail.name, // Use the detailed name for value as well
            type: exerciseType, // Assign the constructed ExerciseType object
        };
    });
}
