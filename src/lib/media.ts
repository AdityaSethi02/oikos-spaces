/** Unsplash CDN helper — free to use under the Unsplash License. */
export function unsplash(photoId: string, w = 1200, h?: number) {
  const params = new URLSearchParams({
    auto: "format",
    fit: "crop",
    w: String(w),
    q: "80",
  });
  if (h) params.set("h", String(h));
  return `https://images.unsplash.com/${photoId}?${params.toString()}`;
}

/** Site-wide brand / marketing images */
export const brandImages = {
  hero: unsplash("photo-1600596542815-ffad4c1539a9", 1920, 800),
  about: unsplash("photo-1560518883-ce09059eeffa", 1200, 800),
  city: unsplash("photo-1477587458883-47145ed94245", 1200, 800),
  map: unsplash("photo-1524661135-423995f22d0b", 1280, 720),
} as const;

/** Curated stock sets used by mock listings (cover + gallery). */
export const listingImageSets = {
  lakeApartment: [
    unsplash("photo-1502672260266-1c1ef2d93688", 1200, 900),
    unsplash("photo-1560448204-e02f11c3d0e2", 1200, 900),
    unsplash("photo-1522708323590-d24dbb6b0267", 1200, 900),
    unsplash("photo-1493809842364-78817add7ffb", 1200, 900),
    unsplash("photo-1505693416388-ac5ce068fe85", 1200, 900),
    unsplash("photo-1556912173-46c336c7fd55", 1200, 900),
  ],
  heritage: [
    unsplash("photo-1600585154340-be6161a56a0c", 1200, 900),
    unsplash("photo-1600607687939-ce8a6c25118c", 1200, 900),
    unsplash("photo-1600566753190-17f0baa2a6c3", 1200, 900),
    unsplash("photo-1600210492486-724fe5c67fb0", 1200, 900),
    unsplash("photo-1600047509807-ba8f99d2cd00", 1200, 900),
    unsplash("photo-1600573472592-401b489a3cdc", 1200, 900),
  ],
  villa: [
    unsplash("photo-1613490493576-7fde63acd811", 1200, 900),
    unsplash("photo-1613977257363-707ba9348227", 1200, 900),
    unsplash("photo-1600596542815-ffad4c1539a9", 1200, 900),
    unsplash("photo-1600585154526-990dced4db0d", 1200, 900),
    unsplash("photo-1600607687644-c7171b42498f", 1200, 900),
    unsplash("photo-1600566753086-00f18fb6b3ea", 1200, 900),
  ],
  cityApartment: [
    unsplash("photo-1545324418-cc1a3fa10c00", 1200, 900),
    unsplash("photo-1512917774080-9991f1c4c750", 1200, 900),
    unsplash("photo-1484154218962-a197022b5858", 1200, 900),
    unsplash("photo-1501183638710-841dd1904471", 1200, 900),
    unsplash("photo-1560185127-6ed189bf02f4", 1200, 900),
  ],
  plot: [
    unsplash("photo-1500382017468-9049fed747ef", 1200, 900),
    unsplash("photo-1464082354059-27db6ce50048", 1200, 900),
    unsplash("photo-1449844908441-8829872d2607", 1200, 900),
    unsplash("photo-1470071459604-3b5ec3a7fe05", 1200, 900),
  ],
  commercial: [
    unsplash("photo-1497366216548-37526070297c", 1200, 900),
    unsplash("photo-1497366754035-f200968a6e72", 1200, 900),
    unsplash("photo-1486406146926-c627a92ad1ab", 1200, 900),
    unsplash("photo-1524758631624-e2822e304c36", 1200, 900),
    unsplash("photo-1497215728101-5362696cc1d2", 1200, 900),
  ],
  rental: [
    unsplash("photo-1560185007-cde436f6a4d0", 1200, 900),
    unsplash("photo-1560184897-ae75f418493e", 1200, 900),
    unsplash("photo-1560448204-603b3fc33ddc", 1200, 900),
    unsplash("photo-1554995207-c18c203806cb", 1200, 900),
    unsplash("photo-1560448075-bb485b067938", 1200, 900),
  ],
  office: [
    unsplash("photo-1497215842964-222b430dc094", 1200, 900),
    unsplash("photo-1556761175-5973dc0f32e7", 1200, 900),
    unsplash("photo-1497366811353-6870744d04b2", 1200, 900),
    unsplash("photo-1604328698692-f76ea9498e76", 1200, 900),
  ],
  lakePremium: [
    unsplash("photo-1600047509358-9dc75507daeb", 1200, 900),
    unsplash("photo-1600585154363-67eb9e2e2099", 1200, 900),
    unsplash("photo-1600573472550-8090b5e0745e", 1200, 900),
    unsplash("photo-1600607687920-4e2a09cf159d", 1200, 900),
    unsplash("photo-1600566752355-35792bedcfea", 1200, 900),
    unsplash("photo-1600210491892-03d54c0aaf87", 1200, 900),
  ],
  gatedVilla: [
    unsplash("photo-1605276374104-dee2a0ed3cd6", 1200, 900),
    unsplash("photo-1605146768851-eda79da39897", 1200, 900),
    unsplash("photo-1600047509807-ba8f99d2cd00", 1200, 900),
    unsplash("photo-1600585154340-be6161a56a0c", 1200, 900),
    unsplash("photo-1600607687939-ce8a6c25118c", 1200, 900),
    unsplash("photo-1613977257592-4871e5fcd7c4", 1200, 900),
  ],
} as const;

export type ListingImageSetKey = keyof typeof listingImageSets;
