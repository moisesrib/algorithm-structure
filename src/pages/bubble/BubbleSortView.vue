<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { bubbleSort } from "@/services/sortAlgorithms";

interface Car {
  id: number;
  speed: number;
  position: number;
  color: string;
  x: number;
  _tempY?: number;
}

const NUM_CARS = 8;
const TRACK_HEIGHT = 480;
const LANE_HEIGHT = TRACK_HEIGHT / NUM_CARS;
const TRACK_WIDTH = 1100;
const CAR_WIDTH = 100;
const NUM_SPACES = NUM_CARS - 1;
const carSpacing = (TRACK_WIDTH - CAR_WIDTH) / NUM_SPACES;

const cars = ref<Car[]>([]);
const isSorting = ref(false);
const ranking = ref<Car[]>([]);
const comparing = ref<number[]>([]);
const currentPass = ref(0);
const currentStep = ref(0);
const swaps = ref(0);
const comparisons = ref(0);

const colors = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEEAD",
  "#D4A5A5",
  "#9B59B6",
  "#3498DB",
];

const generateCarSVG = (color: string, highlight = false, swap = false) => {
  return `
    <svg width="100" height="60" viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
      <g ${highlight ? 'filter="url(#glow)"' : ""}>
        <path d="M10 35 C10 25, 20 20, 30 20 L70 20 C80 20, 90 25, 90 35 L90 45 C90 50, 85 55, 80 55 L20 55 C15 55, 10 50, 10 45 Z" fill="${color}" stroke="#2C3E50" stroke-width="2"/>
        <path d="M25 20 L75 20 L70 30 L30 30 Z" fill="${color}" stroke="#2C3E50" stroke-width="2"/>
        <path d="M30 25 L70 25 L65 35 L35 35 Z" fill="#2C3E50" stroke="#34495E" stroke-width="1"/>
        <circle cx="25" cy="55" r="8" fill="#2C3E50"/>
        <circle cx="75" cy="55" r="8" fill="#2C3E50"/>
        <circle cx="25" cy="55" r="4" fill="#95A5A6"/>
        <circle cx="75" cy="55" r="4" fill="#95A5A6"/>
        <path d="M85 30 L90 30 L90 40 L85 40 Z" fill="#F1C40F" stroke="#D35400" stroke-width="1"/>
        <path d="M10 30 L15 30 L15 40 L10 40 Z" fill="#E74C3C" stroke="#C0392B" stroke-width="1"/>
        <line x1="30" y1="35" x2="70" y2="35" stroke="#34495E" stroke-width="1"/>
        <line x1="40" y1="40" x2="60" y2="40" stroke="#34495E" stroke-width="1"/>
      </g>
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="${
            swap ? "#FFD700" : "#00E1FF"
          }" flood-opacity="1"/>
        </filter>
      </defs>
    </svg>
  `;
};

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const generateRandomCars = () => {
  const uniqueSpeeds = new Set<number>();
  while (uniqueSpeeds.size < NUM_CARS) {
    const speed = Math.floor(Math.random() * 100) + 60;
    uniqueSpeeds.add(speed);
  }
  const speedsArray = Array.from(uniqueSpeeds);

  const arr = Array.from({ length: NUM_CARS }, (_, i) => ({
    id: i,
    speed: speedsArray[i],
    position: i,
    color: colors[i],
    x: 0,
  }));
  const shuffled = shuffleArray(arr);
  cars.value = shuffled;
  ranking.value = [];
  comparing.value = [];
  currentPass.value = 0;
  currentStep.value = 0;
  swaps.value = 0;
  comparisons.value = 0;
  cars.value.forEach((car: Car, idx: number) => {
    car.x = idx * carSpacing;
  });
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const animateSwapX = async (
  carA: Car,
  carB: Car,
  idxA: number,
  idxB: number
) => {
  const startXA = carA.x;
  const startXB = carB.x;
  const targetXA = idxB * carSpacing;
  const targetXB = idxA * carSpacing;
  const duration = 400;
  const startTime = performance.now();
  while (performance.now() - startTime < duration) {
    const progress = (performance.now() - startTime) / duration;
    carA.x = startXA + (targetXA - startXA) * progress;
    carB.x = startXB + (targetXB - startXB) * progress;
    await sleep(16);
  }
  carA.x = targetXA;
  carB.x = targetXB;
};

const animateToFinalOrder = async (finalOrder: number[]) => {
  let arr = cars.value.map((car) => car.speed);
  for (let i = 0; i < finalOrder.length; i++) {
    const targetSpeed = finalOrder[i];
    let currentIdx = arr.indexOf(targetSpeed);
    while (currentIdx > i) {
      await animateSwapX(
        cars.value[currentIdx],
        cars.value[currentIdx - 1],
        currentIdx,
        currentIdx - 1
      );
      [cars.value[currentIdx], cars.value[currentIdx - 1]] = [
        cars.value[currentIdx - 1],
        cars.value[currentIdx],
      ];
      [arr[currentIdx], arr[currentIdx - 1]] = [
        arr[currentIdx - 1],
        arr[currentIdx],
      ];
      currentIdx--;
      cars.value.forEach((car: Car, idx: number) => {
        car.x = idx * carSpacing;
      });
      await sleep(200);
    }
  }
};

const ordenarComBubbleSort = async () => {
  if (isSorting.value) return;
  isSorting.value = true;
  const speeds = cars.value.map((car) => car.speed);
  const sortedSpeeds = bubbleSort(speeds);
  await animateToFinalOrder(sortedSpeeds);
  isSorting.value = false;
};

onMounted(() => {
  generateRandomCars();
});
</script>

<template>
  <div class="container mx-auto p-6 max-w-6xl">
    <Card class="mb-6">
      <CardHeader>
        <CardTitle>Corrida Bubble Sort Visual</CardTitle>
        <CardDescription>
          Veja o algoritmo Bubble Sort funcionando passo a passo!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex gap-4">
          <Button @click="ordenarComBubbleSort" variant="default"
            >Ordenar (bubbleSort)</Button
          >
          <Button @click="generateRandomCars" variant="outline"
            >Gerar Novos Carros</Button
          >
        </div>
      </CardContent>
    </Card>

    <div class="flex gap-8">
      <Card class="flex-1">
        <CardContent class="p-0">
          <div
            class="relative"
            :style="{ height: TRACK_HEIGHT + 'px', width: TRACK_WIDTH + 'px' }"
          >
            <div
              v-for="i in NUM_CARS"
              :key="'lane-bg-' + i"
              :style="{
                height: LANE_HEIGHT + 'px',
                top: (i - 1) * LANE_HEIGHT + 'px',
              }"
              class="absolute left-0 w-full"
              :class="i % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'"
            />
            <div
              v-for="i in NUM_CARS"
              :key="'lane-line-' + i"
              :style="{ top: i * LANE_HEIGHT + 'px' }"
              class="absolute left-0 w-full h-[2px] bg-white/20"
            />
            <div
              v-for="(car, idx) in cars"
              :key="car.id"
              class="absolute transition-all duration-300 ease-in-out flex items-center"
              :style="{
                left: `${car.x}px`,
                top: `${
                  (NUM_CARS - 1 - idx) * LANE_HEIGHT + (LANE_HEIGHT - 60) / 2
                }px`,
                width: '100px',
                height: '60px',
                zIndex: 10,
                ...(comparing.includes(idx)
                  ? { 'ring-4 ring-yellow-400': '' }
                  : {}),
              }"
            >
              <div
                v-html="
                  generateCarSVG(
                    car.color,
                    comparing.includes(idx),
                    comparing.includes(idx) &&
                      cars[comparing[0]] &&
                      cars[comparing[1]] &&
                      cars[comparing[0]].speed > cars[comparing[1]].speed
                  )
                "
                class="w-full h-full"
              ></div>
              <div
                class="absolute -left-32 top-1/2 -translate-y-1/2 text-white font-bold bg-black/50 px-2 py-1 rounded text-xs whitespace-nowrap"
              >
                {{ car.speed }} km/h
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card class="mt-6">
      <CardHeader>
        <CardTitle>Como funciona</CardTitle>
      </CardHeader>
      <CardContent>
        <p class="text-gray-600">
          O Bubble Sort compara dois carros adjacentes por vez. Se o da frente
          for mais lento, eles trocam de posição. O processo se repete até todos
          estarem ordenados por velocidade!
        </p>
      </CardContent>
    </Card>
  </div>
</template>
