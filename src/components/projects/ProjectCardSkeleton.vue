<template>
  <Card class="rounded-lg!">
    <template #content>
      <div class="flex items-start gap-4">
        <Skeleton size="4rem" />
        <div class="flex-1 space-y-2">
          <Skeleton width="70%" height="1.5rem" />
          <Skeleton width="100%" height="1rem" />
          <Skeleton width="100%" height="1rem" />
        </div>
      </div>
    </template>
  </Card>
</template>
