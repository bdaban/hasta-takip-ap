<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Yeni Tetkik</h1>
      <NuxtLink to="/tetkik" class="text-blue-600 hover:text-blue-800">
        <span class="flex items-center">
          <i class="fas fa-arrow-left mr-2"></i>
          Tetkiklere Dön
        </span>
      </NuxtLink>
    </div>

    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <form @submit.prevent="handleSubmit" class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Hasta Seçimi -->
          <div>
            <label for="hastaId" class="block text-sm font-medium text-gray-700 mb-1">
              Hasta <span class="text-red-500">*</span>
            </label>
            <select
              id="hastaId"
              v-model="form.hastaId"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Hasta Seçin</option>
              <option v-for="hasta in hastalar" :key="hasta.id" :value="hasta.id">
                {{ hasta.ad }} {{ hasta.soyad }} ({{ hasta.tc }})
              </option>
            </select>
          </div>

          <!-- Doktor Seçimi -->
          <div>
            <label for="doktorId" class="block text-sm font-medium text-gray-700 mb-1">
              Doktor <span class="text-red-500">*</span>
            </label>
            <select
              id="doktorId"
              v-model="form.doktorId"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Doktor Seçin</option>
              <option v-for="doktor in doktorlar" :key="doktor.id" :value="doktor.id">
                {{ doktor.ad }} {{ doktor.soyad }} ({{ doktor.brans }})
              </option>
            </select>
          </div>

          <!-- Tetkik Tipi -->
          <div>
            <label for="tip" class="block text-sm font-medium text-gray-700 mb-1">
              Tetkik Tipi <span class="text-red-500">*</span>
            </label>
            <select
              id="tip"
              v-model="form.tip"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Tip Seçin</option>
              <option value="KAN">Kan</option>
              <option value="IDRAR">İdrar</option>
              <option value="RONTGEN">Röntgen</option>
              <option value="ULTRASON">Ultrason</option>
              <option value="TOMOGRAFI">Tomografi</option>
              <option value="MRI">MRI</option>
              <option value="EKG">EKG</option>
              <option value="DIGER">Diğer</option>
            </select>
          </div>

          <!-- Tarih -->
          <div>
            <label for="tarih" class="block text-sm font-medium text-gray-700 mb-1">
              Tarih <span class="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="tarih"
              v-model="form.tarih"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <!-- Sonuç -->
          <div class="md:col-span-2">
            <label for="sonuc" class="block text-sm font-medium text-gray-700 mb-1">
              Sonuç
            </label>
            <textarea
              id="sonuc"
              v-model="form.sonuc"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tetkik sonucunu girin..."
            ></textarea>
          </div>
        </div>

        <!-- Hata Mesajı -->
        <div v-if="error" class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong class="font-bold">Hata!</strong>
          <span class="block sm:inline">{{ error }}</span>
        </div>

        <!-- Kaydet Butonu -->
        <div class="mt-6 flex justify-end">
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            :disabled="loading"
          >
            <span v-if="loading" class="flex items-center">
              <i class="fas fa-spinner fa-spin mr-2"></i>
              Kaydediliyor...
            </span>
            <span v-else>Kaydet</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
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

interface FormData {
  hastaId: string
  doktorId: string
  tip: string
  tarih: string
  sonuc: string
}

const router = useRouter()
const loading = ref(false)
const error = ref<string | null>(null)
const hastalar = ref<Hasta[]>([])
const doktorlar = ref<Doktor[]>([])
const form = ref<FormData>({
  hastaId: '',
  doktorId: '',
  tip: '',
  tarih: '',
  sonuc: ''
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
  }
}

// Form gönderimi
const handleSubmit = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await fetch('/api/tetkikler/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        hastaId: parseInt(form.value.hastaId),
        doktorId: parseInt(form.value.doktorId),
        tip: form.value.tip,
        tarih: form.value.tarih,
        sonuc: form.value.sonuc || null
      })
    })
    
    if (!response.ok) {
      throw new Error('Tetkik kaydedilirken bir hata oluştu')
    }
    
    // Tetkikler sayfasına yönlendir
    router.push('/tetkik')
  } catch (err: any) {
    console.error('Tetkik kaydedilirken hata oluştu:', err)
    error.value = 'Tetkik kaydedilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
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