<script>
	export let user;
	export let isDark;

	import { base } from '$app/paths';
	import cookie from 'cookie';
	import ms from 'ms';

	const toggle = () => {
		document.cookie = cookie.serialize('theme', isDark ? 'light' : 'dark', {
			maxAge: ms('1y') / 1000,
			path: '/',
			sameSite: 'lax'
		});
		window.location = window.location; // eslint-disable-line
	};
</script>

<div class="bg-white dark:bg-slate-700 my-8 p-4 rounded-xl shadow-sm">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:mx-8">
		<div>
			<a href={base + '/settings'} class="flex justify-center md:justify-start">
				<!-- <img src="/logo.png" class="h-8" alt="Fusion Tickets" /> -->
				<img
					src="https://dunb17ur4ymx4.cloudfront.net/webstore/logos/984f4179fe2495ac7a6675b1e81b514135e5a603.png"
					class="h-8"
					alt="Fusion Tickets"
				/>
			</a>
		</div>
		<div>
			<div
				class="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left md:float-right flex items-center justify-center md:justify-end"
			>
				<a
					href={`/auth/logout`}
					class="flex items-center justify-center md:justify-end hover:font-medium"
					title="Logout"
				>
					<img
						src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`}
						class="h-8 rounded-full"
						alt="Fusion Tickets"
					/>
					<span class="ml-3">{user.username}</span>
				</a>
				<div class="ml-4">
					{#if isDark}
						<i
							class="fa-solid fa-moon text-lg p-1 cursor-pointer hover:text-blurple transition duration-300"
							title="Switch to light mode"
							on:click={() => toggle()}
						/>
					{:else}
						<i
							class="fa-solid fa-sun text-lg p-1 cursor-pointer hover:text-blurple transition duration-300"
							title="Switch to dark mode"
							on:click={() => toggle()}
						/>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
