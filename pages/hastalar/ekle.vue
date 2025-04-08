<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-md">
      <div class="p-6 border-b">
        <div class="flex justify-between items-center">
          <h1 class="text-xl font-bold">Yeni Hasta Ekle</h1>
          <NuxtLink
            to="/hastalar"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            Geri Dön
          </NuxtLink>
        </div>
      </div>

      <form @submit.prevent="onSubmit" class="p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Ad -->
          <div>
            <label for="ad" class="block text-sm font-medium text-gray-700">Adı</label>
            <input
              id="ad"
              v-model="form.ad"
              type="text"
              placeholder="Hastanın adını girin"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <!-- Soyad -->
          <div>
            <label for="soyad" class="block text-sm font-medium text-gray-700">Soyadı</label>
            <input
              id="soyad"
              v-model="form.soyad"
              type="text"
              placeholder="Hastanın soyadını girin"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <!-- TC Kimlik No -->
          <div>
            <label for="tc" class="block text-sm font-medium text-gray-700">TC Kimlik No</label>
            <input
              id="tc"
              v-model="form.tc"
              type="text"
              placeholder="TC Kimlik Numarası"
              maxlength="11"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <!-- Telefon -->
          <div>
            <label for="telefon" class="block text-sm font-medium text-gray-700">Telefon</label>
            <input
              id="telefon"
              v-model="form.telefon"
              type="text"
              placeholder="Telefon Numarası"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <!-- Doğum Tarihi -->
          <div>
            <label for="dogumTarihi" class="block text-sm font-medium text-gray-700">Doğum Tarihi</label>
            <input
              id="dogumTarihi"
              v-model="form.dogumTarihi"
              type="date"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <!-- Cinsiyet -->
          <div>
            <label for="cinsiyet" class="block text-sm font-medium text-gray-700">Cinsiyet</label>
            <select
              id="cinsiyet"
              v-model="form.cinsiyet"
              required
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Cinsiyet seçin</option>
              <option value="Erkek">Erkek</option>
              <option value="Kadın">Kadın</option>
            </select>
          </div>
        </div>

        <!-- Adres -->
        <div>
          <label for="adres" class="block text-sm font-medium text-gray-700">Adres</label>
          <textarea
            id="adres"
            v-model="form.adres"
            rows="2"
            placeholder="Hastanın adresini girin"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>

        <!-- Notlar -->
        <div>
          <label for="notlar" class="block text-sm font-medium text-gray-700">Notlar</label>
          <textarea
            id="notlar"
            v-model="form.notlar"
            rows="1"
            placeholder="Hasta hakkında notlar"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>

        <!-- Butonlar -->
        <div class="flex justify-end space-x-3">
          <NuxtLink
            to="/hastalar"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            İptal
          </NuxtLink>
          <button
            type="submit"
            :disabled="submitting"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="submitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Kaydet
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { z } from 'zod'

definePageMeta({
  title: 'Yeni Hasta Ekle'
})

const router = useRouter()
const submitting = ref(false)

const form = reactive({
  ad: '',
  soyad: '',
  tc: '',
  telefon: '',
  dogumTarihi: '',
  cinsiyet: '',
  adres: '',
  notlar: ''
})

const formSchema = z.object({
  ad: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
  soyad: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
  tc: z.string()
    .length(11, 'TC Kimlik numarası 11 haneli olmalıdır')
    .regex(/^[0-9]+$/, 'TC Kimlik numarası sadece rakamlardan oluşmalıdır'),
  telefon: z.string().regex(/^05[0-9]{9}$/, 'Geçerli bir telefon numarası girin'),
  dogumTarihi: z.string().min(1, 'Doğum tarihi zorunludur'),
  cinsiyet: z.string().min(1, 'Cinsiyet seçimi zorunludur'),
  adres: z.string().optional(),
  notlar: z.string().optional()
})

// Toast bildirimleri için global obje
const toast = {
  success: (message) => {
    // Toast bildirimi ekleme işlemi (ilerleyen aşamalarda eklenecek)
    alert(message)
  },
  error: (message) => {
    // Toast bildirimi ekleme işlemi (ilerleyen aşamalarda eklenecek)
    alert(message)
  }
}

const onSubmit = async () => {
  submitting.value = true
  
  try {
    // API'ye hasta verilerini gönder
    const response = await $fetch('/api/hastalar/create', {
      method: 'POST',
      body: form
    })
    
    // Başarılı kayıt sonrası hasta listesine yönlendirme
    toast.success('Hasta başarıyla kaydedildi')
    
    // Kullanıcıyı hasta detay sayfasına yönlendir
    router.push(`/hastalar/${response.hasta.id}`)
  } catch (error) {
    console.error('Hasta kaydı sırasında hata oluştu:', error)
    
    // Hata mesajını göster
    const errorMessage = error.data?.statusMessage || 'Hasta kaydı sırasında bir hata oluştu'
    toast.error(errorMessage)
  } finally {
    submitting.value = false
  }
}
</script> 