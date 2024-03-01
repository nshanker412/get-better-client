
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

/**
 * NOTES / SHIT TO DO 
 * - add metadata tags under Post type to easily see plans linked
 */
  
/*----------------------------------------------------*/

  /**
   * Plan 
   */


    export enum PlanCategory {
        Lifting = 'Lifting',
        Cardio = 'Cardio',
        Nutrition = 'Nutrition',
    }

    interface WorkoutPlan {
        id: string;
        name: string;
        exercises: Exercise[];
        type: PlanCategory.Lifting;
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


export type ExerciseRoutine = {
    id: string;
    sets: number | undefined;
    reps: number | undefined;
    weight: number | undefined;
    notes: string | undefined;
    init: boolean;
    }

export type ExerciseRoutines =  ExerciseRoutine[] | null;  

/**
 * Plan Subcategories
 */
export interface Exercise {
    id: string;
    name: string;
    type: 'strength' | 'endurance' | null;
    category: ExerciseMainCategory; 
    routine: ExerciseRoutines | null;
    restPeriod: number | undefined;
    duration: number;
    additionalNotes: string | null;
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


/**-------------------------------- MAIN CATEGORY ------------------------------------ */


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




/**-------------------------------- WORKOUT ------------------------------------ */

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


export type ExerciseDetail = {
    id: string;
    name: string;
    type: string; // This could represent a sub-category or a specific attribute of the exercise
}

export interface ExerciseCategories {
    [category: string]: ExerciseDetail[];
}

export const exercises: ExerciseCategories = {
    Chest: [
      { id: "wl-c01", name: "Bench Press", type: "Strength" },
      { id: "wl-c02", name: "Flat Incline Dumbbell Press", type: "Strength" },
      { id: "wl-c03", name: "Inclined Dumbbell Press", type: "Strength" },
      { id: "wl-c04", name: "Chest Fly", type: "Isolation" },
      { id: "wl-c05", name: "Decline Press", type: "Strength" },
      { id: "wl-c06", name: "Push-ups", type: "Bodyweight" }
    ],
    Back: [
      { id: "wl-b01", name: "Dumbbell Rows", type: "Strength" },
      { id: "wl-b02", name: "Lat Pull Downs", type: "Strength" },
      { id: "wl-b03", name: "Cable Rows", type: "Strength" },
      { id: "wl-b04", name: "Pull-ups", type: "Bodyweight" },
      { id: "wl-b05", name: "Deadlift", type: "Compound" },
      { id: "wl-b06", name: "Rear Delt Flys", type: "Isolation" },
      { id: "wl-b07", name: "Face Pulls", type: "Isolation" }
    ],
    Shoulders: [
      { id: "wl-s01", name: "Dumbbell Shoulder Press", type: "Strength" },
      { id: "wl-s02", name: "Lateral Raises", type: "Isolation" },
      { id: "wl-s03", name: "Shrugs", type: "Isolation" },
      { id: "wl-s04", name: "Delt Raises", type: "Isolation" }
    ],
    Legs: [
      { id: "wl-x01", name: "Squat", type: "Compound" },
      { id: "wl-x02", name: "Leg Press", type: "Strength" },
      { id: "wl-x03", name: "Leg Extension", type: "Isolation" },
      { id: "wl-x04", name: "Leg Curls", type: "Isolation" },
      { id: "wl-x05", name: "Calf Raises", type: "Isolation" },
      { id: "wl-x06", name: "Deadlift", type: "Compound" }
    ],
    Arms: [
      { id: "wl-a01", name: "Dumbbell Curls", type: "Isolation" },
      { id: "wl-a02", name: "Tricep Pull Downs", type: "Isolation" },
      { id: "wl-a03", name: "Hammer Curls", type: "Isolation" },
      { id: "wl-a04", name: "Dips", type: "Bodyweight" },
      { id: "wl-a05", name: "EZ Bar Curls", type: "Isolation" }
    ],
    Push: [
      { id: "wl-p01", name: "Bench Press", type: "Strength" },
      { id: "wl-p02", name: "Flat Incline Dumbbell Press", type: "Strength" },
      { id: "wl-p03", name: "Inclined Dumbbell Press", type: "Strength" },
      { id: "wl-p04", name: "Chest Fly", type: "Isolation" },
      { id: "wl-p05", name: "Decline Press", type: "Strength" },
      { id: "wl-p06", name: "Push-ups", type: "Bodyweight" }
    ],
    Pull: [
      { id: "wl-pu01", name: "Dumbbell Rows", type: "Strength" },
      { id: "wl-pu02", name: "Lat Pull Downs", type: "Strength" },
      { id: "wl-pu03", name: "Cable Rows", type: "Strength" },
      { id: "wl-pu04", name: "Pull-ups", type: "Bodyweight" },
      { id: "wl-pu05", name: "Deadlift", type: "Compound" },
      { id: "wl-pu06", name: "Rear Delt Flys", type: "Isolation" },
      { id: "wl-pu07", name: "Dumbbell Curls", type: "Isolation" },
      { id: "wl-pu08", name: "Chin Ups", type: "Bodyweight" }
    ],
};


export const weightOptions = [
    "0", "5", "10", "15", "20", "25", "30", "35", "40", "45", "50", 
    "55", "60", "65", "70", "75", "80", "85", "90", "95", "100", 
    "105", "110", "115", "120", "125", "130", "135", "140", "145", 
    "150", "155", "160", "165", "170", "175", "180", "185", "190", 
    "195", "200", "205", "210", "215", "220", "225", "230", "235", 
    "240", "245", "250", "255", "260", "265", "270", "275", "280", 
    "285", "290", "295", "300", "305", "310", "315", "320", "325", 
    "330", "335", "340", "345", "350", "355", "360", "365", "370", 
    "375", "380", "385", "390", "395", "400", "405", "410", "415", 
    "420", "425", "430", "435", "440", "445", "450", "455", "460", 
    "465", "470", "475", "480", "485", "490", "495", "500"
  ];
  
export   const setOptions = [
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", 
    "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", 
    "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", 
    "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", 
    "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", 
    "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", 
    "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", 
    "71", "72", "73", "74", "75", "76", "77", "78", "79", "80", 
    "81", "82", "83", "84", "85", "86", "87", "88", "89", "90", 
    "91", "92", "93", "94", "95", "96", "97", "98", "99", "100"
  ];
  
  export const repOptions = [
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", 
    "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", 
    "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", 
    "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", 
    "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", 
    "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", 
    "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", 
    "71", "72", "73", "74", "75", "76", "77", "78", "79", "80", 
    "81", "82", "83", "84", "85", "86", "87", "88", "89", "90", 
    "91", "92", "93", "94", "95", "96", "97", "98", "99", "100"
  ];


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
}));


