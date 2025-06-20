<template>
	<div class="lg:h-screen flex flex-col lg:flex-row lg:overflow-hidden">
		<!-- Sidebar for desktop, collapsible for mobile -->
		<div class="lg:flex-shrink-0">
			<AppSidebar />
		</div>

		<!-- Main content area -->
		<main class="flex-1 overflow-hidden">
			<slot />
		</main>
	</div>
</template>

<style scoped>
/* Ensure the layout takes full height on all screen sizes */
</style>
