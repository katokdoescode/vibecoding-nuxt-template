<template>
	<div class="space-y-6">
		<!-- Assessment Overview -->
		<UCard>
			<UCardHeader>
				<UCardTitle class="text-xl font-bold text-center">
					Learning Outcomes Assessment
				</UCardTitle>
			</UCardHeader>
			<UCardContent class="space-y-4">
				<!-- Overall Assessment Score -->
				<div class="text-center p-6 bg-muted/20 rounded-lg">
					<div
						class="text-3xl font-bold mb-2"
						:class="getScoreColor(learningOutcomes.assessment_percentage)"
					>
						{{ learningOutcomes.assessment_percentage }}%
					</div>
					<p class="text-sm text-muted-foreground mb-3">
						Overall Assessment Score
					</p>
					<div class="w-full bg-muted rounded-full h-3">
						<div
							class="h-3 rounded-full transition-all duration-300"
							:class="getProgressBarColor(learningOutcomes.assessment_percentage)"
							:style="{ width: `${learningOutcomes.assessment_percentage}%` }"
						/>
					</div>
				</div>

				<!-- Assessment Rationale -->
				<div class="p-4 border rounded-lg">
					<h4 class="font-semibold mb-2 flex items-center">
						<Icon
							name="lucide:lightbulb"
							class="h-4 w-4 mr-2"
						/>
						Assessment Summary
					</h4>
					<p class="text-sm text-muted-foreground">
						{{ learningOutcomes.assessment_rationale }}
					</p>
				</div>
			</UCardContent>
		</UCard>

		<!-- Detailed Performance Analysis -->
		<UCard>
			<UCardHeader>
				<UCardTitle class="flex items-center">
					<Icon
						name="lucide:bar-chart-3"
						class="h-5 w-5 mr-2"
					/>
					Performance Analysis
				</UCardTitle>
			</UCardHeader>
			<UCardContent class="space-y-6">
				<!-- Criteria Analysis -->
				<div class="grid gap-4">
					<div
						v-for="(criteria, key) in learningOutcomes.criteria_analysis"
						:key="key"
						class="p-4 border rounded-lg"
					>
						<div class="flex items-center justify-between mb-3">
							<h4 class="font-semibold capitalize">
								{{ formatCriteriaName(key) }}
							</h4>
							<UBadge :variant="getScoreBadgeVariant(criteria.score_percentage)">
								{{ criteria.score_percentage }}%
							</UBadge>
						</div>
						<div class="w-full bg-muted rounded-full h-2 mb-2">
							<div
								class="h-2 rounded-full transition-all duration-300"
								:class="getProgressBarColor(criteria.score_percentage)"
								:style="{ width: `${criteria.score_percentage}%` }"
							/>
						</div>
						<p class="text-sm text-muted-foreground">
							{{ criteria.feedback }}
						</p>
					</div>
				</div>
			</UCardContent>
		</UCard>

		<!-- Detailed Feedback -->
		<UCard>
			<UCardHeader>
				<UCardTitle class="flex items-center">
					<Icon
						name="lucide:message-circle"
						class="h-5 w-5 mr-2"
					/>
					Detailed Feedback
				</UCardTitle>
			</UCardHeader>
			<UCardContent class="space-y-6">
				<!-- Strengths -->
				<div v-if="learningOutcomes.detailed_feedback.strengths.length > 0">
					<h4 class="font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center">
						<Icon
							name="lucide:check-circle"
							class="h-4 w-4 mr-2"
						/>
						Strengths
					</h4>
					<ul class="space-y-2">
						<li
							v-for="strength in learningOutcomes.detailed_feedback.strengths"
							:key="strength"
							class="flex items-start gap-2 text-sm"
						>
							<Icon
								name="lucide:plus"
								class="h-3 w-3 mt-1 text-green-500 shrink-0"
							/>
							{{ strength }}
						</li>
					</ul>
				</div>

				<!-- Goals Reached -->
				<div v-if="learningOutcomes.detailed_feedback.reached_goals.length > 0">
					<h4 class="font-semibold text-blue-700 dark:text-blue-400 mb-3 flex items-center">
						<Icon
							name="lucide:target"
							class="h-4 w-4 mr-2"
						/>
						Goals Achieved
					</h4>
					<ul class="space-y-2">
						<li
							v-for="goal in learningOutcomes.detailed_feedback.reached_goals"
							:key="goal"
							class="flex items-start gap-2 text-sm"
						>
							<Icon
								name="lucide:check"
								class="h-3 w-3 mt-1 text-blue-500 shrink-0"
							/>
							{{ goal }}
						</li>
					</ul>
				</div>

				<!-- Areas for Improvement -->
				<div v-if="learningOutcomes.detailed_feedback.areas_for_improvement.length > 0">
					<h4 class="font-semibold text-orange-700 dark:text-orange-400 mb-3 flex items-center">
						<Icon
							name="lucide:trending-up"
							class="h-4 w-4 mr-2"
						/>
						Areas for Improvement
					</h4>
					<ul class="space-y-2">
						<li
							v-for="area in learningOutcomes.detailed_feedback.areas_for_improvement"
							:key="area"
							class="flex items-start gap-2 text-sm"
						>
							<Icon
								name="lucide:arrow-up"
								class="h-3 w-3 mt-1 text-orange-500 shrink-0"
							/>
							{{ area }}
						</li>
					</ul>
				</div>

				<!-- Growth Points -->
				<div v-if="learningOutcomes.detailed_feedback.growth_points.length > 0">
					<h4 class="font-semibold text-purple-700 dark:text-purple-400 mb-3 flex items-center">
						<Icon
							name="lucide:trending-up"
							class="h-4 w-4 mr-2"
						/>
						Growth Points
					</h4>
					<ul class="space-y-2">
						<li
							v-for="point in learningOutcomes.detailed_feedback.growth_points"
							:key="point"
							class="flex items-start gap-2 text-sm"
						>
							<Icon
								name="lucide:sprout"
								class="h-3 w-3 mt-1 text-purple-500 shrink-0"
							/>
							{{ point }}
						</li>
					</ul>
				</div>

				<!-- Overall Performance -->
				<div class="p-4 bg-muted/20 rounded-lg">
					<h4 class="font-semibold mb-2 flex items-center">
						<Icon
							name="lucide:star"
							class="h-4 w-4 mr-2"
						/>
						Overall Performance
					</h4>
					<p class="text-sm text-muted-foreground">
						{{ learningOutcomes.detailed_feedback.overall_performance }}
					</p>
				</div>
			</UCardContent>
		</UCard>

		<!-- Recommendations -->
		<UCard v-if="learningOutcomes.recommendations.length > 0">
			<UCardHeader>
				<UCardTitle class="flex items-center">
					<Icon
						name="lucide:compass"
						class="h-5 w-5 mr-2"
					/>
					Recommendations
				</UCardTitle>
			</UCardHeader>
			<UCardContent>
				<div class="space-y-3">
					<div
						v-for="(recommendation, index) in learningOutcomes.recommendations"
						:key="index"
						class="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/20 transition-colors"
					>
						<div class="flex items-center justify-center w-6 h-6 bg-primary/10 text-primary rounded-full text-xs font-semibold shrink-0">
							{{ index + 1 }}
						</div>
						<p class="text-sm">
							{{ recommendation }}
						</p>
					</div>
				</div>
			</UCardContent>
		</UCard>
	</div>
</template>

<script setup lang="ts">
import type { LearningOutcomes } from '~/server/types';

// Props
interface Props {
	learningOutcomes: LearningOutcomes;
}

defineProps<Props>();

// Helper functions
function formatCriteriaName(key: string): string {
	return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function getScoreColor(score: number): string {
	if (score >= 80) return 'text-green-600 dark:text-green-400';
	if (score >= 60) return 'text-blue-600 dark:text-blue-400';
	if (score >= 40) return 'text-orange-600 dark:text-orange-400';
	return 'text-red-600 dark:text-red-400';
}

function getProgressBarColor(score: number): string {
	if (score >= 80) return 'bg-green-500';
	if (score >= 60) return 'bg-blue-500';
	if (score >= 40) return 'bg-orange-500';
	return 'bg-red-500';
}

function getScoreBadgeVariant(score: number): 'default' | 'secondary' | 'destructive' | 'outline' {
	if (score >= 80) return 'default';
	if (score >= 60) return 'secondary';
	if (score >= 40) return 'outline';
	return 'destructive';
}
</script>
