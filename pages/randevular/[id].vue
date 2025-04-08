<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-md">
      <div class="p-6 border-b">
        <div class="flex justify-between items-center">
          <h1 class="text-xl font-bold">Randevu Detayı</h1>
          <NuxtLink
            to="/randevular"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            Geri Dön
          </NuxtLink>
        </div>
      </div>

      <div class="p-6">
        <!-- Yükleniyor -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>

        <!-- Hata -->
        <div v-else-if="error" class="text-center py-12">
          <div class="text-red-500">{{ error }}</div>
        </div>

        <!-- Randevu Detayları -->
        <div v-else-if="randevu" class="space-y-6">
          <!-- Hasta ve Doktor Bilgileri -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Hasta Bilgileri</h3>
              <dl class="space-y-2">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Ad Soyad</dt>
                  <dd class="text-sm text-gray-900">{{ randevu.hasta.ad }} {{ randevu.hasta.soyad }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">TC Kimlik No</dt>
                  <dd class="text-sm text-gray-900">{{ randevu.hasta.tc }}</dd>
                </div>
              </dl>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Doktor Bilgileri</h3>
              <dl class="space-y-2">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Ad Soyad</dt>
                  <dd class="text-sm text-gray-900">{{ randevu.doktor.ad }} {{ randevu.doktor.soyad }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Uzmanlık</dt>
                  <dd class="text-sm text-gray-900">{{ randevu.doktor.uzmanlik }}</dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Randevu Detayları -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Randevu Detayları</h3>
            <dl class="space-y-4">
              <div>
                <dt class="text-sm font-medium text-gray-500">Tarih ve Saat</dt>
                <dd class="text-sm text-gray-900">{{ formatDate(randevu.tarih) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Durum</dt>
                <dd class="text-sm">
                  <span
                    :class="{
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full': true,
                      'bg-yellow-100 text-yellow-800': randevu.durum === 'Beklemede',
                      'bg-blue-100 text-blue-800': randevu.durum === 'Devam Ediyor',
                      'bg-green-100 text-green-800': randevu.durum === 'Tamamlandı',
                      'bg-red-100 text-red-800': randevu.durum === 'İptal'
                    }"
                  >
                    {{ randevu.durum }}
                  </span>
                </dd>
              </div>
              <div v-if="randevu.notlar">
                <dt class="text-sm font-medium text-gray-500">Notlar</dt>
                <dd class="text-sm text-gray-900">{{ randevu.notlar }}</dd>
              </div>
            </dl>
          </div>

          <!-- İşlem Butonları -->
          <div class="flex justify-end space-x-3">
            <NuxtLink
              :to="`/randevular/${randevu.id}/duzenle`"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Düzenle
            </NuxtLink>
            <button
              @click="showDeleteModal"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Silme Modal -->
  <div v-if="showDeleteConfirm" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Randevuyu Sil</h3>
      <p class="text-sm text-gray-500 mb-6">
        Bu randevuyu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
      </p>
      <div class="flex justify-end space-x-3">
        <button
          @click="showDeleteConfirm = false"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          İptal
        </button>
        <button
          @click="handleDelete"
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Sil
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Hasta {
  id: number
  ad: string
  soyad: string
  tc: string
}

interface Doktor {
  id: number
  ad: string
  soyad: string
  uzmanlik: string
}

interface Randevu {
  id: number
  hasta: Hasta
  doktor: Doktor
  tarih: string
  durum: string
  notlar?: string
}

const route = useRoute()
const loading = ref(false)
const error = ref<string | null>(null)
const randevu = ref<Randevu | null>(null)
const showDeleteConfirm = ref(false)

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const showDeleteModal = () => {
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  if (!randevu.value) return

  try {
    loading.value = true
    const { error: deleteError } = await useFetch(`/api/randevular/${randevu.value.id}`, {
      method: 'DELETE'
    })

    if (deleteError.value) {
      throw deleteError.value
    }

    navigateTo('/randevular')
  } catch (err: any) {
    error.value = err.message || 'Randevu silinirken bir hata oluştu'
  } finally {
    loading.value = false
  }
}

const fetchRandevu = async () => {
  try {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await useFetch<Randevu>(`/api/randevular/${route.params.id}`)
    
    if (fetchError.value) {
      throw fetchError.value
    }
    
    randevu.value = data.value
  } catch (err: any) {
    error.value = err.message || 'Randevu bilgileri yüklenirken bir hata oluştu'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchRandevu()
})

definePageMeta({
  title: 'Randevu Detayı'
})
</script> 