<script>
	import { AVAILABLE_MODELS } from '$lib/constants';
	import { fade, slide } from 'svelte/transition';

	let messages = [];
	let newMessage = '';
	let isLoading = false;
	let isModalOpen = false;
	let selectedModel = AVAILABLE_MODELS[0].id;
	$: currentModel = AVAILABLE_MODELS.find((model) => model.id === selectedModel);

	function handleModelSelect(modelId) {
		selectedModel = modelId;
		isModalOpen = false;
	}

	function handleKeydown(e) {
		if (e.key === 'Escape') isModalOpen = false;
	}

	async function handleSubmit() {
		if (!newMessage.trim()) return;

		messages = [...messages, { role: 'user', content: newMessage }];
		const userInput = newMessage;
		newMessage = '';
		isLoading = true;

		try {
			const response = await fetch('/api/chat-completion', {
				method: 'POST',
				body: JSON.stringify({
					message: userInput,
					history: messages,
					modelId: selectedModel
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			const data = await response.json();
			messages = [...messages, { role: 'assistant', content: data.message }];
		} catch (error) {
			console.error('Error:', error);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="flex min-h-screen flex-col bg-[#121212]">
	<header class="border-b border-zinc-800 bg-[#1A1A1A]/50 backdrop-blur-xl">
		<div class="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between">
				<div class="flex flex-col gap-1">
					<h1
						class="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-xl font-semibold text-transparent"
					>
						LLama Chat
					</h1>
					<button
						on:click={() => (isModalOpen = !isModalOpen)}
						class="flex items-center gap-2 bg-gradient-to-r from-purple-400/70 to-pink-400/70 bg-clip-text text-left text-sm text-transparent hover:opacity-80"
					>
						<span>{currentModel.name} by {currentModel.developer}</span>
						<svg class="h-4 w-4 text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
							<path
								fill-rule="evenodd"
								d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	</header>

	{#if isModalOpen}
		<div
			transition:fade={{ duration: 200 }}
			class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
			on:click={() => (isModalOpen = false)}
		>
			<div
				transition:slide={{ duration: 200 }}
				class="absolute right-4 top-16 max-h-[calc(100vh-8rem)] w-80 overflow-y-auto rounded-2xl border border-zinc-800 bg-[#1A1A1A] p-2 shadow-xl"
				on:click|stopPropagation
			>
				<!-- Production Models -->
				<div class="mb-2 px-4 pt-2 text-xs font-semibold text-zinc-400">Production Models</div>
				{#each AVAILABLE_MODELS.filter((m) => !m.id.includes('preview')) as model}
					<button
						on:click={() => handleModelSelect(model.id)}
						class="w-full rounded-xl px-4 py-3 text-left text-zinc-200 hover:bg-zinc-800
                    {selectedModel === model.id ? 'bg-zinc-800' : ''}"
					>
						<div class="font-medium">{model.name}</div>
						<div class="text-sm text-zinc-400">{model.developer}</div>
					</button>
				{/each}

				<!-- Preview Models -->
				<div class="mb-2 mt-4 px-4 pt-2 text-xs font-semibold text-zinc-400">Preview Models</div>
				{#each AVAILABLE_MODELS.filter((m) => m.id.includes('preview')) as model}
					<button
						on:click={() => handleModelSelect(model.id)}
						class="w-full rounded-xl px-4 py-3 text-left text-zinc-200 hover:bg-zinc-800
                    {selectedModel === model.id ? 'bg-zinc-800' : ''}"
					>
						<div class="font-medium">{model.name}</div>
						<div class="text-sm text-zinc-400">{model.developer}</div>
					</button>
				{/each}
			</div>
		</div>
	{/if}
	<main class="flex flex-1 flex-col">
		<div class="mx-auto w-full max-w-5xl flex-1 px-4 py-4 sm:px-6 lg:px-8">
			<!-- Messages Container -->
			<div
				class="flex h-[calc(100vh-15rem)] flex-col space-y-4 overflow-y-auto rounded-2xl border border-zinc-800 bg-[#1A1A1A]/50 p-4 shadow-xl backdrop-blur-xl"
			>
				{#each messages as message}
					<div class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'}">
						<div
							class="max-w-[85%] rounded-2xl px-4 py-3 shadow-xl
                            {message.role === 'user'
								? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
								: 'border border-zinc-800 bg-zinc-900/80 text-zinc-200'}"
						>
							<p class="text-sm sm:text-base">{message.content}</p>
						</div>
					</div>
				{/each}

				{#if isLoading}
					<div class="flex justify-center py-4">
						<div class="flex items-center space-x-2">
							<div class="h-2 w-2 animate-bounce rounded-full bg-purple-400"></div>
							<div
								class="h-2 w-2 animate-bounce rounded-full bg-purple-400"
								style="animation-delay: 0.2s"
							></div>
							<div
								class="h-2 w-2 animate-bounce rounded-full bg-purple-400"
								style="animation-delay: 0.4s"
							></div>
						</div>
					</div>
				{/if}
			</div>

			<!-- Input Form -->
			<form
				on:submit|preventDefault={handleSubmit}
				class="mt-4 flex items-end space-x-2 rounded-2xl border border-zinc-800 bg-[#1A1A1A]/50 p-4 shadow-xl backdrop-blur-xl"
			>
				<div class="flex-1">
					<input
						type="text"
						bind:value={newMessage}
						placeholder="Type your message..."
						class="w-full rounded-xl border-0 bg-zinc-900/80 px-4 py-3 text-zinc-200 shadow-lg placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
					/>
				</div>
				<button
					type="submit"
					disabled={isLoading}
					class="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-white shadow-lg transition-all hover:opacity-90 hover:shadow-xl disabled:opacity-50"
				>
					Send
				</button>
			</form>
		</div>
	</main>
</div>