export type ExerciseType = {
    parent: ExerciseMainCategory;
    exercise: ExerciseDetail
};


export interface ExerciseDropdownItem {
    label: string;
    value: string;
    excerise: ExerciseDetail;
    type: ExerciseType;
    icon?: string;
}


export const findExerciseByName = (category: ExerciseMainCategory, name: string): ExerciseDetail | undefined => {
    const categoryExercises = exercises[category];
    return categoryExercises.find(exercise => exercise.name === name);   
}


export const findExerciseById = (category: ExerciseMainCategory, id: string): ExerciseDetail | undefined => {
    const categoryExercises = exercises[category];
    return categoryExercises.find(exercise => exercise.id === id);   
}

export function generateExerciseDropdownItems(category: ExerciseMainCategory): ExerciseDropdownItem[] {
    const exerciseDetails = (exercises as ExerciseCategories)[category];
    
    return exerciseDetails.map((detail) => {
        const exerciseType: ExerciseType = {
            parent: category,
            exercise: detail,
        };

        return {
            label: detail.name, 
            value: detail.name, 
            excerise: detail,
            type: exerciseType,
        };
    });
}


/**-------------------------------- CARDIO ------------------------------------ */

// Define Cardio exercises in a separate structure
export type CardioExerciseDetail = {
    id: string;
    name: string;
    type: string; // This could represent a sub-type like "Endurance", "HIIT", etc.
};

const cardioExercises: CardioExerciseDetail[] = [
    { id: "ca-01", name: "Running", type: "Endurance" },
    { id: "ca-02", name: "Cycling", type: "Endurance" },
    { id: "ca-03", name: "Jump Rope", type: "HIIT" },
    { id: "ca-04", name: "Rowing", type: "Steady State" },
    { id: "ca-05", name: "High Knees", type: "HIIT" },
    { id: "ca-06", name: "Stair Climber", type: "Steady State" },
];

export interface CardioDropdownItem {
    id: string;
    label: string;
    value: string;
    type: string; // Use the specific cardio type here
    icon?: string; // Optional
}

// Function to generate dropdown items for Cardio exercises
export function generateCardioDropdownItems(): CardioDropdownItem[] {
    return cardioExercises.map((exercise) => ({
        id: exercise.id,
        label: exercise.name,
        value: exercise.name, // Assuming the name can serve as a unique value
        type: exercise.type,
        // The icon can be determined based on the exercise type or name if necessary
    }));
}

/**-------------------------------- Nutrition ------------------------------------ */


export enum NutritionPlanMainCategory {
    SomeShitPlan = 'Some Shit Plan',
    SomeCoolPlan    = 'Some Cool Plan',
    Custom = 'Custom',
}

export enum FoodGroupsMainCategory {
    Meats = 'Meats',
    Fish = 'Fish',
    Dairy = 'Dairy',
    Shakes = 'Shakes',
    Water = 'Water',
    Fruits = 'Fruits', 
    Vegetables = 'Vegetables'
}

