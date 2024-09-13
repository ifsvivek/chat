<script>
	import { onMount } from 'svelte';
	import { auth } from '$lib/firebase';
	import {
		createUserWithEmailAndPassword,
		signInWithEmailAndPassword,
		sendPasswordResetEmail
	} from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { LogIn, UserPlus, ArrowLeft } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';

	let email = '';
	let password = '';
	let error = '';
	let successMessage = '';
	let isSignUp = false;
	let isResetPassword = false;

	async function handleEmailAuth() {
		try {
			if (isSignUp) {
				await createUserWithEmailAndPassword(auth, email, password);
			} else {
				await signInWithEmailAndPassword(auth, email, password);
			}
			goto('/chat');
		} catch (err) {
			error = err.message;
		}
	}

	async function handleResetPassword() {
		try {
			await sendPasswordResetEmail(auth, email);
			successMessage = 'Password reset email sent. Please check your inbox.';
			error = '';
		} catch (err) {
			error = err.message;
			successMessage = '';
		}
	}

	function resetForm() {
		email = '';
		password = '';
		error = '';
		successMessage = '';
	}

	onMount(() => {
		document.documentElement.classList.add('dark');
	});
</script>

<div class="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
	<div class="w-full max-w-md space-y-8" in:fade={{ duration: 300, delay: 300 }}>
		<div class="text-center">
			<h2 class="mt-6 text-3xl font-bold text-blue-400">Welcome to LLAMA Chat</h2>
			<p class="mt-2 text-sm text-gray-400">
				{#if isResetPassword}
					Reset your password
				{:else if isSignUp}
					Create an account to get started
				{:else}
					Sign in to your account
				{/if}
			</p>
		</div>
		<form
			class="mt-6 space-y-6"
			on:submit|preventDefault={isResetPassword ? handleResetPassword : handleEmailAuth}
		>
			<div>
				<label for="email" class="sr-only">Email address</label>
				<input
					id="email"
					name="email"
					type="email"
					bind:value={email}
					required
					class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-gray-100 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
					placeholder="Email address"
				/>
			</div>
			{#if !isResetPassword}
				<div>
					<label for="password" class="sr-only">Password</label>
					<input
						id="password"
						name="password"
						type="password"
						bind:value={password}
						required
						class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-gray-100 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
						placeholder="Password"
					/>
				</div>
			{/if}
			<div>
				<button
					type="submit"
					class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
				>
					{#if isResetPassword}
						Reset Password
					{:else if isSignUp}
						<UserPlus class="h-5 w-5 mr-2" />
						Sign Up
					{:else}
						<LogIn class="h-5 w-5 mr-2" />
						Sign In
					{/if}
				</button>
			</div>
		</form>
		<div class="text-center space-y-2">
			{#if !isResetPassword}
				<button
					on:click={() => {
						isSignUp = !isSignUp;
						resetForm();
					}}
					class="text-sm text-blue-400 hover:text-blue-300 focus:outline-none focus:underline transition-colors duration-200"
				>
					{isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
				</button>
				<button
					on:click={() => {
						isResetPassword = true;
						resetForm();
					}}
					class="block w-full text-sm text-blue-400 hover:text-blue-300 focus:outline-none focus:underline transition-colors duration-200"
				>
					Forgot your password?
				</button>
			{:else}
				<button
					on:click={() => {
						isResetPassword = false;
						resetForm();
					}}
					class="text-sm text-blue-400 hover:text-blue-300 focus:outline-none focus:underline transition-colors duration-200 flex items-center justify-center"
				>
					<ArrowLeft class="h-4 w-4 mr-1" />
					Back to Sign In
				</button>
			{/if}
		</div>
		{#if error}
			<div
				class="mt-4 text-center text-sm text-red-400 bg-red-900 p-2 rounded-md"
				in:fly={{ y: 20, duration: 300 }}
			>
				{error}
			</div>
		{/if}
		{#if successMessage}
			<div
				class="mt-4 text-center text-sm text-green-400 bg-green-900 p-2 rounded-md"
				in:fly={{ y: 20, duration: 300 }}
			>
				{successMessage}
			</div>
		{/if}
	</div>
</div>

<style>
	:global(body) {
		background-color: #1a202c;
		color: #f7fafc;
	}
</style>
