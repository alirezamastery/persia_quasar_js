<template>
  <div class="fit q-pa-sm">

    <div class="text-h6 q-ma-md">{{ formTitle }}</div>

    <q-form @submit.prevent="saveItem">
      <div class="row q-ma-sm">
        <div class="col col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-input
            v-model="form.title"
            :label="$t('general.title')"
            filled
            :rules="[isRequired]"
          />
        </div>
      </div>

<!--      <q-btn-->
<!--        color="green"-->
<!--        class="q-ma-sm"-->
<!--        @click="statusDialogOpen = true"-->
<!--      >-->
<!--        {{ $t('products.toggleStatus') }}-->
<!--      </q-btn>-->

      <FormActions
        :show-delete="!!editingItemId"
        @delete="deleteDialog = true"
      />

    </q-form>

    <DeleteDialog
      v-if="editingItemId"
      v-model="deleteDialog"
      :item-repr="itemRepr"
      @delete="handleDeleteItem"
    />

    <q-dialog v-model="statusDialogOpen">
      <q-card>
        <q-bar>
          <span>{{ $t('products.toggleStatus') }}</span>
          <q-space/>
          <q-icon name="warning"/>
        </q-bar>
        <q-card-section class="q-pa-md">
          حواست باشه وقتی اینو بزنی تا 5 - 6 دقیقه نباید کاری که یه سرش به دیجیکالا ختم میشه انجام بدی تو سایت
        </q-card-section>
        <q-card-section class="q-pa-md">
          وضعیت مورد نظر را انتخاب کنید:
          <q-select
            v-model="brandActive"
            :options="brandStatusOptions"
            @update:model-value="brandActive = $event"
            class="q-my-md"
            standout
            :label="$t('general.status')"
          >
            <template v-slot:selected-item="scope">
              {{ scope.opt.label }}
            </template>
          </q-select>
        </q-card-section>
        <q-card-actions>
          <q-btn color="primary" @click="updateBrandStatus">{{ $t('general.submit') }}</q-btn>
          <q-space/>
          <q-btn color="red" @click="statusDialogOpen = false">{{ $t('general.cancel') }}</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
import {cloneDeep} from 'lodash'
import {dataToolsMixin} from 'src/mixins/data-tools'
import {addEditViewMixin} from 'src/mixins/add-edit'
import FormActions from 'src/components/addEdit/FormActions.vue'
import DeleteDialog from 'src/components/addEdit/DeleteDialog.vue'
import urls from 'src/urls'

export default {
  name: 'AddEdit',
  components: {
    DeleteDialog,
    FormActions,
  },
  mixins: [dataToolsMixin, addEditViewMixin],
  data() {
    return {
      urls: urls,
      apiRoot: urls.brands,
      listViewRoute: 'brandList',
      itemType: 'products.brand',
      form: {
        title: null,
        brand: {id: null},
      },
      statusDialogOpen: false,
      brandActive: null,
      brandStatusOptions: [
        {label: 'فعال شود', value: true},
        {label: 'غیر فعال شود', value: false},
      ],
    }
  },
  computed: {
    itemRepr() {
      return this.form.title
    },
  },
  methods: {
    formInit(resData) {
      this.form = cloneDeep(resData)
    },
    getRequestData() {
      return {
        title: this.form.title,
      }
    },
    updateBrandStatus() {
      this.statusDialogOpen = false
      if (this.brandActive === null) return
      const data = {
        'id': this.$route.params.id,
        'is_active': this.brandActive.value,
      }
      this.$q.notify({
        type: 'info',
        message: 'پروسه شروع شد. ببینیم خدا چی میخواد',
        position: 'top',
      })
      this.$axios.post(urls.updateBrandStatus, data)
        .then(res => {
          console.log('brand update response:', res)
        })
    },
  },
}
</script>

<style scoped>

</style>
