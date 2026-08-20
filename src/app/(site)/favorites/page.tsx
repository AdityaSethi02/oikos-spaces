import { requireAuthUser } from "@/server/policies/auth.policy";
import { listFavoriteProperties } from "@/server/services/favorites.service";
import { PropertyGridSkeleton } from "@/components/feedback/data-skeletons";
import { FavoritesList } from "./favorites-list";
import { isDatabaseConfigured } from "@/lib/env";

export const metadata = { title: "Saved stays" };
export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  if (!isDatabaseConfigured) {
    return (
      <div className="section-padding">
        <div className="container-page">
          <h1 className="font-serif text-3xl">Saved stays</h1>
          <div className="mt-8">
            <PropertyGridSkeleton count={3} />
          </div>
        </div>
      </div>
    );
  }

  const user = await requireAuthUser();
  const properties = await listFavoriteProperties(user);
  return <FavoritesList properties={properties} />;
}
