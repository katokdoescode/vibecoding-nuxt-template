<template>
	<div class="space-y-6">
		<div>
			<h1 class="text-3xl font-bold">
				{{ studyCase.title }}
			</h1>
			<p
				v-if="studyCase.description"
				class="text-muted-foreground mt-2"
			>
				{{ studyCase.description }}
			</p>
		</div>

		<UCard class="h-full overflow-auto">
			<UCardHeader>
				<UCardTitle>Case Story</UCardTitle>
			</UCardHeader>
			<UCardContent>
				<MDC
					class="story"
					:value="studyCase.story || ''"
				/>
			</UCardContent>
		</UCard>

		<UButton
			:disabled="disabled || isSubmitting"
			class="w-full"
			size="lg"
			@click="$emit('submit')"
		>
			{{ isSubmitting ? 'Submitting...' : submitText }}
		</UButton>
	</div>
</template>

<script setup lang="ts">
interface CaseData {
	title: string | null;
	description: string | null;
	story: string | null;
}

interface Props {
	studyCase: CaseData;
	disabled?: boolean;
	isSubmitting?: boolean;
	submitText?: string;
}

withDefaults(defineProps<Props>(), {
	disabled: false,
	isSubmitting: false,
	submitText: 'Submit Case',
});

defineEmits<{
	submit: [];
}>();
</script>

<style scoped>
/* Typography styles for MDC content */
:deep(.story) {
	/* Headers */
	h1 {
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 1rem;
		margin-top: 1.5rem;
		color: hsl(var(--foreground));
	}

	h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
		margin-top: 1.25rem;
		color: hsl(var(--foreground));
	}

	h3 {
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		margin-top: 1rem;
		color: hsl(var(--foreground));
	}

	h4 {
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		margin-top: 0.75rem;
		color: hsl(var(--foreground));
	}

	h5 {
		font-size: 0.875rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		margin-top: 0.75rem;
		color: hsl(var(--foreground));
	}

	h6 {
		font-size: 0.875rem;
		font-weight: 500;
		margin-bottom: 0.5rem;
		margin-top: 0.75rem;
		color: hsl(var(--muted-foreground));
	}

	/* Paragraphs */
	p {
		margin-bottom: 1rem;
		color: hsl(var(--foreground));
		line-height: 1.625;
	}

	/* Lists */
	ul {
		margin-bottom: 1rem;
		margin-left: 1.5rem;
		list-style-type: disc;
	}

	ul > li + li {
		margin-top: 0.25rem;
	}

	ol {
		margin-bottom: 1rem;
		margin-left: 1.5rem;
		list-style-type: decimal;
	}

	ol > li + li {
		margin-top: 0.25rem;
	}

	li {
		color: hsl(var(--foreground));
		line-height: 1.625;
	}

	li > ul {
		margin-bottom: 0;
		margin-top: 0.25rem;
	}

	li > ol {
		margin-bottom: 0;
		margin-top: 0.25rem;
	}

	/* Links */
	a {
		color: hsl(var(--primary));
		text-decoration: underline;
		text-underline-offset: 2px;
		transition: color 0.15s ease-in-out;
	}

	a:hover {
		color: hsl(var(--primary) / 0.8);
	}

	/* Emphasis */
	strong {
		font-weight: 600;
		color: hsl(var(--foreground));
	}

	em {
		font-style: italic;
		color: hsl(var(--foreground));
	}

	/* Code */
	code {
		background-color: hsl(var(--muted));
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
		font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
		color: hsl(var(--foreground));
	}

	pre {
		background-color: hsl(var(--muted));
		padding: 1rem;
		border-radius: 0.5rem;
		overflow-x: auto;
		margin-bottom: 1rem;
	}

	pre code {
		background-color: transparent;
		padding: 0;
		font-size: 0.875rem;
		font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
	}

	/* Blockquotes */
	blockquote {
		border-left: 4px solid hsl(var(--muted-foreground) / 0.2);
		padding-left: 1rem;
		margin: 1rem 0;
		font-style: italic;
		color: hsl(var(--muted-foreground));
	}

	/* Tables */
	table {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 1rem;
	}

	th {
		border: 1px solid hsl(var(--border));
		background-color: hsl(var(--muted));
		padding: 0.5rem;
		text-align: left;
		font-weight: 600;
		color: hsl(var(--foreground));
	}

	td {
		border: 1px solid hsl(var(--border));
		padding: 0.5rem;
		color: hsl(var(--foreground));
	}

	/* Horizontal Rule */
	hr {
		border: 0;
		border-top: 1px solid hsl(var(--border));
		margin: 1.5rem 0;
	}

	/* Images */
	img {
		max-width: 100%;
		height: auto;
		border-radius: 0.5rem;
		margin-bottom: 1rem;
	}

	/* Task Lists */
	ul.contains-task-list {
		list-style: none;
		margin-left: 0;
	}

	.task-list-item {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
	}

	.task-list-item input[type="checkbox"] {
		margin-top: 0.25rem;
	}
}
</style>
