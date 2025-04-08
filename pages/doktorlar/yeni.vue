<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-3xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Yeni Doktor Ekle</h1>
        <NuxtLink to="/doktorlar" class="text-gray-600 hover:text-gray-900 transition duration-200 flex items-center">
          <Icon name="mdi:arrow-left" class="w-5 h-5 mr-1" />
          <span>Geri Dön</span>
        </NuxtLink>
      </div>

      <form @submit.prevent="handleSubmit" class="bg-white shadow-lg rounded-lg overflow-hidden">
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Ad -->
            <div>
              <label for="ad" class="block text-sm font-medium text-gray-700 mb-1">Ad</label>
              <input
                id="ad"
                v-model="form.ad"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Doktorun adı"
              />
            </div>

            <!-- Soyad -->
            <div>
              <label for="soyad" class="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
              <input
                id="soyad"
                v-model="form.soyad"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Doktorun soyadı"
              />
            </div>

            <!-- TC Kimlik No -->
            <div>
              <label for="tc" class="block text-sm font-medium text-gray-700 mb-1">TC Kimlik No</label>
              <input
                id="tc"
                v-model="form.tc"
                type="text"
                required
                pattern="[0-9]{11}"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="11 haneli TC kimlik numarası"
              />
              <p class="mt-1 text-xs text-gray-500">11 haneli sayı olmalıdır</p>
            </div>

            <!-- Sicil No -->
            <div>
              <label for="sicilNo" class="block text-sm font-medium text-gray-700 mb-1">Sicil No</label>
              <input
                id="sicilNo"
                v-model="form.sicilNo"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Doktor sicil numarası"
              />
            </div>

            <!-- Branş -->
            <div>
              <label for="brans" class="block text-sm font-medium text-gray-700 mb-1">Branş</label>
              <input
                id="brans"
                v-model="form.brans"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Doktorun branşı"
              />
            </div>

            <!-- Uzmanlık -->
            <div>
              <label for="uzmanlik" class="block text-sm font-medium text-gray-700 mb-1">Uzmanlık</label>
              <input
                id="uzmanlik"
                v-model="form.uzmanlik"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Doktorun uzmanlık alanı"
              />
            </div>

            <!-- Telefon -->
            <div>
              <label for="telefon" class="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Icon name="mdi:phone" class="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="telefon"
                  v-model="form.telefon"
                  type="tel"
                  class="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="05XX XXX XX XX"
                />
              </div>
            </div>

            <!-- E-posta -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Icon name="mdi:email" class="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="ornek@email.com"
                />
              </div>
            </div>

            <!-- Doğum Tarihi -->
            <div>
              <label for="dogumTarihi" class="block text-sm font-medium text-gray-700 mb-1">Doğum Tarihi</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Icon name="mdi:calendar" class="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="dogumTarihi"
                  v-model="form.dogumTarihi"
                  type="date"
                  class="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>
            </div>

            <!-- Cinsiyet -->
            <div>
              <label for="cinsiyet" class="block text-sm font-medium text-gray-700 mb-1">Cinsiyet</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Icon name="mdi:account" class="w-5 h-5 text-gray-400" />
                </div>
                <select
                  id="cinsiyet"
                  v-model="form.cinsiyet"
                  class="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 appearance-none"
                >
                  <option value="">Seçiniz</option>
                  <option value="ERKEK">Erkek</option>
                  <option value="KADIN">Kadın</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Icon name="mdi:chevron-down" class="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Hata Mesajı -->
        <div v-if="error" class="px-6 py-4 bg-red-50 border-t border-red-100">
          <div class="flex items-center text-red-700">
            <Icon name="mdi:alert-circle" class="w-5 h-5 mr-2" />
            <span>{{ error }}</span>
          </div>
        </div>

        <!-- Butonlar -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <NuxtLink
            to="/doktorlar"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
          >
            İptal
          </NuxtLink>
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center"
            :disabled="loading"
          >
            <Icon v-if="loading" name="mdi:loading" class="animate-spin mr-2 w-4 h-4" />
            <span>{{ loading ? 'Kaydediliyor...' : 'Kaydet' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface DoktorForm {
  ad: string
  soyad: string
  tc: string
  sicilNo: string
  brans: string
  uzmanlik: string
  telefon: string
  email: string
  dogumTarihi: string
  cinsiyet: string
}

const router = useRouter()
const loading = ref(false)
const error = ref<string | null>(null)

const form = ref<DoktorForm>({
  ad: '',
  soyad: '',
  tc: '',
  sicilNo: '',
  brans: '',
  uzmanlik: '',
  telefon: '',
  email: '',
  dogumTarihi: '',
  cinsiyet: ''
})

const handleSubmit = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await fetch('/api/doktorlar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form.value)
    })

    if (!response.ok) {
      throw new Error('Doktor eklenirken bir hata oluştu')
    }

    router.push('/doktorlar')
  } catch (err: any) {
    console.error('Doktor eklenirken hata oluştu:', err)
    error.value = 'Doktor eklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
  } finally {
    loading.value = false
  }
}
</script> 