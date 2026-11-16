<x-app-layout>
    <x-slot name="header">
        <div class="flex items-center justify-between">
            <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                {{ __('Proyek Desain Drone Saya') }}
            </h2>
            <a href="{{ route('studio') }}" class="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm shadow transition">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Buat Desain Baru
            </a>
        </div>
    </x-slot>

    <div class="py-8">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            @if (session('status'))
                <div class="mb-6 p-4 bg-emerald-100 dark:bg-emerald-900 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 rounded-lg text-sm">
                    {{ session('status') }}
                </div>
            @endif

            @if($projects->isEmpty())
                <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
                    <div class="w-16 h-16 mx-auto mb-4 bg-indigo-50 dark:bg-indigo-900/40 rounded-full flex items-center justify-center text-indigo-500">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Belum ada desain tersimpan</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                        Mulai rancang pertunjukan drone 3D pertama Anda menggunakan Katalog Desain Klien atau buat formasi kustom sendiri.
                    </p>
                    <a href="{{ route('studio') }}" class="inline-flex items-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm shadow transition">
                        Buka Skyfy Studio
                    </a>
                </div>
            @else
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    @foreach($projects as $project)
                        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition flex flex-col">
                            <div class="p-5 flex-1">
                                <div class="flex items-start justify-between mb-3">
                                    <h3 class="font-semibold text-lg text-gray-900 dark:text-gray-100 line-clamp-1">
                                        {{ $project->name }}
                                    </h3>
                                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                                        {{ $project->drone_count }} Drone
                                    </span>
                                </div>
                                <div class="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                                    <span>⏱️ {{ $project->duration }} detik</span>
                                    <span>🎬 {{ $project->scenes_count }} scene</span>
                                    <span>📅 {{ $project->updated_at->diffForHumans() }}</span>
                                </div>
                            </div>
                            <div class="px-5 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-sm">
                                <a href="{{ route('studio.project', $project->id) }}" class="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                                    Buka di Editor ↗
                                </a>
                                <div class="flex items-center space-x-3">
                                    <form action="{{ route('projects.duplicate', $project->id) }}" method="POST">
                                        @csrf
                                        <button type="submit" class="text-xs text-gray-600 dark:text-gray-300 hover:text-indigo-600" title="Duplikat desain">
                                            Salin
                                        </button>
                                    </form>
                                    <form action="{{ route('projects.destroy', $project->id) }}" method="POST" onsubmit="return confirm('Yakin ingin menghapus proyek ini?');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="text-xs text-rose-600 hover:text-rose-700" title="Hapus proyek">
                                            Hapus
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>

                <div class="mt-6">
                    {{ $projects->links() }}
                </div>
            @endif
        </div>
    </div>
</x-app-layout>
