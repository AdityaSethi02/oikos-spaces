"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { loadFavoriteIdsAction, toggleFavoriteAction } from "@/app/actions/favorites.actions";
import { isClerkConfigured } from "@/lib/clerk";

interface FavoritesContextValue {
  favorites: string[];
  toggleFavorite: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;
  loaded: boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(!isClerkConfigured);

  useEffect(() => {
    if (!isClerkConfigured) return;
    loadFavoriteIdsAction()
      .then((result) => {
        if (result.ok) setFavorites(result.ids);
      })
      .catch(() => undefined)
      .finally(() => setLoaded(true));
  }, []);

  const toggleFavorite = useCallback((propertyId: string) => {
    if (!isClerkConfigured) return;
    setFavorites((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId],
    );
    toggleFavoriteAction(propertyId)
      .then((result) => {
        if (!result.ok) {
          loadFavoriteIdsAction().then((r) => {
            if (r.ok) setFavorites(r.ids);
          });
        } else if (!result.favorited) {
          setFavorites((prev) => prev.filter((id) => id !== propertyId));
        } else {
          setFavorites((prev) => (prev.includes(propertyId) ? prev : [...prev, propertyId]));
        }
      })
      .catch(() => undefined);
  }, []);

  const isFavorite = useCallback(
    (propertyId: string) => favorites.includes(propertyId),
    [favorites],
  );

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, loaded }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
