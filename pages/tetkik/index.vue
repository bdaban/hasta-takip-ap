<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Tetkikler</h1>
      <NuxtLink to="/tetkik/yeni" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
        <span class="flex items-center">
          <i class="fas fa-plus mr-2"></i>
          Yeni Tetkik
        </span>
      </NuxtLink>
    </div>

    <!-- Arama ve Filtreleme -->
    <div class="mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Hasta adı, doktor adı veya tetkik tipi ile ara..."
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="w-full md:w-48">
          <select
            v-model="filterTip"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tüm Tipler</option>
            <option value="kan">Kan</option>
            <option value="idrar">İdrar</option>
            <option value="röntgen">Röntgen</option>
            <option value="ultrason">Ultrason</option>
            <option value="tomografi">Tomografi</option>
            <option value="mri">MRI</option>
            <option value="ekg">EKG</option>
            <option value="diğer">Diğer</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Yükleniyor Durumu -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- Hata Durumu -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
      <strong class="font-bold">Hata!</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <!-- Tetkikler Tablosu -->
    <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hasta
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Doktor
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tip
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarih
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sonuç
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="tetkik in filteredTetkikler" :key="tetkik.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ tetkik.hasta?.ad }} {{ tetkik.hasta?.soyad }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ tetkik.doktor?.ad }} {{ tetkik.doktor?.soyad }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {{ tetkik.tip }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(tetkik.tarih) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="tetkik.sonuc" class="text-sm text-gray-900">{{ tetkik.sonuc }}</span>
                <span v-else class="text-sm text-gray-500">Sonuç yok</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <NuxtLink :to="`/tetkik/${tetkik.id}`" class="text-blue-600 hover:text-blue-900">
                    <i class="fas fa-eye"></i>
                  </NuxtLink>
                  <NuxtLink :to="`/tetkik/${tetkik.id}/duzenle`" class="text-yellow-600 hover:text-yellow-900">
                    <i class="fas fa-edit"></i>
                  </NuxtLink>
                  <button @click="confirmDelete(tetkik)" class="text-red-600 hover:text-red-900">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredTetkikler.length === 0">
              <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                Tetkik bulunamadı
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Silme Onay Modalı -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Tetkik Silme Onayı</h3>
        <p class="text-gray-600 mb-6">
          Bu tetkiki silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
        </p>
        <div class="flex justify-end space-x-4">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            İptal
          </button>
          <button
            @click="deleteTetkik"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            :disabled="deleteLoading"
          >
            <span v-if="deleteLoading" class="flex items-center">
              <i class="fas fa-spinner fa-spin mr-2"></i>
              Siliniyor...
            </span>
            <span v-else>Sil</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Tetkik {
  id: number
  tip: string
  sonuc: string | null
  tarih: string
  hasta?: {
    id: number
    ad: string
    soyad: string
  }
  doktor?: {
    id: number
    ad: string
    soyad: string
  }
}

const loading = ref(true)
const error = ref<string | null>(null)
const tetkikler = ref<Tetkik[]>([])
const searchQuery = ref('')
const filterTip = ref('')
const showDeleteModal = ref(false)
const deleteLoading = ref(false)
const selectedTetkik = ref<Tetkik | null>(null)

// Tetkikleri getir
const fetchTetkikler = async () => {
  loading.value = true
  error.value = null
  
  try {
    const { data, error: fetchError } = await useFetch<Tetkik[]>('/api/tetkikler')
    
    if (fetchError.value) {
      throw new Error(fetchError.value.message)
    }
    
    tetkikler.value = data.value || []
  } catch (err: any) {
    console.error('Tetkikler yüklenirken hata oluştu:', err)
    error.value = 'Tetkikler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
  } finally {
    loading.value = false
  }
}

// Filtrelenmiş tetkikler
const filteredTetkikler = computed(() => {
  return tetkikler.value.filter(tetkik => {
    const matchesSearch = searchQuery.value === '' || 
      (tetkik.hasta?.ad && tetkik.hasta.ad.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (tetkik.hasta?.soyad && tetkik.hasta.soyad.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (tetkik.doktor?.ad && tetkik.doktor.ad.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (tetkik.doktor?.soyad && tetkik.doktor.soyad.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (tetkik.tip && tetkik.tip.toLowerCase().includes(searchQuery.value.toLowerCase()))
    
    const matchesFilter = filterTip.value === '' || tetkik.tip === filterTip.value
    
    return matchesSearch && matchesFilter
  })
})

// Tarih formatla
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Silme onayı
const confirmDelete = (tetkik: Tetkik) => {
  selectedTetkik.value = tetkik
  showDeleteModal.value = true
}

// Tetkik sil
const deleteTetkik = async () => {
  if (!selectedTetkik.value) return
  
  deleteLoading.value = true
  
  try {
    const response = await fetch(`/api/tetkikler/${selectedTetkik.value.id}`, {
      method: 'DELETE'
    })
    
    if (!response.ok) {
      throw new Error('Tetkik silinirken bir hata oluştu')
    }
    
    // Listeyi güncelle
    tetkikler.value = tetkikler.value.filter(t => t.id !== selectedTetkik.value?.id)
    showDeleteModal.value = false
    selectedTetkik.value = null
  } catch (err: any) {
    console.error('Tetkik silinirken hata oluştu:', err)
    alert('Tetkik silinirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.')
  } finally {
    deleteLoading.value = false
  }
}

// Sayfa yüklendiğinde tetkikleri getir
onMounted(() => {
  fetchTetkikler()
})
</script> 