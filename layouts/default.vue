<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Üst Menü -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
              <NuxtLink to="/" class="text-xl font-bold text-blue-600">
                <Icon name="mdi:hospital-building" class="mr-2 w-5 h-5" />
                Hasta Takip
              </NuxtLink>
            </div>
            
            <!-- Ana Menü -->
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NuxtLink
                to="/"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-blue-500 text-gray-900"
              >
                <Icon name="mdi:home" class="mr-2 w-5 h-5" />
                Ana Sayfa
              </NuxtLink>
              
              <NuxtLink
                to="/hastalar"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-blue-500 text-gray-900"
              >
                <Icon name="mdi:account-heart" class="mr-2 w-5 h-5" />
                Hastalar
              </NuxtLink>
              
              <NuxtLink
                to="/doktorlar"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-blue-500 text-gray-900"
              >
                <Icon name="mdi:doctor" class="mr-2 w-5 h-5" />
                Doktorlar
              </NuxtLink>
              
              <NuxtLink
                to="/randevular"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-blue-500 text-gray-900"
              >
                <Icon name="mdi:calendar-check" class="mr-2 w-5 h-5" />
                Randevular
              </NuxtLink>
              
              <NuxtLink
                to="/tetkik"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-blue-500 text-gray-900"
              >
                <Icon name="mdi:microscope" class="mr-2 w-5 h-5" />
                Tetkikler
              </NuxtLink>
              
              <NuxtLink
                to="/takipler"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-blue-500 text-gray-900"
              >
                <Icon name="mdi:clipboard-list" class="mr-2 w-5 h-5" />
                Takipler
              </NuxtLink>
            </div>
          </div>
          
          <!-- Mobil Menü Butonu -->
          <div class="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              @click="mobileMenuOpen = !mobileMenuOpen"
            >
              <span class="sr-only">Menüyü aç</span>
              <Icon name="mdi:menu" class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      
      <!-- Mobil Menü -->
      <div class="sm:hidden" v-show="mobileMenuOpen">
        <div class="pt-2 pb-3 space-y-1">
          <NuxtLink
            to="/"
            class="bg-blue-50 border-blue-500 text-blue-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            active-class="bg-blue-50 border-blue-500 text-blue-700"
          >
            <Icon name="mdi:home" class="mr-2 w-5 h-5 inline" />
            Ana Sayfa
          </NuxtLink>
          
          <NuxtLink
            to="/hastalar"
            class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            active-class="bg-blue-50 border-blue-500 text-blue-700"
          >
            <Icon name="mdi:account-heart" class="mr-2 w-5 h-5 inline" />
            Hastalar
          </NuxtLink>
          
          <NuxtLink
            to="/doktorlar"
            class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            active-class="bg-blue-50 border-blue-500 text-blue-700"
          >
            <Icon name="mdi:doctor" class="mr-2 w-5 h-5 inline" />
            Doktorlar
          </NuxtLink>
          
          <NuxtLink
            to="/randevular"
            class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            active-class="bg-blue-50 border-blue-500 text-blue-700"
          >
            <Icon name="mdi:calendar-check" class="mr-2 w-5 h-5 inline" />
            Randevular
          </NuxtLink>
          
          <NuxtLink
            to="/tetkik"
            class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            active-class="bg-blue-50 border-blue-500 text-blue-700"
          >
            <Icon name="mdi:microscope" class="mr-2 w-5 h-5 inline" />
            Tetkikler
          </NuxtLink>
          
          <NuxtLink
            to="/takipler"
            class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            active-class="bg-blue-50 border-blue-500 text-blue-700"
          >
            <Icon name="mdi:clipboard-list" class="mr-2 w-5 h-5 inline" />
            Takipler
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Ana İçerik -->
    <main class="py-10">
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const mobileMenuOpen = ref(false)
</script> 