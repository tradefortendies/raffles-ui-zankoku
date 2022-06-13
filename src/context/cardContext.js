import React, { createContext, useState } from "react";

// Create Context Object
export const CardContext = createContext();

// Create a provider for components to consume and subscribe to changes
export const CardContextProvider = props => {
  const [card, setCard] = useState(null);

  return (
    <CardContext.Provider value={[card, setCard]}>
      {props.children}
    </CardContext.Provider>
  );
};