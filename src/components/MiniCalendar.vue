<script setup>
import { computed } from 'vue';

const props = defineProps({
  year: {
    type: [Number, String],
    required: true
  },
  month: {
    type: [Number, String],
    required: true
  },
  weekStartsOn: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0 && value <= 6
  },
  highlightedDay: {
    type: Number,
    default: null
  }
});

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
const MONTH_NAMES = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月'
];
const CALENDAR_CELL_COUNT = 42;

const normalizedYear = computed(() => Number.parseInt(props.year, 10));
const normalizedMonth = computed(() => Number.parseInt(props.month, 10));
const today = new Date();
const todayDate = {
  year: today.getFullYear(),
  month: today.getMonth() + 1,
  day: today.getDate()
};
const monthLabel = computed(() => {
  const month = normalizedMonth.value;

  if (!Number.isFinite(month) || month < 1 || month > 12) return '';

  return MONTH_NAMES[month - 1];
});

const orderedWeekdays = computed(() =>
  Array.from({ length: 7 }, (_, index) => WEEKDAYS[(props.weekStartsOn + index) % 7])
);

const calendarDays = computed(() => {
  const year = normalizedYear.value;
  const month = normalizedMonth.value;

  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
    return [];
  }

  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const leadingBlankCount = (firstDay - props.weekStartsOn + 7) % 7;
  const days = Array.from({ length: daysInMonth }, (_, index) => ({
    key: `day-${index + 1}`,
    day: index + 1,
    isCurrentMonth: true
  }));
  const leadingBlanks = Array.from({ length: leadingBlankCount }, (_, index) => ({
    key: `leading-${index}`,
    day: null,
    isCurrentMonth: false
  }));
  const visibleDays = [...leadingBlanks, ...days];
  const trailingBlankCount = Math.max(CALENDAR_CELL_COUNT - visibleDays.length, 0);
  const trailingBlanks = Array.from({ length: trailingBlankCount }, (_, index) => ({
    key: `trailing-${index}`,
    day: null,
    isCurrentMonth: false
  }));

  return [...visibleDays, ...trailingBlanks];
});

const isToday = (date) =>
  date.isCurrentMonth &&
  normalizedYear.value === todayDate.year &&
  normalizedMonth.value === todayDate.month &&
  date.day === todayDate.day;
</script>

<template>
  <div class="relative inline-flex w-28 flex-col text-center">
    <div
      class="pointer-events-none absolute inset-0 z-10 flex items-center justify-center text-2xl leading-none font-bold tracking-[0.2em] text-red opacity-40 vertical-rl"
    >
      {{ monthLabel }}
    </div>
    <div class="grid grid-cols-7 gap-x-0.5 gap-y-1 text-[0.62rem] leading-none">
      <span v-for="weekday in orderedWeekdays" :key="weekday" class="text-muted-foreground">
        {{ weekday }}
      </span>
      <span
        v-for="date in calendarDays"
        :key="date.key"
        class="flex aspect-square items-center justify-center"
        :class="{
          'text-foreground': date.isCurrentMonth && !isToday(date),
          'text-transparent': !date.isCurrentMonth,
          'text-blue': isToday(date),
          'bg-gold text-black': date.isCurrentMonth && date.day === highlightedDay
        }"
      >
        {{ date.day || 0 }}
      </span>
    </div>
  </div>
</template>
