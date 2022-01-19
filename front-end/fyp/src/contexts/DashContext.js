import React, { createContext, useContext, useState } from "react";

const DashContext = createContext();

export function useDash() {
  return useContext(DashContext);
}

export function DashProvider({ children }) {
  const value = {};

  return <DashContext.Provider value={value}>{children}</DashContext.Provider>;
}