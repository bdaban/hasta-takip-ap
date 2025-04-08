<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-md">
      <div class="p-6 border-b">
        <div class="flex justify-between items-center">
          <h1 class="text-xl font-bold">Randevular</h1>
          <NuxtLink
            to="/randevular/yeni"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Yeni Randevu
          </NuxtLink>
        </div>
      </div>

      <div class="p-6">
        <!-- Arama -->
        <div class="mb-6">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Hasta adı, doktor adı veya durum ile ara..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

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

        <!-- Boş Durum -->
        <div v-else-if="filteredRandevular.length === 0" class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Randevu Bulunamadı</h3>
          <p class="mt-1 text-sm text-gray-500">Yeni bir randevu oluşturmak için "Yeni Randevu" butonuna tıklayın.</p>
        </div>

        <!-- Randevu Listesi -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hasta</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doktor</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="randevu in filteredRandevular" :key="randevu.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ randevu.hasta.ad }} {{ randevu.hasta.soyad }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ randevu.doktor.ad }} {{ randevu.doktor.soyad }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(randevu.tarih) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
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
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <NuxtLink
                    :to="`/randevular/${randevu.id}`"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    Görüntüle
                  </NuxtLink>
                  <NuxtLink
                    :to="`/randevular/${randevu.id}/duzenle`"
                    class="text-indigo-600 hover:text-indigo-900"
                  >
                    Düzenle
                  </NuxtLink>
                  <button
                    @click="showDeleteModal(randevu)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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
import { ref, computed } from 'vue'

interface Hasta {
  id: number
  ad: string
  soyad: string
}

interface Doktor {
  id: number
  ad: string
  soyad: string
}

interface Randevu {
  id: number
  hasta: Hasta
  doktor: Doktor
  tarih: string
  durum: string
}

const loading = ref(false)
const error = ref<string | null>(null)
const randevular = ref<Randevu[]>([])
const searchQuery = ref('')
const showDeleteConfirm = ref(false)
const selectedRandevu = ref<Randevu | null>(null)

const filteredRandevular = computed(() => {
  if (!searchQuery.value) return randevular.value
  const query = searchQuery.value.toLowerCase()
  return randevular.value.filter(randevu => 
    randevu.hasta.ad.toLowerCase().includes(query) ||
    randevu.hasta.soyad.toLowerCase().includes(query) ||
    randevu.doktor.ad.toLowerCase().includes(query) ||
    randevu.doktor.soyad.toLowerCase().includes(query) ||
    randevu.durum.toLowerCase().includes(query)
  )
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const showDeleteModal = (randevu: Randevu) => {
  selectedRandevu.value = randevu
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  if (!selectedRandevu.value) return

  try {
    loading.value = true
    const { error: deleteError } = await useFetch(`/api/randevular/${selectedRandevu.value.id}`, {
      method: 'DELETE'
    })

    if (deleteError.value) {
      throw deleteError.value
    }

    randevular.value = randevular.value.filter(r => r.id !== selectedRandevu.value?.id)
    showDeleteConfirm.value = false
    selectedRandevu.value = null
  } catch (err: any) {
    error.value = err.message || 'Randevu silinirken bir hata oluştu'
  } finally {
    loading.value = false
  }
}

const fetchRandevular = async () => {
  try {
    loading.value = true
    error.value = null
    const { data, error: fetchError } = await useFetch<Randevu[]>('/api/randevular')
    
    if (fetchError.value) {
      throw fetchError.value
    }
    
    randevular.value = data.value || []
  } catch (err: any) {
    error.value = err.message || 'Randevular yüklenirken bir hata oluştu'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchRandevular()
})

definePageMeta({
  title: 'Randevular'
})
</script> 