<script lang="ts">
	import { formatFileSize } from '$lib/utils';
	
	export let document: any; // This would be a proper Document type
	export let compact = false;

	function getFileIcon(fileType: string): string {
		if (fileType.includes('pdf')) return '📄';
		if (fileType.includes('word')) return '📝';
		if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
		if (fileType.includes('powerpoint') || fileType.includes('presentation')) return '📊';
		if (fileType.includes('image')) return '🖼️';
		return '📎';
	}

	function handleDownload() {
		// Implement download logic
		window.open(document.file_path, '_blank');
	}

	function handleView() {
		// Implement view logic
		window.open(document.file_path, '_blank');
	}
</script>

<div class="bg-white bg-opacity-10 rounded-lg p-3 border border-white border-opacity-20">
	<div class="flex items-start space-x-3">
		<!-- File icon -->
		<div class="text-2xl flex-shrink-0">
			{getFileIcon(document.file_type || '')}
		</div>

		<!-- Document info -->
		<div class="flex-1 min-w-0">
			<h4 class="font-medium text-sm truncate">
				{document.name || 'Document'}
			</h4>
			
			{#if !compact && document.description}
				<p class="text-xs opacity-75 mt-1 line-clamp-2">
					{document.description}
				</p>
			{/if}

			<div class="flex items-center space-x-2 mt-1 text-xs opacity-75">
				{#if document.file_size}
					<span>{formatFileSize(document.file_size)}</span>
				{/if}
				{#if document.file_type}
					<span>•</span>
					<span>{document.file_type.split('/')[1]?.toUpperCase() || 'FILE'}</span>
				{/if}
				{#if document.version_number}
					<span>•</span>
					<span>v{document.version_number}</span>
				{/if}
			</div>
		</div>

		<!-- Actions -->
		{#if !compact}
			<div class="flex space-x-1 flex-shrink-0">
				<button
					class="p-1 hover:bg-white hover:bg-opacity-20 rounded text-xs"
					on:click={handleView}
					title="View document"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
					</svg>
				</button>
				<button
					class="p-1 hover:bg-white hover:bg-opacity-20 rounded text-xs"
					on:click={handleDownload}
					title="Download document"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
					</svg>
				</button>
			</div>
		{/if}
	</div>

	{#if compact}
		<div class="flex justify-between items-center mt-2">
			<button
				class="text-xs underline hover:no-underline"
				on:click={handleView}
			>
				View
			</button>
			<button
				class="text-xs underline hover:no-underline"
				on:click={handleDownload}
			>
				Download
			</button>
		</div>
	{/if}
</div>