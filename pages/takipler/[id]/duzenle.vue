<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Başlık -->
    <div class="flex items-center mb-8">
      <NuxtLink :to="`/takipler/${route.params.id}`" class="text-gray-600 hover:text-gray-800 mr-4">
        <Icon name="mdi:arrow-left" class="w-6 h-6" />
      </NuxtLink>
      <h1 class="text-3xl font-bold text-gray-800">Takip Düzenle</h1>
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

    <!-- Form -->
    <form v-else-if="takip" @submit.prevent="handleSubmit" class="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
      <!-- Hasta Bilgileri -->
      <div class="mb-6">
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
        </div>
      </div>

      <!-- Doktor Bilgileri -->
      <div class="mb-6">
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
        </div>
      </div>

      <!-- Tarih -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Tarih</label>
        <input
          type="datetime-local"
          v-model="form.tarih"
          required
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Şikayet -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Şikayet</label>
        <textarea
          v-model="form.sikayet"
          rows="3"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Hastanın şikayetlerini girin"
        ></textarea>
      </div>

      <!-- Tanı -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Tanı</label>
        <textarea
          v-model="form.tani"
          rows="3"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Tanı bilgisini girin"
        ></textarea>
      </div>

      <!-- Tedavi -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Tedavi</label>
        <textarea
          v-model="form.tedavi"
          rows="3"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Tedavi planını girin"
        ></textarea>
      </div>

      <!-- Durum -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Durum</label>
        <select
          v-model="form.durum"
          required
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="DEVAM_EDIYOR">Devam Ediyor</option>
          <option value="TAMAMLANDI">Tamamlandı</option>
          <option value="IPTAL">İptal</option>
        </select>
      </div>

      <!-- Notlar -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Notlar</label>
        <textarea
          v-model="form.notlar"
          rows="3"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ek notları girin"
        ></textarea>
      </div>

      <!-- Hata Mesajı -->
      <div v-if="submitError" class="mb-6">
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
          <div class="flex items-center">
            <Icon name="mdi:alert-circle" class="w-5 h-5 mr-2" />
            <span>{{ submitError }}</span>
          </div>
        </div>
      </div>

      <!-- Butonlar -->
      <div class="flex justify-end space-x-4">
        <NuxtLink
          :to="`/takipler/${route.params.id}`"
          class="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200"
        >
          İptal
        </NuxtLink>
        <button
          type="submit"
          class="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center"
          :disabled="submitting"
        >
          <Icon v-if="submitting" name="mdi:loading" class="animate-spin mr-2 w-5 h-5" />
          <span>{{ submitting ? 'Kaydediliyor...' : 'Kaydet' }}</span>
        </button>
      </div>
    </form>
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
}

interface Doktor {
  id: number
  ad: string
  soyad: string
  brans: string
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
}

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const error = ref<string | null>(null)
const takip = ref<Takip | null>(null)
const submitting = ref(false)
const submitError = ref<string | null>(null)

const form = ref({
  tarih: '',
  sikayet: '',
  tani: '',
  tedavi: '',
  durum: 'DEVAM_EDIYOR',
  notlar: ''
})

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
    
    // Form verilerini doldur
    form.value = {
      tarih: data.tarih,
      sikayet: data.sikayet || '',
      tani: data.tani || '',
      tedavi: data.tedavi || '',
      durum: data.durum,
      notlar: data.notlar || ''
    }
  } catch (err: any) {
    console.error('Takip detayları alınırken hata oluştu:', err)
    error.value = 'Takip detayları alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
  } finally {
    loading.value = false
  }
}

// Form gönderimi
const handleSubmit = async () => {
  submitting.value = true
  submitError.value = null
  
  try {
    const response = await fetch(`/api/takipler/${route.params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form.value)
    })
    
    if (!response.ok) {
      throw new Error('Takip güncellenirken bir hata oluştu')
    }
    
    router.push(`/takipler/${route.params.id}`)
  } catch (err: any) {
    console.error('Takip güncellenirken hata oluştu:', err)
    submitError.value = 'Takip güncellenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
  } finally {
    submitting.value = false
  }
}

// Sayfa yüklendiğinde takip detaylarını getir
onMounted(() => {
  fetchTakip()
})
</script> 