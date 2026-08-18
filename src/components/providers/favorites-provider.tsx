"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface FavoritesContextValue {
  favorites: string[];
  toggleFavorite: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(["prop-1", "prop-3"]);

  const toggleFavorite = useCallback((propertyId: string) => {
    setFavorites((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId],
    );
  }, []);

  const isFavorite = useCallback(
    (propertyId: string) => favorites.includes(propertyId),
    [favorites],
  );

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
