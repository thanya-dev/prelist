export function normalizeProducts(products = []) {
  return products
    .map((product) =>
      typeof product === 'string'
        ? { name: product, image: '', description: '', isLegacy: true }
        : { name: '', image: '', description: '', ...product },
    )
    .filter((product) => product.name || product.image || product.description);
}
export function validateProducts(products) {
  return products.map((product) => ({
    name: product.name.trim() ? '' : 'กรุณาระบุชื่อสินค้า',
    image: product.image || product.isLegacy ? '' : 'กรุณาเพิ่มรูปสินค้า',
  }));
}
