const persiaAtlasBase = process.env.API_BASE


export const urls = {
  token: 'token/',
  refreshToken: 'token/refresh/',
  userProfile: 'users/profile/',

  brands: 'products/brands/',
  actualProducts: 'products/actual-products/',
  variantDigiData: 'products/variant-digi-data/',
  products: 'products/products/',
  productTypes: 'products/products-types/',
  productTypeSelectors: 'products/product-type-selectors/',
  productTypeSelectorValues: 'products/product-type-selector-values/',
  variants: 'products/variants/',
  brandsAll: 'products/brands-all/',
  actualProductByBrand: 'products/actual-product-by-brand/{0}/',
  robotVariantsFilter: 'products/robot-variants/',
  inactiveVariants: 'products/inactive-variants/',

  invoices: 'products/invoices/',
  invoiceItems: 'products/invoice-items/',

  actualProductVariants: 'products/actual-product-variants/',
  updateVariantData: 'products/update-variant-data/',
  updateVariantStatus: 'products/update-variant-status/',
  updateVariantPriceMin: 'products/update-variant-price-min/',
  invoiceExcel: 'products/invoice-excel/',
  digiCreds: 'products/digi-creds/',
  celeryTest: 'products/celery-task-test/',
  scrapeInvoice: 'products/scrape-invoice-page/',
  taskState: 'products/task-state/{0}/',
  taskTestSuccess: 'products/task-test-success/',
  taskTestFail: 'products/task-test-fail/',

  costs: 'accounting/costs/',
  costTypes: 'accounting/cost-types/',
  incomes: 'accounting/incomes/',
  productCosts: 'accounting/product-costs/',
  profit: 'accounting/profit/',
}

// const urls = {}
//
// for (const [name, path] of Object.entries(persiaAtlasUrls)) {
//   urls[name] = persiaAtlasBase + path
// }

export default urls
