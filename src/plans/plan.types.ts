
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
        location: []
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


    enum PlanCategory {
        Workout = 'workout',
        Cardio = 'cardio',
        Nutrition = 'nutrition',
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
        gates: [

        ]

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
    name: string;
    sets: number;
    reps: number;
    weight: number; 
      restPeriod: number; 
      duration: number;
      metadata: {
          
      }
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
  