<template>
  <div class="card">
    <div class="flex justify-between items-center mb-4">
      <div>
        <Skeleton width="6rem" height="1.5rem" class="mb-2" />
        <Skeleton width="10rem" height="1rem" />
      </div>
      <div class="flex items-center text-right">
        <div class="mr-4">
          <Skeleton width="5rem" height="1.25rem" class="mb-1" />
          <Skeleton width="4rem" height="1rem" />
        </div>
        <Skeleton width="3rem" height="3rem" />
      </div>
    </div>
    <Skeleton width="100%" height="19rem" borderRadius="8px" />
  </div>
</template>
