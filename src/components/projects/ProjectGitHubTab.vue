<template>
  <div class="mt-6">
    <div class="card">
      <div class="flex items-center justify-center min-h-[400px]">
        <div class="flex items-center gap-8 max-w-2xl">
          <div class="flex-shrink-0">
            <img src="/layout/images/version-control.svg" alt="Version Control" class="w-48 h-48" />
          </div>
          <div class="flex flex-col gap-4">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              Connect GitHub with Mirai Boards
            </h3>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              <a
                href="https://miraihq.com/en/"
                target="_blank"
                class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 underline transition-colors"
              >
                Link pull requests to work items,
              </a>
              and see the status of your development from within Mirai Boards.
            </p>
            <Button label="Connect your GitHub Account" class="w-fit" disabled />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
