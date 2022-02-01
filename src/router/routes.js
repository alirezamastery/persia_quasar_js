import * as views from './chunks'

const routesObj = {
  Home: {
    path: '/',
    name: 'Home',
    component: views.variantsList,
    meta: {requiresAuth: true},
    // children: [{ path: '', component: () => import('pages/Index.vue') }],
  },
  // #################### Auth ####################
  Login: {
    path: '/login',
    name: 'Login',
    component: views.login,
    meta: {
      guest: true,
    },
  },
  Logout: {
    path: '/logout',
    name: 'Logout',
    meta: {
      requiresAuth: true,
    },
    component: views.logout,
  },
  Profile: {
    path: '/user/profile',
    name: 'Profile',
    component: views.profile,
    meta: {
      requiresAuth: true,
    },
  },
// #################### Products App ####################
  // ********** Actual Products **********
  actualProductList: {
    path: '/actual-products',
    component: views.actualProductsList,
    name: 'actualProductList',
    meta: {
      titleI18n: 'general.routes.actualProducts',
      icon: 'qr_code_2',
      requiresAuth: true,
    },
  },
  actualProductAdd: {
    path: '/actual-products/add',
    component: views.actualProductAddEdit,
    name: 'actualProductAdd',
    meta: {
      requiresAuth: true,
    },
  },
  actualProductEdit: {
    path: '/actual-products/edit/:id',
    component: views.actualProductAddEdit,
    name: 'actualProductEdit',
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  // ********** Brands **********
  brandList: {
    path: '/brands',
    component: views.brandList,
    name: 'brandList',
    meta: {
      titleI18n: 'general.routes.brands',
      icon: 'branding_watermark',
      requiresAuth: true,
    },
  },
  brandAdd: {
    path: '/brands/add',
    component: views.brandAddEdit,
    name: 'brandAdd',
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  brandEdit: {
    path: '/brands/edit/:id',
    component: views.brandAddEdit,
    name: 'brandEdit',
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  // ********** Products **********
  productList: {
    path: '/products',
    component: views.productsList,
    name: 'productList',
    meta: {
      titleI18n: 'general.routes.products',
      icon: 'widgets',
      requiresAuth: true,
    },
  },
  productAdd: {
    path: '/products/add',
    component: views.productAddEdit,
    name: 'productAdd',
    meta: {
      requiresAuth: true,
    },
  },
  productEdit: {
    path: '/products/edit/:id',
    component: views.productAddEdit,
    name: 'productEdit',
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  // ********** Product Types **********
  productTypeList: {
    path: '/product-types',
    component: views.productTypesList,
    name: 'productTypeList',
    meta: {
      titleI18n: 'general.routes.productTypes',
      icon: 'category',
      requiresAuth: true,
    },
  },
  productTypeAdd: {
    path: '/product-types/add',
    component: views.productTypeAddEdit,
    name: 'productTypeAdd',
    meta: {
      requiresAuth: true,
    },
  },
  productTypeEdit: {
    path: '/product-types/edit/:id',
    component: views.productTypeAddEdit,
    name: 'productTypeEdit',
    props: true,
    meta: {
      requiresAuth: true,
    },
  },


  // ********** Variants **********
  variantList: {
    path: '/variants',
    component: views.variantsList,
    name: 'variantList',
    meta: {
      titleI18n: 'general.routes.variants',
      icon: 'account_tree',
      requiresAuth: true,
    },
  },
  variantAdd: {
    path: '/variants/add',
    name: 'variantAdd',
    component: views.variantAddEdit,
    meta: {
      requiresAuth: true,
    },
  },
  variantEdit: {
    path: '/variants/edit/:id?',
    name: 'variantEdit',
    component: views.variantAddEdit,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },

  // #################### Robot ####################
  // ********** Variant Status **********
  editVariantStatus: {
    path: '/robot/variant-status',
    name: 'editVariantStatus',
    component: views.editVariantStatus,
    meta: {
      titleI18n: 'general.routes.variantStatus',
      icon: 'find_in_page',
      requiresAuth: true,
    },
  },
  // // ********** Invoice Download **********
  // invoiceDownload: {
  //   path: '/robot/invoice-download',
  //   name: 'invoiceDownload',
  //   component: views.invoiceDownload,
  //   meta: {
  //     titleI18n: 'general.routes.invoices',
  //     requiresAuth: true,
  //   },
  // },
  // // ********** Digi Credentials **********
  // digiCredentials: {
  //   path: '/robot/digi-creds',
  //   name: 'digiCredentials',
  //   component: views.digiCredentials,
  //   meta: {
  //     titleI18n: 'general.routes.digiPassword',
  //     requiresAuth: true,
  //   },
  // },
  // // ********** Scrape Invoice **********
  // scrapeInvoice: {
  //   path: '/robot/scrape-invoice',
  // name:'',
  //   component: views.scrapeInvoice,
  //   meta: {
  //     titleI18n: 'general.routes.digiPassword',
  //     requiresAuth: true,
  //   },
  // },

  // #################### Accounting ####################
  // ********** Cost **********
  costList: {
    path: '/accounting/costs',
    name: 'costList',
    component: views.costList,
    meta: {
      titleI18n: 'acc.costs',
      icon: 'money_off',
      requiresAuth: true,
    },
  },
  costAdd: {
    path: '/accounting/costs/add',
    name: 'costAdd',
    component: views.costAddEdit,
    meta: {
      requiresAuth: true,
    },
  },
  costEdit: {
    path: '/accounting/costs/edit/:id?',
    name: 'costEdit',
    component: views.costAddEdit,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  // ********** Cost Type **********
  costTypeList: {
    path: '/accounting/cost-types',
    name: 'costTypeList',
    component: views.costTypeList,
    meta: {
      titleI18n: 'acc.costTypes',
      icon: 'price_change',
      requiresAuth: true,
    },
  },
  costTypeAdd: {
    path: '/accounting/costs-types/add',
    name: 'costTypeAdd',
    component: views.costTypeAddEdit,
    meta: {
      requiresAuth: true,
    },
  },
  costTypeEdit: {
    path: '/accounting/costs-types/edit/:id?',
    name: 'costTypeEdit',
    component: views.costTypeAddEdit,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  // ********** Income **********
  incomeList: {
    path: '/accounting/income',
    name: 'incomeList',
    component: views.incomeList,
    meta: {
      titleI18n: 'acc.incomes',
      icon: 'attach_money',
      requiresAuth: true,
    },
  },
  incomeAdd: {
    path: '/accounting/income/add',
    name: 'incomeAdd',
    component: views.incomeAddEdit,
    meta: {
      requiresAuth: true,
    },
  },
  incomeEdit: {
    path: '/accounting/income/edit/:id?',
    name: 'incomeEdit',
    component: views.incomeAddEdit,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  // ********** Product Cost **********
  productCostList: {
    path: '/accounting/product-cost',
    name: 'productCostList',
    component: views.productCostList,
    meta: {
      titleI18n: 'acc.productCosts',
      icon: 'shopping_cart',
      requiresAuth: true,
    },
  },
  productCostAdd: {
    path: '/accounting/product-cost/add',
    name: 'productCostAdd',
    component: views.productCostAddEdit,
    meta: {
      requiresAuth: true,
    },
  },
  productCostEdit: {
    path: '/accounting/product-cost/edit/:id?',
    name: 'productCostEdit',
    component: views.productCostAddEdit,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },

  '404': {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
}

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '', component: () => import('pages/Index.vue')},
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
]

export default routesObj
