// Galería de imágenes reales por producto (id → array de URLs)
// Cada producto tiene 5 imágenes únicas para la galería del detalle
export const PRODUCT_IMAGES = {
  // NVIDIA RTX 4090
  1: [
    'https://images.unsplash.com/photo-1587202372583-49330a15584d?w=800&q=85',
    'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=85',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=85',
    'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=800&q=85',
    'https://images.unsplash.com/photo-1560472355-536de3962603?w=800&q=85',
  ],
  // Intel Core i9-14900K
  2: [
    'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=85',
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=85',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=85',
    'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=800&q=85',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=85',
  ],
  // Adobe Creative Cloud
  3: [
    'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=85',
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=85',
    'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=85',
    'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&q=85',
    'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800&q=85',
  ],
  // AutoCAD 2025
  4: [
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=85',
    'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=85',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85',
    'https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?w=800&q=85',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=85',
  ],
  // Soporte Técnico 24/7
  5: [
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=85',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=85',
    'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=85',
    'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=800&q=85',
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=85',
  ],
  // Setup e Instalación Pro
  6: [
    'https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=800&q=85',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=85',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=85',
    'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&q=85',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=85',
  ],
}

// Imagen principal por producto (para cards del catálogo)
export function getMainImage(productoId, fallback) {
  return PRODUCT_IMAGES[productoId]?.[0] ?? fallback
}

// Galería completa (para detalle del producto)
export function getGallery(productoId, fallback) {
  return PRODUCT_IMAGES[productoId] ?? [fallback]
}
