<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Başlık -->
    <div class="flex items-center mb-8">
      <NuxtLink to="/takipler" class="text-gray-600 hover:text-gray-800 mr-4">
        <Icon name="mdi:arrow-left" class="w-6 h-6" />
      </NuxtLink>
      <h1 class="text-3xl font-bold text-gray-800">Yeni Takip</h1>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
      <!-- Hasta Seçimi -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Hasta</label>
        <select
          v-model="form.hastaId"
          required
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Hasta Seçin</option>
          <option v-for="hasta in hastalar" :key="hasta.id" :value="hasta.id">
            {{ hasta.ad }} {{ hasta.soyad }} (TC: {{ hasta.tc }})
          </option>
        </select>
      </div>

      <!-- Doktor Seçimi -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Doktor</label>
        <select
          v-model="form.doktorId"
          required
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Doktor Seçin</option>
          <option v-for="doktor in doktorlar" :key="doktor.id" :value="doktor.id">
            {{ doktor.ad }} {{ doktor.soyad }} ({{ doktor.brans }})
          </option>
        </select>
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
      <div v-if="error" class="mb-6">
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
          <div class="flex items-center">
            <Icon name="mdi:alert-circle" class="w-5 h-5 mr-2" />
            <span>{{ error }}</span>
          </div>
        </div>
      </div>

      <!-- Butonlar -->
      <div class="flex justify-end space-x-4">
        <NuxtLink
          to="/takipler"
          class="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200"
        >
          İptal
        </NuxtLink>
        <button
          type="submit"
          class="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center"
          :disabled="loading"
        >
          <Icon v-if="loading" name="mdi:loading" class="animate-spin mr-2 w-5 h-5" />
          <span>{{ loading ? 'Kaydediliyor...' : 'Kaydet' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

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

const router = useRouter()
const loading = ref(false)
const error = ref<string | null>(null)
const hastalar = ref<Hasta[]>([])
const doktorlar = ref<Doktor[]>([])

const form = ref({
  hastaId: '',
  doktorId: '',
  tarih: '',
  sikayet: '',
  tani: '',
  tedavi: '',
  durum: 'DEVAM_EDIYOR',
  notlar: ''
})

// Hastaları getir
const fetchHastalar = async () => {
  try {
    const { data, error: fetchError } = await useFetch<Hasta[]>('/api/hastalar')
    
    if (fetchError.value) {
      throw new Error(fetchError.value.message)
    }
    
    if (data.value) {
      hastalar.value = data.value
    }
  } catch (err: any) {
    console.error('Hastalar yüklenirken hata oluştu:', err)
    error.value = 'Hastalar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
  }
}

// Doktorları getir
const fetchDoktorlar = async () => {
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
  }
}

// Form gönderimi
const handleSubmit = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await fetch('/api/takipler/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form.value)
    })
    
    if (!response.ok) {
      throw new Error('Takip oluşturulurken bir hata oluştu')
    }
    
    router.push('/takipler')
  } catch (err: any) {
    console.error('Takip oluşturulurken hata oluştu:', err)
    error.value = 'Takip oluşturulurken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
  } finally {
    loading.value = false
  }
}

// Sayfa yüklendiğinde hastaları ve doktorları getir
onMounted(() => {
  fetchHastalar()
  fetchDoktorlar()
})
</script> 