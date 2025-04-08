<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Tetkik Detayı</h1>
      <NuxtLink to="/tetkik" class="text-blue-600 hover:text-blue-800">
        <span class="flex items-center">
          <i class="fas fa-arrow-left mr-2"></i>
          Tetkiklere Dön
        </span>
      </NuxtLink>
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

    <!-- Tetkik Detayları -->
    <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Hasta Bilgileri -->
          <div>
            <h2 class="text-lg font-medium text-gray-900 mb-4">Hasta Bilgileri</h2>
            <div class="bg-gray-50 p-4 rounded-md">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Ad Soyad</p>
                  <p class="font-medium">{{ tetkik.hasta?.ad }} {{ tetkik.hasta?.soyad }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">TC Kimlik No</p>
                  <p class="font-medium">{{ tetkik.hasta?.tc }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Telefon</p>
                  <p class="font-medium">{{ tetkik.hasta?.telefon || 'Belirtilmemiş' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Doğum Tarihi</p>
                  <p class="font-medium">{{ formatDate(tetkik.hasta?.dogumTarihi) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Doktor Bilgileri -->
          <div>
            <h2 class="text-lg font-medium text-gray-900 mb-4">Doktor Bilgileri</h2>
            <div class="bg-gray-50 p-4 rounded-md">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Ad Soyad</p>
                  <p class="font-medium">{{ tetkik.doktor?.ad }} {{ tetkik.doktor?.soyad }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Sicil No</p>
                  <p class="font-medium">{{ tetkik.doktor?.sicilNo }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Branş</p>
                  <p class="font-medium">{{ tetkik.doktor?.brans }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Unvan</p>
                  <p class="font-medium">{{ tetkik.doktor?.unvan || 'Belirtilmemiş' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Tetkik Bilgileri -->
          <div class="md:col-span-2">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Tetkik Bilgileri</h2>
            <div class="bg-gray-50 p-4 rounded-md">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Tetkik Tipi</p>
                  <p class="font-medium">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {{ tetkik.tip }}
                    </span>
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Tarih</p>
                  <p class="font-medium">{{ formatDate(tetkik.tarih) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Sonuç</p>
                  <p class="font-medium">{{ tetkik.sonuc || 'Sonuç yok' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- İşlem Butonları -->
        <div class="mt-6 flex justify-end space-x-4">
          <NuxtLink
            :to="`/tetkik/${tetkik.id}/duzenle`"
            class="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
          >
            <span class="flex items-center">
              <i class="fas fa-edit mr-2"></i>
              Düzenle
            </span>
          </NuxtLink>
          <button
            @click="confirmDelete"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <span class="flex items-center">
              <i class="fas fa-trash mr-2"></i>
              Sil
            </span>
          </button>
        </div>
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
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface Tetkik {
  id: number
  tip: string
  sonuc: string | null
  tarih: string
  hasta?: {
    id: number
    ad: string
    soyad: string
    tc: string
    telefon: string | null
    dogumTarihi: string
  }
  doktor?: {
    id: number
    ad: string
    soyad: string
    sicilNo: string
    brans: string
    unvan: string | null
  }
}

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const error = ref<string | null>(null)
const tetkik = ref<Tetkik>({} as Tetkik)
const showDeleteModal = ref(false)
const deleteLoading = ref(false)

// Tetkik detaylarını getir
const fetchTetkik = async () => {
  loading.value = true
  error.value = null
  
  try {
    const { data, error: fetchError } = await useFetch<Tetkik>(`/api/tetkikler/${route.params.id}`)
    
    if (fetchError.value) {
      throw new Error(fetchError.value.message)
    }
    
    if (!data.value) {
      throw new Error('Tetkik bulunamadı')
    }
    
    tetkik.value = data.value
  } catch (err: any) {
    console.error('Tetkik detayları yüklenirken hata oluştu:', err)
    error.value = 'Tetkik detayları yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
  } finally {
    loading.value = false
  }
}

// Tarih formatla
const formatDate = (dateString?: string) => {
  if (!dateString) return 'Belirtilmemiş'
  
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

// Silme onayı
const confirmDelete = () => {
  showDeleteModal.value = true
}

// Tetkik sil
const deleteTetkik = async () => {
  deleteLoading.value = true
  
  try {
    const response = await fetch(`/api/tetkikler/${tetkik.value.id}`, {
      method: 'DELETE'
    })
    
    if (!response.ok) {
      throw new Error('Tetkik silinirken bir hata oluştu')
    }
    
    // Tetkikler sayfasına yönlendir
    router.push('/tetkik')
  } catch (err: any) {
    console.error('Tetkik silinirken hata oluştu:', err)
    alert('Tetkik silinirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.')
  } finally {
    deleteLoading.value = false
    showDeleteModal.value = false
  }
}

// Sayfa yüklendiğinde tetkik detaylarını getir
onMounted(() => {
  fetchTetkik()
})
</script> 