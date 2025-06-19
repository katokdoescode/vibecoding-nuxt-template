<template>
	<Card class="h-full flex flex-col opacity-60 border-dashed border-2 border-muted-foreground/30 bg-muted/20">
		<CardHeader class="pb-3">
			<div class="flex items-start justify-between mb-3">
				<Badge
					variant="secondary"
					class="text-xs font-medium"
				>
					Locked
				</Badge>
				<span class="text-xs text-muted-foreground font-medium">
					{{ index + 1 }}/9
				</span>
			</div>
			<CardTitle class="text-lg font-semibold leading-tight mb-2 flex items-start gap-2">
				<Icon
					name="lucide:lock"
					class="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5"
				/>
				<span class="text-muted-foreground">
					{{ title || `Case ${index + 1}` }}
				</span>
			</CardTitle>
			<CardDescription class="text-sm text-muted-foreground leading-relaxed line-clamp-3">
				{{ description || 'Complete previous cases to unlock this challenge.' }}
			</CardDescription>
		</CardHeader>
		<CardFooter class="pt-0 mt-auto">
			<div class="flex items-center text-xs text-muted-foreground">
				<Icon
					name="lucide:lock"
					class="h-3 w-3 mr-1.5 flex-shrink-0"
				/>
				<span class="font-medium">Locked</span>
			</div>
		</CardFooter>
	</Card>
</template>

<script setup lang="ts">
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Props {
	index: number;
	title?: string | null;
	description?: string | null;
}

defineProps<Props>();
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
