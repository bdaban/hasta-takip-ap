<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-md mb-6">
      <div class="p-6 border-b">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold">Hasta Takip Sistemi</h2>
        </div>
      </div>

      <div class="p-6 space-y-4">
        <p class="text-gray-600">
          Hasta Takip Sistemi'ne hoş geldiniz. Bu sistem ile hastalarınızı yönetebilir, randevuları takip edebilir ve hasta geçmişini görüntüleyebilirsiniz.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div class="bg-blue-50 rounded-lg border border-blue-200 p-4">
            <div class="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <h3 class="text-lg font-semibold">Hasta Yönetimi</h3>
            </div>
            <p class="text-sm mb-4">Hastaları görüntüleyin, ekleyin ve düzenleyin.</p>
            <NuxtLink
              to="/hastalar"
              class="block w-full text-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Hastalara Git
            </NuxtLink>
          </div>

          <div class="bg-green-50 rounded-lg border border-green-200 p-4">
            <div class="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
              </svg>
              <h3 class="text-lg font-semibold">Randevu Takibi</h3>
            </div>
            <p class="text-sm mb-4">Randevuları görüntüleyin, ekleyin ve yönetin.</p>
            <NuxtLink
              to="/randevular"
              class="block w-full text-center px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Randevulara Git
            </NuxtLink>
          </div>

          <div class="bg-cyan-50 rounded-lg border border-cyan-200 p-4">
            <div class="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-cyan-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
              </svg>
              <h3 class="text-lg font-semibold">Hasta Takibi</h3>
            </div>
            <p class="text-sm mb-4">Hasta takip kayıtlarını görüntüleyin ve yönetin.</p>
            <NuxtLink
              to="/takipler"
              class="block w-full text-center px-4 py-2 text-sm font-medium text-cyan-700 bg-cyan-100 rounded-md hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              Hasta Takiplerine Git
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <div class="relative my-8">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-300"></div>
      </div>
      <div class="relative flex justify-center">
        <span class="px-2 bg-white text-sm text-gray-500">Son İşlemler</span>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md">
      <div class="p-6 border-b">
        <h3 class="text-lg font-medium">Bugünkü Randevular</h3>
      </div>
      
      <div v-if="loading" class="p-6 flex justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
      
      <div v-else-if="error" class="p-6">
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span>{{ error }}</span>
          </div>
        </div>
      </div>
      
      <div v-else-if="bugunRandevular.length === 0" class="p-6">
        <p class="text-gray-500 italic text-center">
          Bugün için planlanmış randevu bulunmamaktadır.
        </p>
      </div>
      
      <div v-else class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="randevu in bugunRandevular" :key="randevu.id" class="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div class="flex justify-between items-start mb-2">
              <div>
                <h4 class="font-medium">{{ randevu.hasta.ad }} {{ randevu.hasta.soyad }}</h4>
                <p class="text-sm text-gray-500">TC: {{ randevu.hasta.tc }}</p>
              </div>
              <span 
                :class="{
                  'bg-blue-100 text-blue-800': randevu.durum === 'BEKLIYOR',
                  'bg-green-100 text-green-800': randevu.durum === 'TAMAMLANDI',
                  'bg-red-100 text-red-800': randevu.durum === 'IPTAL'
                }"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ getDurumText(randevu.durum) }}
              </span>
            </div>
            
            <div class="flex items-center text-sm text-gray-600 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
              <span>{{ formatSaat(randevu.saat) }}</span>
            </div>
            
            <div class="flex items-center text-sm text-gray-600 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span>{{ randevu.doktor.ad }} {{ randevu.doktor.soyad }} ({{ randevu.doktor.brans }})</span>
            </div>
            
            <div class="flex items-center text-sm text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
              <span>{{ randevu.hasta.cinsiyet === 'ERKEK' ? 'Erkek' : 'Kadın' }}</span>
            </div>
          </div>
        </div>
        
        <div class="mt-6 flex justify-between items-center">
          <div class="flex space-x-2">
            <div class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Toplam: {{ bugunRandevular.length }}
            </div>
            <div class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Erkek: {{ erkekSayisi }}
            </div>
            <div class="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
              Kadın: {{ kadinSayisi }}
            </div>
          </div>
          
          <NuxtLink
            to="/randevular"
            class="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          >
            Tümünü Gör
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  title: 'Ana Sayfa'
})

const loading = ref(true)
const error = ref(null)
const bugunRandevular = ref([])

// Bugünkü randevuları getir
const fetchBugunRandevular = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Bugünün tarihini al (sadece tarih kısmı)
    const today = new Date()
    const formattedDate = today.toISOString().split('T')[0]
    
    // Randevuları getir
    const response = await fetch(`/api/randevular?tarih=${formattedDate}`)
    
    if (!response.ok) {
      throw new Error('Randevular alınırken bir hata oluştu')
    }
    
    const data = await response.json()
    bugunRandevular.value = data
  } catch (err) {
    console.error('Randevular alınırken hata oluştu:', err)
    error.value = 'Randevular alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
  } finally {
    loading.value = false
  }
}

// Erkek hasta sayısı
const erkekSayisi = computed(() => {
  return bugunRandevular.value.filter(randevu => randevu.hasta.cinsiyet === 'ERKEK').length
})

// Kadın hasta sayısı
const kadinSayisi = computed(() => {
  return bugunRandevular.value.filter(randevu => randevu.hasta.cinsiyet === 'KADIN').length
})

// Durum metnini getir
const getDurumText = (durum) => {
  switch (durum) {
    case 'BEKLIYOR':
      return 'Bekliyor'
    case 'TAMAMLANDI':
      return 'Tamamlandı'
    case 'IPTAL':
      return 'İptal'
    default:
      return durum
  }
}

// Saat formatla
const formatSaat = (saat) => {
  if (!saat) return ''
  return saat.substring(0, 5) // HH:MM formatına dönüştür
}

// Sayfa yüklendiğinde bugünkü randevuları getir
onMounted(() => {
  fetchBugunRandevular()
})
</script> 