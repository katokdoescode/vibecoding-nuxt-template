<template>
	<div class="relative min-h-screen w-full overflow-hidden">
		<!-- Randomly placed and moving gradient circles -->
		<div
			class="pointer-events-none select-none absolute top-[10%] left-[8%] w-[38rem] h-[38rem] rounded-full bg-gradient-to-br from-green-300 via-green-400 to-green-500 opacity-25 blur-[110px] animate-move1" />
		<div
			class="pointer-events-none select-none absolute top-[60%] left-[18%] w-[28rem] h-[28rem] rounded-full bg-gradient-to-tr from-green-400 via-green-500 to-green-300 opacity-20 blur-[90px] animate-move2" />
		<div
			class="pointer-events-none select-none absolute top-[30%] right-[12%] w-[32rem] h-[32rem] rounded-full bg-gradient-to-tl from-green-200 via-green-300 to-green-400 opacity-18 blur-[100px] animate-move3" />
		<div
			class="pointer-events-none select-none absolute bottom-[8%] left-[40%] w-[24rem] h-[24rem] rounded-full bg-gradient-to-br from-green-200 via-green-400 to-green-500 opacity-22 blur-[80px] animate-move4" />
		<div
			class="pointer-events-none select-none absolute top-[18%] right-[30%] w-[20rem] h-[20rem] rounded-full bg-gradient-to-tr from-green-300 via-green-200 to-green-400 opacity-16 blur-[70px] animate-move5" />
		<div
			class="pointer-events-none select-none absolute bottom-[20%] right-[10%] w-[26rem] h-[26rem] rounded-full bg-gradient-to-tl from-green-400 via-green-300 to-green-200 opacity-20 blur-[90px] animate-move6" />
		<!-- Slot for layout content -->
		<div class="relative z-10">
			<slot />
		</div>
	</div>
</template>

<style>
@keyframes move1 {

	0%,
	100% {
		transform: translateY(0) scale(1);
	}

	50% {
		transform: translateY(-40px) scale(1.08);
	}
}

@keyframes move2 {

	0%,
	100% {
		transform: translateX(0) scale(1);
	}

	50% {
		transform: translateX(60px) scale(0.95);
	}
}

@keyframes move3 {

	0%,
	100% {
		transform: translateY(0) translateX(0) scale(1);
	}

	25% {
		transform: translateY(-30px) translateX(20px) scale(1.04);
	}

	75% {
		transform: translateY(30px) translateX(-20px) scale(0.98);
	}
}

@keyframes move4 {

	0%,
	100% {
		transform: translateY(0) scale(1);
	}

	50% {
		transform: translateY(50px) scale(1.1);
	}
}

@keyframes move5 {

	0%,
	100% {
		transform: translateX(0) scale(1);
	}

	50% {
		transform: translateX(-50px) scale(1.07);
	}
}

@keyframes move6 {

	0%,
	100% {
		transform: translateY(0) scale(1);
	}

	40% {
		transform: translateY(-30px) scale(0.93);
	}

	80% {
		transform: translateY(30px) scale(1.05);
	}
}

.animate-move1 {
	animation: move1 8s ease-in-out infinite alternate;
}

.animate-move2 {
	animation: move2 10s ease-in-out infinite alternate;
}

.animate-move3 {
	animation: move3 12s ease-in-out infinite alternate;
}

.animate-move4 {
	animation: move4 9s ease-in-out infinite alternate;
}

.animate-move5 {
	animation: move5 11s ease-in-out infinite alternate;
}

.animate-move6 {
	animation: move6 13s ease-in-out infinite alternate;
}

/* Respect user prefers-reduced-motion: stop all animations and transitions */
@media (prefers-reduced-motion: reduce) {

	.animate-move1,
	.animate-move2,
	.animate-move3,
	.animate-move4,
	.animate-move5,
	.animate-move6 {
		animation: none !important;
		transition: none !important;
	}
}
</style>
