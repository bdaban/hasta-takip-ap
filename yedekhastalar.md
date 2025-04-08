<template>
  <div>
    <UContainer>
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h1 class="text-xl font-bold">Yeni Hasta Ekle</h1>
            <UButton to="/hastalar" color="gray" variant="soft" icon="i-heroicons-arrow-left">
              Geri Dön
            </UButton>
          </div>
        </template>

        <UForm :schema="formSchema" :state="form" class="space-y-4" @submit="onSubmit">
          <div class="grid md:grid-cols-2 gap-4">
            <UFormField label="Adı" name="ad">
              <UInput v-model="form.ad" placeholder="Hastanın adını girin" />
            </UFormField>

            <UFormField label="Soyadı" name="soyad">
              <UInput v-model="form.soyad" placeholder="Hastanın soyadını girin" />
            </UFormField>

            <UFormField label="TC Kimlik No" name="tc">
              <UInput v-model="form.tc" placeholder="TC Kimlik Numarası" maxlength="11" />
            </UFormField>

            <UFormField label="Telefon" name="telefon">
              <UInput v-model="form.telefon" placeholder="Telefon Numarası" />
            </UFormField>

            <UFormField label="Doğum Tarihi" name="dogumTarihi">
              <UInput type="date" v-model="form.dogumTarihi" />
            </UFormField>

            <UFormField label="Cinsiyet" name="cinsiyet">
              <USelect 
                v-model="form.cinsiyet" 
                :items="['Erkek','Kadın']" 
                placeholder="Cinsiyet seçin" 
              />
            </UFormField>
          </div>
          
          <UForm class="flex flex-col gap-6">
               <UFormField label="Adres" name="adres">
            <UTextarea v-model="form.adres" autoresize size="xl" placeholder="Hastanın adresini girin" rows="2" />
        </UFormField>
        <UFormField label="Notlar" name="adres">
          <UTextarea v-model="form.notlar" autoresize size="xl" placeholder="Hasta hakkında notlar" rows="1" />
        </UFormField>
          </UForm>

       


         

          <div class="flex justify-end space-x-2">
            <UButton to="/hastalar" icon="i-lucide-external-link" color="error">İptal</UButton>
            <UButton type="submit" icon="i-lucide-save" color="primary" :loading="submitting">Kaydet</UButton>
          </div>
        </UForm>
      </UCard>
    </UContainer>
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
  cinsiyet: null,
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

////
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

///düzenmle
<template>
  <div>
    <UContainer>
      <UCard v-if="hasta">
        <template #header>
          <div class="flex justify-between items-center">
            <h1 class="text-xl font-bold">Hasta Düzenle: {{ hasta.ad }} {{ hasta.soyad }}</h1>
            <UButton :to="`/hastalar/${$route.params.id}`" color="gray" variant="soft" icon="i-heroicons-arrow-left">
              Geri Dön
            </UButton>
          </div>
        </template>

        <UForm :schema="formSchema" :state="form" class="space-y-4" @submit="onSubmit">
          <div class="grid md:grid-cols-2 gap-4">
            <UFormGroup label="Adı" name="ad">
              <UInput v-model="form.ad" placeholder="Hastanın adını girin" />
            </UFormGroup>

            <UFormGroup label="Soyadı" name="soyad">
              <UInput v-model="form.soyad" placeholder="Hastanın soyadını girin" />
            </UFormGroup>

            <UFormGroup label="TC Kimlik No" name="tc">
              <UInput v-model="form.tc" placeholder="TC Kimlik Numarası" maxlength="11" />
            </UFormGroup>

            <UFormGroup label="Telefon" name="telefon">
              <UInput v-model="form.telefon" placeholder="Telefon Numarası" />
            </UFormGroup>

            <UFormGroup label="Doğum Tarihi" name="dogumTarihi">
              <UInput type="date" v-model="form.dogumTarihi" />
            </UFormGroup>

            <UFormGroup label="Cinsiyet" name="cinsiyet">
              <USelect 
                v-model="form.cinsiyet" 
                :options="[
                  { label: 'Erkek', value: 'Erkek' },
                  { label: 'Kadın', value: 'Kadın' }
                ]" 
                placeholder="Cinsiyet seçin" 
              />
            </UFormGroup>
          </div>

          <UFormGroup label="Adres" name="adres">
            <UTextarea v-model="form.adres" placeholder="Hastanın adresini girin" rows="3" />
          </UFormGroup>

          <UFormGroup label="Notlar" name="notlar">
            <UTextarea v-model="form.notlar" placeholder="Hasta hakkında notlar" rows="3" />
          </UFormGroup>

          <div class="flex justify-end space-x-2">
            <UButton :to="`/hastalar/${$route.params.id}`" color="gray">İptal</UButton>
            <UButton type="submit" color="primary" :loading="submitting">Güncelle</UButton>
          </div>
        </UForm>
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
        <p class="text-gray-500 dark:text-gray-400 mb-4">Düzenlemek istediğiniz hasta kayıtlarda mevcut değil.</p>
        <UButton to="/hastalar" color="primary">Hasta Listesine Dön</UButton>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
import { z } from 'zod'

const route = useRoute()
const router = useRouter()
const id = route.params.id

definePageMeta({
  title: 'Hasta Düzenle'
})

const hasta = ref(null)
const loading = ref(true)
const submitting = ref(false)
const error = ref(null)

// Form verilerini başlat (formun başlangıç değerleri)
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

// Hasta verilerini getir
async function fetchHastaDetay() {
  loading.value = true
  error.value = null
  
  try {
    const data = await $fetch(`/api/hastalar/${id}`)
    hasta.value = data
    
    // Form verilerini hasta nesnesi ile doldur
    const dogumTarihi = new Date(data.dogumTarihi)
    const formattedDate = dogumTarihi.toISOString().split('T')[0] // YYYY-MM-DD formatı
    
    Object.assign(form, {
      ad: data.ad,
      soyad: data.soyad,
      tc: data.tc,
      telefon: data.telefon || '',
      dogumTarihi: formattedDate,
      cinsiyet: data.cinsiyet,
      adres: data.adres || '',
      notlar: data.notlar || ''
    })
  } catch (err) {
    console.error('Hasta bilgileri alınamadı:', err)
    error.value = err.data?.statusMessage || 'Hasta bilgileri alınamadı'
  } finally {
    loading.value = false
  }
}

// Form gönderildiğinde
const onSubmit = async () => {
  submitting.value = true
  
  try {
    // API'ye güncellenecek hasta verilerini gönder
    const response = await $fetch(`/api/hastalar/${id}`, {
      method: 'PUT',
      body: form
    })
    
    // Başarılı güncelleme sonrası hasta detay sayfasına yönlendirme
    toast.success('Hasta bilgileri başarıyla güncellendi')
    router.push(`/hastalar/${id}`)
  } catch (error) {
    console.error('Hasta güncellenirken hata oluştu:', error)
    
    // Hata mesajını göster
    const errorMessage = error.data?.statusMessage || 'Hasta güncellenirken bir hata oluştu'
    toast.error(errorMessage)
  } finally {
    submitting.value = false
  }
}

// Sayfa yüklendiğinde hasta bilgilerini getir
onMounted(() => {
  fetchHastaDetay()
})
</script> 