// PlanContext.tsx
import React, { Dispatch, ReactNode, createContext, useContext, useReducer } from 'react';
import { CardioExerciseDetail, ExerciseDetail, ExerciseMainCategory, ExerciseRoutine, PlanCategory } from './plan.types';

export type MediaSource = {
  id: string;
  url: string;
  type: 'image' | 'video';
};

export type PlanInitSelection = {
  planCategory: PlanCategory | null;
  subcategory: ExerciseMainCategory | null;
  selectedExercises: ExerciseDetail[] | null;
  selectedCardioExercise: CardioExerciseDetail | null;
};

export type PlanMetadata = {
  tags: string[] | null;
  location: {
    lat: number;
    long: number;
  } | null;
  extra?: any;
};

// Define the state shape
export interface State {
  name: string | null;
  init: PlanInitSelection;
  description: string | null;
  routine: ExerciseRoutine[] | [];
  private: boolean;
  media: MediaSource[] | null;
  metadata: PlanMetadata | null;
}

// Define action types and payload structures
type Action =
  { type: 'SET_PLAN_BASE'; payload: { init: PlanInitSelection, routine: ExerciseRoutine[] } }
  | { type: 'SET_PLAN_DETAILS'; payload: { name: string, description: string } }
  | { type: 'SET_PLAN_ROUTINE'; payload: ExerciseRoutine[]}
  | { type: 'SET_PLAN_MEDIA'; payload: MediaSource[] | null}
  | { type: 'SET_PLAN_METADATA'; payload: PlanMetadata  }
  | { type: 'RESET' };

// Initial state
const initialState: State = {
  init: {
    planCategory: null,
    subcategory: null,
    selectedExercises: [],
    selectedCardioExercise: null,
  },
  routine:  [],
  description: null,
  name: null,
  private: false,
  media: null,
  metadata: {
    tags: null,
    location: null,
  },
};

// Reducer function
function planReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_PLAN_BASE':
      return { ...state, init: action.payload.init, routine: action.payload.routine};
    case 'SET_PLAN_DETAILS':
      return { ...state, name: action.payload.name, description: action.payload.description};
    case 'SET_PLAN_ROUTINE':
      return { ...state,  routine: action.payload };
    case 'SET_PLAN_MEDIA':
      return { ...state, media: action.payload };
    case 'SET_PLAN_METADATA':
      return { ...state, metadata: action.payload };
    case 'RESET':
      return initialState;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

// Create context with undefined initial value
const PlanContext = createContext<{ state: State; dispatch: Dispatch<Action> } | undefined>(undefined);

// Context provider component
interface PlanProviderProps {
  children: ReactNode;
}

export const PlanBuilderProvider: React.FC<PlanProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(planReducer, initialState);
  const value = { state, dispatch };
  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
};

// Custom hook to use the plan context
export function usePlanBuilder() {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
}
