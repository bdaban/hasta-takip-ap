<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Başlık -->
    <div class="flex items-center mb-8">
      <NuxtLink to="/takipler" class="text-gray-600 hover:text-gray-800 mr-4">
        <Icon name="mdi:arrow-left" class="w-6 h-6" />
      </NuxtLink>
      <h1 class="text-3xl font-bold text-gray-800">Takip Detayı</h1>
    </div>

    <!-- Yükleniyor -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- Hata Mesajı -->
    <div v-else-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6" role="alert">
      <div class="flex items-center">
        <Icon name="mdi:alert-circle" class="w-5 h-5 mr-2" />
        <span>{{ error }}</span>
      </div>
    </div>

    <!-- Takip Detayları -->
    <div v-else-if="takip" class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- Hasta Bilgileri -->
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Hasta Bilgileri</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">Ad Soyad</p>
            <p class="font-medium">{{ takip.hasta.ad }} {{ takip.hasta.soyad }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">TC Kimlik No</p>
            <p class="font-medium">{{ takip.hasta.tc }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Telefon</p>
            <p class="font-medium">{{ takip.hasta.telefon }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Doğum Tarihi</p>
            <p class="font-medium">{{ formatDate(takip.hasta.dogumTarihi) }}</p>
          </div>
        </div>
      </div>

      <!-- Doktor Bilgileri -->
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Doktor Bilgileri</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">Ad Soyad</p>
            <p class="font-medium">{{ takip.doktor.ad }} {{ takip.doktor.soyad }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Branş</p>
            <p class="font-medium">{{ takip.doktor.brans }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Sicil No</p>
            <p class="font-medium">{{ takip.doktor.sicilNo }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Telefon</p>
            <p class="font-medium">{{ takip.doktor.telefon }}</p>
          </div>
        </div>
      </div>

      <!-- Takip Detayları -->
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Takip Detayları</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">Tarih</p>
            <p class="font-medium">{{ formatDate(takip.tarih) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Durum</p>
            <p class="font-medium">
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
            </p>
          </div>
        </div>
      </div>

      <!-- Şikayet -->
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Şikayet</h2>
        <p class="text-gray-700 whitespace-pre-line">{{ takip.sikayet || 'Şikayet bilgisi girilmemiş.' }}</p>
      </div>

      <!-- Tanı -->
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Tanı</h2>
        <p class="text-gray-700 whitespace-pre-line">{{ takip.tani || 'Tanı bilgisi girilmemiş.' }}</p>
      </div>

      <!-- Tedavi -->
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Tedavi</h2>
        <p class="text-gray-700 whitespace-pre-line">{{ takip.tedavi || 'Tedavi bilgisi girilmemiş.' }}</p>
      </div>

      <!-- Notlar -->
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Notlar</h2>
        <p class="text-gray-700 whitespace-pre-line">{{ takip.notlar || 'Not girilmemiş.' }}</p>
      </div>

      <!-- Tetkikler -->
      <div v-if="takip.tetkikler && takip.tetkikler.length > 0" class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Tetkikler</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tetkik Adı</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sonuç</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="tetkik in takip.tetkikler" :key="tetkik.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ tetkik.ad }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(tetkik.tarih) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ tetkik.sonuc || 'Sonuç girilmemiş' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <NuxtLink :to="`/tetkik/${tetkik.id}`" class="text-blue-600 hover:text-blue-800">
                    <Icon name="mdi:eye" class="w-5 h-5" />
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- İşlem Butonları -->
      <div class="p-6 flex justify-end space-x-4">
        <NuxtLink
          :to="`/takipler/${route.params.id}/duzenle`"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center"
        >
          <Icon name="mdi:pencil" class="w-5 h-5 mr-2" />
          Düzenle
        </NuxtLink>
        <button
          @click="confirmDelete"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 flex items-center"
        >
          <Icon name="mdi:delete" class="w-5 h-5 mr-2" />
          Sil
        </button>
      </div>
    </div>

    <!-- Silme Onay Modalı -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Takibi Sil</h3>
        <p class="text-gray-500 mb-6">Bu takibi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
        <div class="flex justify-end space-x-4">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
          >
            İptal
          </button>
          <button
            @click="deleteTakip"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 flex items-center"
            :disabled="deleteLoading"
          >
            <Icon v-if="deleteLoading" name="mdi:loading" class="animate-spin mr-2 w-5 h-5" />
            <span>{{ deleteLoading ? 'Siliniyor...' : 'Sil' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface Hasta {
  id: number
  ad: string
  soyad: string
  tc: string
  telefon: string
  dogumTarihi: string
}

interface Doktor {
  id: number
  ad: string
  soyad: string
  brans: string
  sicilNo: string
  telefon: string
}

interface Tetkik {
  id: number
  ad: string
  tarih: string
  sonuc: string | null
}

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
  hasta: Hasta
  doktor: Doktor
  tetkikler: Tetkik[]
}

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const error = ref<string | null>(null)
const takip = ref<Takip | null>(null)
const showDeleteModal = ref(false)
const deleteLoading = ref(false)

// Takip detaylarını getir
const fetchTakip = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await fetch(`/api/takipler/${route.params.id}`)
    
    if (!response.ok) {
      throw new Error('Takip detayları alınırken bir hata oluştu')
    }
    
    const data = await response.json()
    takip.value = data
  } catch (err: any) {
    console.error('Takip detayları alınırken hata oluştu:', err)
    error.value = 'Takip detayları alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
  } finally {
    loading.value = false
  }
}

// Tarih formatla
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Durum metnini getir
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

// Silme onayı
const confirmDelete = () => {
  showDeleteModal.value = true
}

// Takibi sil
const deleteTakip = async () => {
  deleteLoading.value = true
  
  try {
    const response = await fetch(`/api/takipler/${route.params.id}`, {
      method: 'DELETE'
    })
    
    if (!response.ok) {
      throw new Error('Takip silinirken bir hata oluştu')
    }
    
    router.push('/takipler')
  } catch (err: any) {
    console.error('Takip silinirken hata oluştu:', err)
    error.value = 'Takip silinirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
    showDeleteModal.value = false
  } finally {
    deleteLoading.value = false
  }
}

// Sayfa yüklendiğinde takip detaylarını getir
onMounted(() => {
  fetchTakip()
})
</script> 