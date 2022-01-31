<template>
  <q-drawer
    v-model="generalState.sideOpen"
    show-if-above
    bordered
  >
    <q-list>
      <q-item-label header>
        Essential Links
      </q-item-label>

      <!--      <q-scroll-area class="fit">-->
      <template
        v-for="(item, i) in menuItems"
        :key="i"
      >
        <q-expansion-item
          expand-separator
          :icon="item.icon"
          :label="$t(item.titleI18n)"
          default-opened
          :header-style="{ fontSize: '1.1rem' }"
        >
          <q-item
            v-for="(subItem, j) in item.children"
            :key="j"
            :to="{name: subItem.routeName}"
            :inset-level="0.5"
            clickable
            v-ripple
          >
            <q-item-section v-if="subItem.icon" avatar>
              <q-icon :name="subItem.icon"/>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ $t(subItem.titleI18n) }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-expansion-item>
      </template>
      <!--      </q-scroll-area>-->
    </q-list>
  </q-drawer>
</template>

<script>
import {generalState} from './composables'
import routesObj from 'src/router/routes'


function getRoute(route) {
  return {
    routeName: routesObj[route].name,
    titleI18n: routesObj[route].meta?.titleI18n,
    permission: routesObj[route].meta?.permission || [],
    icon: routesObj[route].meta?.icon,
  }
}

const menuItems = [
  {
    icon: 'mdi-warehouse',
    order: 20,
    titleI18n: 'general.routes.products',
    collapsed: false,
    children: [
      getRoute('brandList'),
      getRoute('productTypeList'),
      getRoute('actualProductList'),
      getRoute('productList'),
      // getRoute('productTypeSelectorList'),
      // getRoute('productTypeSelectorValueList'),
      getRoute('variantList'),
    ],
  },
  {
    icon: 'industrial',
    order: 30,
    titleI18n: 'general.routes.robot',
    collapsed: false,
    children: [
      // getRoute('editVariantStatus'),
      // getRoute('invoiceDownload'),
      // getRoute('digiCredentials'),
    ],
  },
  {
    icon: 'mdi-calculator',
    order: 40,
    titleI18n: 'acc.accounting',
    collapsed: false,
    children: [
      getRoute('costTypeList'),
      getRoute('costList'),
      getRoute('incomeList'),
      getRoute('productCostList'),
    ],
  },
]
export default {
  name: 'Sidebar',
  setup() {
    return {
      generalState,
      menuItems,
    }
  },
}
</script>

<style scoped>

</style>
