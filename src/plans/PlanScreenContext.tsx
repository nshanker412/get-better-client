import React, { ReactNode, createContext, useContext, useReducer } from 'react';

// Since the enum Step is defined twice, remove one of the definitions.
export enum Step {
  ChooseCategory = 'choose category',
  AddInfo = 'add info',
  Review = 'review',
  Submit = 'submit',
}

// Define action types
export enum ActionType {
  NextStep = 'NEXT_STEP',
  PrevStep = 'PREV_STEP',
  Submit = 'SUBMIT',
  Reset = 'RESET',
}

// Define the state shape
interface State {
  currentStep: Step;
}

// Define the action shape
type Action =
  | { type: ActionType.NextStep }
  | { type: ActionType.PrevStep }
  | { type: ActionType.Submit }
  | { type: ActionType.Reset };

// Initial state
const initialState: State = {
  currentStep: Step.ChooseCategory,
};

// Reducer function corrected to match the existing action types and logic
function reducer(state: State, action: Action): State {
  const steps = Object.values(Step); // Simplify the access to steps
  const currentIndex = steps.indexOf(state.currentStep);

  switch (action.type) {
    case ActionType.NextStep:
      return { ...state, currentStep: steps[(currentIndex + 1) % steps.length] };
    case ActionType.PrevStep:
      return { ...state, currentStep: steps[(currentIndex - 1 + steps.length) % steps.length] };
    case ActionType.Reset:
      return initialState;
    default:
      console.log(`Unhandled action type: ${action.type}`);
  }
}

// Context creation corrected to use the existing reducer and action types
const PlanScreenContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | undefined>(undefined);

interface PlanProviderProps {
  children: ReactNode;
}

export const PlanScreenProvider: React.FC<PlanProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <PlanScreenContext.Provider value={{ state, dispatch }}>
      {children}
    </PlanScreenContext.Provider>
  );
};

export function usePlanScreen() {
  const context = useContext(PlanScreenContext);
  if (!context) console.log('usePlanScreen must be used within a PlanScreenProvider');
  return context;
}