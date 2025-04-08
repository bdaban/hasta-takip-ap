<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Başlık ve Yeni Takip Butonu -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800">Hasta Takipleri</h1>
      <NuxtLink to="/takipler/yeni" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center shadow-md">
        <Icon name="mdi:plus" class="mr-2 w-5 h-5" />
        Yeni Takip
      </NuxtLink>
    </div>

    <!-- Arama ve Filtreleme -->
    <div class="mb-8">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Hasta adı, doktor adı veya şikayet ile ara..."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
              <Icon name="mdi:magnify" class="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
        <div class="w-full md:w-48">
          <select
            v-model="filterDurum"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          >
            <option value="">Tüm Durumlar</option>
            <option value="DEVAM_EDIYOR">Devam Ediyor</option>
            <option value="TAMAMLANDI">Tamamlandı</option>
            <option value="IPTAL">İptal</option>
          </select>
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

    <!-- Takip Listesi -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="takip in filteredTakipler" :key="takip.id" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <Icon name="mdi:account" class="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-800">{{ takip.hasta.ad }} {{ takip.hasta.soyad }}</h2>
              <p class="text-sm text-gray-500">TC: {{ takip.hasta.tc }}</p>
            </div>
          </div>
          
          <div class="space-y-3">
            <div class="flex items-center text-gray-600">
              <Icon name="mdi:doctor" class="w-5 h-5 mr-2" />
              <span>{{ takip.doktor.ad }} {{ takip.doktor.soyad }} ({{ takip.doktor.brans }})</span>
            </div>
            
            <div class="flex items-center text-gray-600">
              <Icon name="mdi:calendar" class="w-5 h-5 mr-2" />
              <span>{{ formatDate(takip.tarih) }}</span>
            </div>
            
            <div class="flex items-center">
              <span 
                :class="{
                  'bg-yellow-100 text-yellow-800': takip.durum === 'DEVAM_EDIYOR',
                  'bg-green-100 text-green-800': takip.durum === 'TAMAMLANDI',
                  'bg-red-100 text-red-800': takip.durum === 'IPTAL'
                }"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ getDurumText(takip.durum) }}
              </span>
            </div>
            
            <div v-if="takip.sikayet" class="text-sm text-gray-600">
              <p class="font-medium">Şikayet:</p>
              <p class="mt-1">{{ takip.sikayet }}</p>
            </div>
            
            <div v-if="takip.tani" class="text-sm text-gray-600">
              <p class="font-medium">Tanı:</p>
              <p class="mt-1">{{ takip.tani }}</p>
            </div>
            
            <div v-if="takip.tedavi" class="text-sm text-gray-600">
              <p class="font-medium">Tedavi:</p>
              <p class="mt-1">{{ takip.tedavi }}</p>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end space-x-3">
            <NuxtLink
              :to="`/takipler/${takip.id}`"
              class="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50"
              title="Görüntüle"
            >
              <Icon name="mdi:eye" class="w-5 h-5" />
            </NuxtLink>
            <NuxtLink
              :to="`/takipler/${takip.id}/duzenle`"
              class="text-yellow-600 hover:text-yellow-800 p-2 rounded-full hover:bg-yellow-50"
              title="Düzenle"
            >
              <Icon name="mdi:pencil" class="w-5 h-5" />
            </NuxtLink>
            <button
              @click="confirmDelete(takip)"
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
          <h3 class="text-lg font-medium text-gray-900">Takip Sil</h3>
        </div>
        
        <p class="text-sm text-gray-500 mb-6">
          <span class="font-medium">{{ selectedTakip?.hasta.ad }} {{ selectedTakip?.hasta.soyad }}</span> isimli hastanın takibini silmek istediğinize emin misiniz?
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

interface Takip {
  id: number
  hastaId: number
  doktorId: number
  tarih: string
  sikayet: string | null
  tani: string | null
  tedavi: string | null
  durum: string
  notlar: string | null
  hasta: {
    id: number
    ad: string
    soyad: string
    tc: string
  }
  doktor: {
    id: number
    ad: string
    soyad: string
    brans: string
  }
}

const router = useRouter()
const loading = ref(true)
const error = ref<string | null>(null)
const takipler = ref<Takip[]>([])
const searchQuery = ref('')
const filterDurum = ref('')
const showDeleteModal = ref(false)
const selectedTakip = ref<Takip | null>(null)
const deleting = ref(false)

// Filtrelenmiş takip listesi
const filteredTakipler = computed(() => {
  let filtered = takipler.value
  
  // Arama filtresi
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(takip => 
      takip.hasta.ad.toLowerCase().includes(query) ||
      takip.hasta.soyad.toLowerCase().includes(query) ||
      takip.hasta.tc.includes(query) ||
      takip.doktor.ad.toLowerCase().includes(query) ||
      takip.doktor.soyad.toLowerCase().includes(query) ||
      (takip.sikayet && takip.sikayet.toLowerCase().includes(query)) ||
      (takip.tani && takip.tani.toLowerCase().includes(query))
    )
  }
  
  // Durum filtresi
  if (filterDurum.value) {
    filtered = filtered.filter(takip => takip.durum === filterDurum.value)
  }
  
  return filtered
})

// Tarih formatla
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Durum metni
const getDurumText = (durum: string) => {
  switch (durum) {
    case 'DEVAM_EDIYOR':
      return 'Devam Ediyor'
    case 'TAMAMLANDI':
      return 'Tamamlandı'
    case 'IPTAL':
      return 'İptal'
    default:
      return durum
  }
}

// Takipleri getir
const fetchTakipler = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await fetch('/api/takipler')
    
    if (!response.ok) {
      throw new Error('Takipler alınırken bir hata oluştu')
    }
    
    const data = await response.json()
    takipler.value = data
  } catch (err: any) {
    console.error('Takipler alınırken hata oluştu:', err)
    error.value = 'Takipler alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
  } finally {
    loading.value = false
  }
}

// Silme onayı
const confirmDelete = (takip: Takip) => {
  selectedTakip.value = takip
  showDeleteModal.value = true
}

// Takip sil
const handleDelete = async () => {
  if (!selectedTakip.value) return
  
  deleting.value = true
  
  try {
    const response = await fetch(`/api/takipler/${selectedTakip.value.id}`, {
      method: 'DELETE'
    })
    
    if (!response.ok) {
      throw new Error('Takip silinirken bir hata oluştu')
    }
    
    // Takip listesini güncelle
    takipler.value = takipler.value.filter(t => t.id !== selectedTakip.value?.id)
    showDeleteModal.value = false
    selectedTakip.value = null
  } catch (err: any) {
    console.error('Takip silinirken hata oluştu:', err)
    error.value = 'Takip silinirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
  } finally {
    deleting.value = false
  }
}

// Sayfa yüklendiğinde takiplerini getir
onMounted(() => {
  fetchTakipler()
})
</script> 