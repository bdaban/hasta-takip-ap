<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Tetkik Düzenle</h1>
      <NuxtLink :to="`/tetkik/${tetkik.id}`" class="text-blue-600 hover:text-blue-800">
        <span class="flex items-center">
          <i class="fas fa-arrow-left mr-2"></i>
          Tetkik Detayına Dön
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

    <!-- Düzenleme Formu -->
    <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
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
        <div v-if="submitError" class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong class="font-bold">Hata!</strong>
          <span class="block sm:inline">{{ submitError }}</span>
        </div>

        <!-- Kaydet Butonu -->
        <div class="mt-6 flex justify-end">
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            :disabled="submitting"
          >
            <span v-if="submitting" class="flex items-center">
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

interface Tetkik {
  id: number
  hastaId: number
  doktorId: number
  tip: string
  tarih: string
  sonuc: string | null
}

interface FormData {
  hastaId: string
  doktorId: string
  tip: string
  tarih: string
  sonuc: string
}

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const error = ref<string | null>(null)
const submitting = ref(false)
const submitError = ref<string | null>(null)
const tetkik = ref<Tetkik>({} as Tetkik)
const hastalar = ref<Hasta[]>([])
const doktorlar = ref<Doktor[]>([])
const form = ref<FormData>({
  hastaId: '',
  doktorId: '',
  tip: '',
  tarih: '',
  sonuc: ''
})

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
    
    // Form verilerini doldur
    form.value = {
      hastaId: tetkik.value.hastaId.toString(),
      doktorId: tetkik.value.doktorId.toString(),
      tip: tetkik.value.tip,
      tarih: tetkik.value.tarih.split('T')[0], // ISO tarih formatından YYYY-MM-DD formatına dönüştür
      sonuc: tetkik.value.sonuc || ''
    }
  } catch (err: any) {
    console.error('Tetkik detayları yüklenirken hata oluştu:', err)
    error.value = 'Tetkik detayları yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
  } finally {
    loading.value = false
  }
}

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
  submitting.value = true
  submitError.value = null
  
  try {
    const response = await fetch(`/api/tetkikler/${tetkik.value.id}`, {
      method: 'PUT',
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
      throw new Error('Tetkik güncellenirken bir hata oluştu')
    }
    
    // Tetkik detay sayfasına yönlendir
    router.push(`/tetkik/${tetkik.value.id}`)
  } catch (err: any) {
    console.error('Tetkik güncellenirken hata oluştu:', err)
    submitError.value = 'Tetkik güncellenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
  } finally {
    submitting.value = false
  }
}

// Sayfa yüklendiğinde tetkik detaylarını, hastaları ve doktorları getir
onMounted(() => {
  fetchTetkik()
  fetchHastalar()
  fetchDoktorlar()
})
</script> 