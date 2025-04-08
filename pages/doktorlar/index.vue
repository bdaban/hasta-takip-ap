<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Başlık ve Yeni Doktor Butonu -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800">Doktorlar</h1>
      <NuxtLink to="/doktorlar/yeni" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center shadow-md">
        <Icon name="mdi:plus" class="mr-2 w-5 h-5" />
        Yeni Doktor
      </NuxtLink>
    </div>

    <!-- Arama ve Filtreleme -->
    <div class="mb-8">
      <div class="max-w-md">
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Doktor ara..."
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <Icon name="mdi:magnify" class="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- Yükleniyor Durumu -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- Hata Durumu -->
    <div v-else-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6" role="alert">
      <div class="flex items-center">
        <Icon name="mdi:alert-circle" class="w-5 h-5 mr-2" />
        <span>{{ error }}</span>
      </div>
    </div>

    <!-- Doktor Listesi -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="doktor in filteredDoktorlar" :key="doktor.id" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <Icon name="mdi:account-tie" class="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-800">{{ doktor.ad }} {{ doktor.soyad }}</h2>
              <p class="text-sm text-gray-500">Sicil No: {{ doktor.sicilNo }}</p>
            </div>
          </div>
          
          <div class="space-y-3">
            <div class="flex items-center text-gray-600">
              <Icon name="mdi:medical-bag" class="w-5 h-5 mr-2" />
              <span>{{ doktor.brans }}</span>
              <span v-if="doktor.uzmanlik" class="ml-2 text-sm text-gray-500">({{ doktor.uzmanlik }})</span>
            </div>
            
            <div v-if="doktor.telefon" class="flex items-center text-gray-600">
              <Icon name="mdi:phone" class="w-5 h-5 mr-2" />
              <span>{{ doktor.telefon }}</span>
            </div>
            
            <div v-if="doktor.email" class="flex items-center text-gray-600">
              <Icon name="mdi:email" class="w-5 h-5 mr-2" />
              <span>{{ doktor.email }}</span>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end space-x-3">
            <NuxtLink
              :to="`/doktorlar/${doktor.id}`"
              class="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50"
              title="Görüntüle"
            >
              <Icon name="mdi:eye" class="w-5 h-5" />
            </NuxtLink>
            <NuxtLink
              :to="`/doktorlar/${doktor.id}/duzenle`"
              class="text-yellow-600 hover:text-yellow-800 p-2 rounded-full hover:bg-yellow-50"
              title="Düzenle"
            >
              <Icon name="mdi:pencil" class="w-5 h-5" />
            </NuxtLink>
            <button
              @click="confirmDelete(doktor)"
              class="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50"
              title="Sil"
            >
              <Icon name="mdi:delete" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Silme Onay Modalı -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <div class="flex items-center mb-4">
          <div class="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
            <Icon name="mdi:alert" class="w-6 h-6 text-red-600" />
          </div>
          <h3 class="text-lg font-medium text-gray-900">Doktor Sil</h3>
        </div>
        
        <p class="text-sm text-gray-500 mb-6">
          <span class="font-medium">{{ selectedDoktor?.ad }} {{ selectedDoktor?.soyad }}</span> isimli doktoru silmek istediğinize emin misiniz?
        </p>
        
        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition duration-200"
          >
            İptal
          </button>
          <button
            @click="handleDelete"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition duration-200 flex items-center"
            :disabled="deleting"
          >
            <Icon v-if="deleting" name="mdi:loading" class="animate-spin mr-2 w-4 h-4" />
            <span>{{ deleting ? 'Siliniyor...' : 'Sil' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

interface Doktor {
  id: number
  ad: string
  soyad: string
  brans: string
  sicilNo: string
  telefon: string | null
  email: string | null
  unvan: string | null
  uzmanlik: string | null
}

const router = useRouter()
const loading = ref(true)
const error = ref<string | null>(null)
const doktorlar = ref<Doktor[]>([])
const searchQuery = ref('')
const showDeleteModal = ref(false)
const selectedDoktor = ref<Doktor | null>(null)
const deleting = ref(false)

// Filtrelenmiş doktor listesi
const filteredDoktorlar = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return doktorlar.value.filter(doktor => 
    doktor.ad.toLowerCase().includes(query) ||
    doktor.soyad.toLowerCase().includes(query) ||
    doktor.brans.toLowerCase().includes(query) ||
    doktor.sicilNo.toLowerCase().includes(query)
  )
})

// Doktorları getir
const fetchDoktorlar = async () => {
  loading.value = true
  error.value = null
  
  try {
    const { data, error: fetchError } = await useFetch<Doktor[]>('/api/doktorlar')
    
    if (fetchError.value) {
      throw new Error(fetchError.value.message)
    }
    
    if (data.value) {
      doktorlar.value = data.value
    }
  } catch (err: any) {
    console.error('Doktorlar yüklenirken hata oluştu:', err)
    error.value = 'Doktorlar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
  } finally {
    loading.value = false
  }
}

// Silme onayı
const confirmDelete = (doktor: Doktor) => {
  selectedDoktor.value = doktor
  showDeleteModal.value = true
}

// Doktor sil
const handleDelete = async () => {
  if (!selectedDoktor.value) return
  
  deleting.value = true
  
  try {
    const response = await fetch(`/api/doktorlar/${selectedDoktor.value.id}`, {
      method: 'DELETE'
    })
    
    if (!response.ok) {
      throw new Error('Doktor silinirken bir hata oluştu')
    }
    
    // Doktor listesini güncelle
    doktorlar.value = doktorlar.value.filter(d => d.id !== selectedDoktor.value?.id)
    showDeleteModal.value = false
    selectedDoktor.value = null
  } catch (err: any) {
    console.error('Doktor silinirken hata oluştu:', err)
    error.value = 'Doktor silinirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
  } finally {
    deleting.value = false
  }
}

// Sayfa yüklendiğinde doktorları getir
onMounted(() => {
  fetchDoktorlar()
})
</script> 