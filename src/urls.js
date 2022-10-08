const persiaAtlasBase = process.env.API_BASE


export const urls = {
  token: 'token/',
  refreshToken: 'token/refresh/',
  userProfile: 'users/profile/',
  users: 'users/users/',

  brands: 'products/brands/',
  actualProducts: 'products/actual-products/',
  variantDigiData: 'products/variant-digi-data/',
  variantDigiDataDKPC: 'products/variant-digi-data-dkpc/',
  products: 'products/products/',
  productTypes: 'products/products-types/',
  variantSelectorTypes: 'products/variant-selector-types/',
  variantSelectors: 'products/variant-selectors/',
  variants: 'products/variants/',
  variantBulkCreate: 'products/variants/bulk-create/',
  brandsAll: 'products/brands-all/',
  actualProductByBrand: 'products/actual-product-by-brand/{0}/',
  robotVariantsFilter: 'products/robot-variants/',
  inactiveVariants: 'products/inactive-variants/',

  robotStatus: 'products/robot-status/',
  updateVariantData: 'products/update-variant-data/',
  updateBrandStatus: 'products/update-brand-status/',
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
  profitYear: 'accounting/profit-year/',
  invoices: 'accounting/invoices/',
  invoiceItems: 'accounting/invoice-items/',
}

// const urls = {}
//
// for (const [name, path] of Object.entries(persiaAtlasUrls)) {
//   urls[name] = persiaAtlasBase + path
// }

export default urls
