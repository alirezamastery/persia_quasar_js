export const home = () =>
  import(/* webpackChunkName: "general" */ '../views/dashboard/Profile.vue')
export const login = () =>
  import(/* webpackChunkName: "general" */ '../views/auth/Login.vue')
export const logout = () =>
  import(/* webpackChunkName: "general" */ '../views/auth/Logout.vue')
export const profile = () =>
  import(/* webpackChunkName: "general" */ '../views/dashboard/Profile.vue')
export const justRain = () =>
    import(/* webpackChunkName: "general" */ '../views/JustRain.vue')
export const test = () =>
  import(/* webpackChunkName: "general" */ '../views/robot/test.vue')

export const actualProductsList = () =>
  import(/* webpackChunkName: "products" */ '../views/products/actualProduct/List.vue')
export const actualProductAddEdit = () =>
  import(/* webpackChunkName: "products" */ '../views/products/actualProduct/AddEdit.vue')

export const brandList = () =>
  import(/* webpackChunkName: "products" */ '../views/products/brand/List.vue')
export const brandAddEdit = () =>
  import(/* webpackChunkName: "products" */ '../views/products/brand/AddEdit.vue')

export const productsList = () =>
  import(/* webpackChunkName: "products" */ '../views/products/product/List.vue')
export const productAddEdit = () =>
  import(/* webpackChunkName: "products" */ '../views/products/product/AddEdit.vue')

export const productTypesList = () =>
  import(/* webpackChunkName: "products" */ '../views/products/productType/List.vue')
export const productTypeAddEdit = () =>
  import(/* webpackChunkName: "products" */ '../views/products/productType/AddEdit.vue')

// export const productTypeSelectorsList = () =>
//   import(/* webpackChunkName: "products" */ '../views/products/productTypeSelector/List.vue')
// export const productTypeSelectorAddEdit = () =>
//   import(/* webpackChunkName: "products" */ '../views/products/productTypeSelector/AddEdit_Composition.vue')
//
// export const productTypeSelectorValuesList = () =>
//   import(/* webpackChunkName: "products" */ '../views/products/productTypeSelectorValues/List.vue')
// export const productTypeSelectorValueAddEdit = () =>
//   import(/* webpackChunkName: "products" */ '../views/products/productTypeSelectorValues/AddEdit_Composition.vue')

export const variantsList = () =>
  import(/* webpackChunkName: "products" */ '../views/products/variant/List.vue')
export const variantAddEdit = () =>
  import(/* webpackChunkName: "products" */ '../views/products/variant/AddEdit.vue')
export const variantBulkCreate = () =>
  import(/* webpackChunkName: "products" */ '../views/products/variant/BulkCreate.vue')

export const editVariantStatus = () =>
  import(/* webpackChunkName: "robot" */ '../views/robot/variantStatus/EditStatus.vue')

export const editVariantStatusDKPC = () =>
  import(/* webpackChunkName: "robot" */ '../views/robot/variantStatusDKPC/Status.vue')

export const digiCredentials = () =>
  import(/* webpackChunkName: "robot" */ '../views/robot/digiCredentials/DigiCredentials.vue')

export const scrapeInvoice = () =>
  import(/* webpackChunkName: "robot" */ '../views/robot/scrapeInvoice/scrape.vue')

export const inactiveVariants = () =>
  import(/* webpackChunkName: "robot" */ '../views/robot/inactiveVariants/List.vue')

export const WebRTCTest = () =>
    import(/* webpackChunkName: "robot" */ '../views/robot/call/WebRTCTest.vue')


export const invoiceList = () =>
  import(/* webpackChunkName: "robot" */ '../views/accounting/invoice/List.vue')
export const invoiceDetails = () =>
  import(/* webpackChunkName: "robot" */ '../views/accounting/invoice/Details.vue')

export const costList  = () =>
  import(/* webpackChunkName: "accounting" */ '../views/accounting/cost/List.vue')
export const costAddEdit  = () =>
  import(/* webpackChunkName: "accounting" */ '../views/accounting/cost/AddEdit.vue')

export const costTypeList  = () =>
  import(/* webpackChunkName: "accounting" */ '../views/accounting/costType/List.vue')
export const costTypeAddEdit  = () =>
  import(/* webpackChunkName: "accounting" */ '../views/accounting/costType/AddEdit.vue')

export const incomeList  = () =>
  import(/* webpackChunkName: "accounting" */ '../views/accounting/income/List.vue')
export const incomeAddEdit  = () =>
  import(/* webpackChunkName: "accounting" */ '../views/accounting/income/AddEdit.vue')

export const productCostList  = () =>
  import(/* webpackChunkName: "accounting" */ '../views/accounting/productCost/List.vue')
export const productCostAddEdit  = () =>
  import(/* webpackChunkName: "accounting" */ '../views/accounting/productCost/AddEdit.vue')

export const profitByDate  = () =>
  import(/* webpackChunkName: "accounting" */ '../views/accounting/profit/ProfitByDate.vue')
export const profitAllYear  = () =>
  import(/* webpackChunkName: "accounting" */ '../views/accounting/profit/ProfitAllYear.vue')