export interface Foods {
    id: string;
    name: string;
    type: FoodGroupsMainCategory;
    protien: number | undefined
    carbs: number | undefined;
    fats: number | undefined;
    calories: number;
}

export interface NutritionCategories {
    [foods: string]: Foods[];
}

export const nutrition: NutritionCategories = {
    Meats: [
        { id: "me-001", name: "Steak", type: FoodGroupsMainCategory.Meats , protien: 42, carbs: 0, fats: 10, calories: 250},
        { id: "me-002", name: "Chicken", type: FoodGroupsMainCategory.Meats , protien: 30, carbs: 0, fats: 5, calories: 200},
        { id: "me-003", name: "Pork", type: FoodGroupsMainCategory.Meats , protien: 25, carbs: 0, fats: 15, calories: 250},
      
    ],
    Fish: [
        { id: "fi-001", name: "Salmon", type: FoodGroupsMainCategory.Fish , protien: 30, carbs: 0, fats: 10, calories: 250},
        { id: "fi-002", name: "Shrimp", type: FoodGroupsMainCategory.Fish , protien: 25, carbs: 0, fats: 5, calories: 200},
        { id: "fi-003", name: "Lobster", type: FoodGroupsMainCategory.Fish , protien: 20, carbs: 0, fats: 5, calories: 200},

    ],
    Dairy: [
        { id: "da-001", name: "Eggs", type: FoodGroupsMainCategory.Dairy , protien: 20, carbs: 0, fats: 10, calories: 150},
        { id: "da-002", name: "Yogurt", type: FoodGroupsMainCategory.Dairy , protien: 15, carbs: 20, fats: 5, calories: 200},
 
    ],
    Fruits: [
        { id: "fr-001", name: "Bananas", type: FoodGroupsMainCategory.Fruits , protien: 1, carbs: 30, fats: 0, calories: 100},
        { id: "fr-002", name: "Strawberries", type: FoodGroupsMainCategory.Fruits , protien: 1, carbs: 20, fats: 0, calories: 100},
        { id: "fr-003", name: "Watermelon", type: FoodGroupsMainCategory.Fruits , protien: 1, carbs: 30, fats: 0, calories: 100},
            
    ],
    Vegetables: [
        { id: "ve-001", name: "Broccoli", type: FoodGroupsMainCategory.Vegetables , protien: 1, carbs: 30, fats: 0, calories: 100},
        { id: "ve-002", name: "Carrots", type: FoodGroupsMainCategory.Vegetables, protien: 1, carbs: 20, fats: 0, calories: 100},
        { id: "ve-003", name: "Mushroom", type: FoodGroupsMainCategory.Vegetables , protien: 1, carbs: 30, fats: 0, calories: 100},
    ],
    Water: [
        { id: "wa-001", name: "Water", type: FoodGroupsMainCategory.Water , protien: 0, carbs: 0, fats: 0, calories: 0},
        ],
    Shakes: [
        { id: "sm-001", name: "Whey Protein Shake", type: FoodGroupsMainCategory.Shakes , protien: 30, carbs: 0, fats: 5, calories: 200},
        { id: "sm-002", name: "Fruit Smoothie", type: FoodGroupsMainCategory.Shakes , protien: 10, carbs: 20, fats: 5, calories: 200},
    ],
};


export interface NutritionSubcategoryDropdownItem {
    label: string;
    value: string;
    type: NutritionPlanMainCategory;
    icon?: string; // Optional
}

export const nutritionSubcategoryDropdownItems: NutritionSubcategoryDropdownItem[] = Object.entries(NutritionPlanMainCategory).map(([key, value]) => ({
    label: key, // Using enum key as label
    value: value, // Using enum value as value
    type: value as NutritionPlanMainCategory, // Correctly assigning the enum value to type
}));




export interface NutritionFoodGroupsDropdownItem {
    label: string;
    value: string;
    type: FoodGroupsMainCategory;
    icon?: string; 
}

export const nutritionFoodGroupsDropdownItems: NutritionFoodGroupsDropdownItem[] = Object.entries(FoodGroupsMainCategory).map(([key, value]) => ({
    label: key, // Using enum key as label
    value: value, // Using enum value as value
    type: value as FoodGroupsMainCategory, // Correctly assigning the enum value to type
}));



// export function genFoodDropdownItems(category: FoodGroupsMainCategory): ExerciseDropdownItem[] {
//     const exerciseDetails = ( as FoodGroupsMainCategory)[category];
    
//         return {
//             label: detail.name, 
//             value: detail.name, 
//             excerise: detail,
//             type: exerciseType,
//         };
//     });
// }




/**
 *  USDA API key -= mhHF6tA0tjaE4nUflTsa43zb9ayEt39lmdWsnEhy
 * Endpoint : https://developer.nrel.gov/api/alt-fuel-stations/v1.json?limit=1&api_key=mhHF6tA0tjaE4nUflTsa43zb9ayEt39lmdWsnEhy
*/

