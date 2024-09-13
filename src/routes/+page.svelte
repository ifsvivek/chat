<script>
	import { onMount } from 'svelte';
	import { auth } from '$lib/firebase';
	import {
		signInWithPopup,
		GoogleAuthProvider,
		GithubAuthProvider,
		createUserWithEmailAndPassword,
		signInWithEmailAndPassword,
		sendPasswordResetEmail
	} from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { Github, Mail, LogIn, UserPlus, ArrowLeft } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';

	let email = '';
	let password = '';
	let error = '';
	let successMessage = '';
	let isSignUp = false;
	let isResetPassword = false;

	async function signInWithGoogle() {
		try {
			await signInWithPopup(auth, new GoogleAuthProvider());
			goto('/chat');
		} catch (err) {
			error = err.message;
		}
	}

	async function signInWithGithub() {
		try {
			await signInWithPopup(auth, new GithubAuthProvider());
			goto('/chat');
		} catch (err) {
			error = err.message;
		}
	}

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
		{#if !isResetPassword}
			<div class="mt-8 space-y-6">
				<div class="space-y-4">
					<button
						on:click={signInWithGoogle}
						class="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
					>
						<svg class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor"
							><path
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								fill="#4285F4"
							/><path
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								fill="#34A853"
							/><path
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								fill="#FBBC05"
							/><path
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								fill="#EA4335"
							/><path d="M1 1h22v22H1z" fill="none" /></svg
						>
						Sign in with Google
					</button>
					<button
						on:click={signInWithGithub}
						class="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
					>
						<Github class="h-5 w-5 mr-2" />
						Sign in with GitHub
					</button>
				</div>
				<div class="mt-6">
					<div class="relative">
						<div class="absolute inset-0 flex items-center">
							<div class="w-full border-t border-gray-700" />
						</div>
						<div class="relative flex justify-center text-sm">
							<span class="px-2 bg-gray-900 text-gray-400">Or continue with</span>
						</div>
					</div>
				</div>
			</div>
		{/if}
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
