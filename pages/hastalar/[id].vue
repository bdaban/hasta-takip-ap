<template>
  <div>
    <UContainer>
      <UCard v-if="hasta">
        <template #header>
          <div class="flex justify-between items-center">
            <h1 class="text-xl font-bold">Hasta Detayı: {{ hasta.ad }} {{ hasta.soyad }}</h1>
            <div class="flex space-x-2">
              <UButton :to="`/hastalar/${hasta.id}/duzenle`" color="warning" icon="i-heroicons-pencil-square">
                Düzenle
              </UButton>
              <UButton to="/hastalar" color="gray" variant="soft" icon="i-heroicons-arrow-left">
                Geri Dön
              </UButton>
            </div>
          </div>
        </template>

        <div class="grid md:grid-cols-2 gap-8">
          <div class="space-y-4">
            <div>
              <h2 class="text-lg font-medium border-b pb-2 mb-4">Kişisel Bilgiler</h2>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">TC Kimlik No</p>
                  <p>{{ hasta.tc }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Telefon</p>
                  <p>{{ hasta.telefon || 'Belirtilmemiş' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Doğum Tarihi</p>
                  <p>{{ formatDate(hasta.dogumTarihi) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Cinsiyet</p>
                  <p>{{ hasta.cinsiyet }}</p>
                </div>
                <div class="col-span-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">Adres</p>
                  <p>{{ hasta.adres || 'Belirtilmemiş' }}</p>
                </div>
                <div class="col-span-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">Notlar</p>
                  <p>{{ hasta.notlar || 'Belirtilmemiş' }}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 class="text-lg font-medium border-b pb-2 mb-4">Yaklaşan Randevular</h2>
              <div v-if="randevular.length">
                <ul class="space-y-2">
                  <li v-for="randevu in randevular" :key="randevu.id" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div class="flex justify-between">
                      <div>
                        <p class="text-sm font-medium">{{ formatDateTime(randevu.tarih) }}</p>
                        <p class="text-xs text-gray-500">Dr. {{ randevu.doktor?.name || 'Belirtilmemiş' }}</p>
                      </div>
                      <UBadge :color="randevu.durum === 'bekliyor' ? 'warning' : randevu.durum === 'tamamlandı' ? 'success' : 'danger'">
                        {{ randevu.durum }}
                      </UBadge>
                    </div>
                  </li>
                </ul>
              </div>
              <div v-else class="text-center py-4 text-gray-500 dark:text-gray-400 italic">
                <p>Yaklaşan randevu bulunmamaktadır.</p>
              </div>
              <div class="mt-4">
                <UButton :to="`/randevular/ekle?hastaId=${hasta.id}`" color="success" icon="i-heroicons-plus" size="sm">
                  Yeni Randevu Ekle
                </UButton>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <h2 class="text-lg font-medium border-b pb-2 mb-4">Hasta Takip Geçmişi</h2>
              <div v-if="takipler.length">
                <div v-for="takip in takipler" :key="takip.id" class="mb-4 p-4 border rounded-lg">
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <p class="font-medium">{{ formatDate(takip.tarih) }}</p>
                      <p class="text-sm text-gray-500">Dr. {{ takip.doktor?.name || 'Belirtilmemiş' }}</p>
                    </div>
                    <UButton :to="`/takipler/${takip.id}`" color="primary" variant="ghost" size="xs">
                      Detay
                    </UButton>
                  </div>
                  <div class="mt-2 space-y-2">
                    <div>
                      <p class="text-sm text-gray-500">Şikayet</p>
                      <p>{{ takip.sikayet || 'Belirtilmemiş' }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Tanı</p>
                      <p>{{ takip.tani || 'Belirtilmemiş' }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Tedavi</p>
                      <p>{{ takip.tedavi || 'Belirtilmemiş' }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-4 text-gray-500 dark:text-gray-400 italic">
                <p>Hasta takip kaydı bulunmamaktadır.</p>
              </div>
              <div class="mt-4">
                <UButton :to="`/takipler/ekle?hastaId=${hasta.id}`" color="primary" icon="i-heroicons-plus" size="sm">
                  Yeni Takip Ekle
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <UCard v-else-if="loading" class="py-12">
        <div class="flex flex-col items-center justify-center">
          <UIcon name="i-heroicons-arrow-path" class="h-8 w-8 animate-spin text-primary-500 mb-4" />
          <p class="text-lg font-medium">Hasta bilgileri yükleniyor...</p>
        </div>
      </UCard>

      <div v-else class="text-center py-8">
        <UIcon name="i-heroicons-exclamation-triangle" class="mx-auto h-12 w-12 text-warning-500 mb-4" />
        <h2 class="text-xl font-bold mb-2">Hasta Bulunamadı</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-4">Aradığınız hasta kayıtlarda mevcut değil.</p>
        <UButton to="/hastalar" color="primary">Hasta Listesine Dön</UButton>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
const route = useRoute()
const id = route.params.id

definePageMeta({
  title: 'Hasta Detayı'
})

const hasta = ref(null)
const loading = ref(true)
const error = ref(null)

// Tarih formatlama fonksiyonları
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('tr-TR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  }).format(date);
}

function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('tr-TR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Computed properties
const takipler = computed(() => {
  if (!hasta.value || !hasta.value.takipler) return [];
  return hasta.value.takipler;
});

const randevular = computed(() => {
  if (!hasta.value || !hasta.value.randevular) return [];
  return hasta.value.randevular.filter(r => r.durum !== 'iptal');
});

// API'den hasta detaylarını getir
async function fetchHastaDetay() {
  loading.value = true;
  error.value = null;
  
  try {
    const data = await $fetch(`/api/hastalar/${id}`);
    hasta.value = data;
  } catch (err) {
    console.error('Hasta bilgileri alınamadı:', err);
    error.value = err.data?.statusMessage || 'Hasta bilgileri alınamadı';
  } finally {
    loading.value = false;
  }
}

// Sayfa yüklendiğinde hasta bilgilerini getir
onMounted(() => {
  fetchHastaDetay();
});
</script> 