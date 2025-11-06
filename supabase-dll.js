
        const { createApp, ref, computed, onMounted, watch, reactive, nextTick } = Vue;
        const { createClient } = supabase;

        const app = createApp({
            setup() {
                // ==================== SUPABASE CONFIGURATION ====================
                // HARDCODED CONFIGURATION - HAPUS MODAL KONFIGURASI
                const SUPABASE_CONFIG = {
                    url: 'https://rxjfjrcpmaexsfacfejj.supabase.co',
                    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4amZqcmNwbWFleHNmYWNmZWpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNzQ5MDYsImV4cCI6MjA2ODg1MDkwNn0.xHNHBZtepd9PPMZBRbiFFq-7eXv70cu-iFyeK-vQ0ys'
                };

                // Supabase state
                const supabaseClient = ref(null);
                const connectionStatus = ref('disconnected');
                const isConnecting = ref(false);
                const isSyncing = ref(false);

                // Core state
                const loading = ref(true);
                const isLoggedIn = ref(false);
                const isAdmin = ref(false);
                const isMusyrif = ref(false);
                const isPublicAccess = ref(false);
                const currentUser = ref(null);
                const activeTab = ref('admin-dashboard');
                const darkMode = ref(false);
                const autoSaving = ref(false);
                const isSubmitting = ref(false);
                const isLoggingIn = ref(false);
                const loginError = ref('');
                const selectedDate = ref(getCurrentDate());

                // UI state
                const showSantriModal = ref(false);
                const showMusyrifModal = ref(false);
                const editingSantri = ref(null);
                const editingMusyrif = ref(null);

                // Forms
                const credentials = reactive({
                    username: '',
                    password: ''
                });

                const santriForm = reactive({
                    name: '',
                    angkatan: '',
                    musyrifId: ''
                });

                const musyrifForm = reactive({
                    name: '',
                    username: '',
                    password: ''
                });

                // Filters
                const santriFilter = reactive({
                    angkatan: '',
                    musyrif: '',
                    search: ''
                });

                const tahfizhFilter = reactive({
                    angkatan: '',
                    musyrif: '',
                    sort: 'progress',
                    month: getCurrentMonth()
                });

                const ibadahFilter = reactive({
                    month: getCurrentMonth(),
                    angkatan: '',
                    musyrif: ''
                });

                const attendanceFilter = reactive({
                    month: getCurrentMonth(),
                    angkatan: '',
                    musyrif: ''
                });

                // Data - DENGAN PROPER DELETE STATUS
                const musyrifList = ref([
                    { id: 'mus-1', name: 'Musyrif1', username: 'musyrif1', password: 'musyrif1', isActive: true },
                    { id: 'mus-2', name: 'Musyrif2', username: 'musyrif2', password: 'musyrif2', isActive: true },
                ]);

                const santriList = ref([
                    { id: 'santri-1', name: 'Santri 1', angkatan: 12, musyrifId: 'mus-1', isActive: true },
                    { id: 'santri-2', name: 'Santri 2', angkatan: 11, musyrifId: 'mus-2', isActive: true },
                ]);

                const adminUsers = ref([
                    { id: 'admin-1', username: 'admin', password: 'admin123', name: 'Administrator', role: 'admin' }
                ]);

                const notifications = ref([]);

                // Progress data
                const tahfizhProgress = ref({});
                const ibadahProgress = ref({});
                const attendanceProgress = ref({});
                const tahfizhInput = ref({});
                const ibadahInput = ref({});
                const attendanceInput = ref({});

                // Halaqah (3x tatap muka) list
                const halaqahList = ref([
                    { key: 'halaqah_1', name: 'Halaqah Pagi', short: 'P1' },
                    { key: 'halaqah_2', name: 'Halaqah Siang', short: 'P2' },
                    { key: 'halaqah_3', name: 'Halaqah Sore', short: 'P3' }
                ]);

                // Attendance status options
                const attendanceStatusOptions = ref([
                    { value: 'hadir', label: 'Hadir', color: 'green' },
                    { value: 'izin', label: 'Izin', color: 'yellow' },
                    { value: 'sakit', label: 'Sakit', color: 'red' },
                    { value: 'tanpa_keterangan', label: 'Tanpa Keterangan', color: 'gray' }
                ]);

                // Juz mapping for calculations
                const juzMapping = ref([
                    { number: 1, startPage: 1, endPage: 21 },
                    { number: 2, startPage: 22, endPage: 41 },
                    { number: 3, startPage: 42, endPage: 61 },
                    { number: 4, startPage: 62, endPage: 81 },
                    { number: 5, startPage: 82, endPage: 101 },
                    { number: 6, startPage: 102, endPage: 121 },
                    { number: 7, startPage: 122, endPage: 141 },
                    { number: 8, startPage: 142, endPage: 161 },
                    { number: 9, startPage: 162, endPage: 181 },
                    { number: 10, startPage: 182, endPage: 201 },
                    { number: 11, startPage: 202, endPage: 221 },
                    { number: 12, startPage: 222, endPage: 241 },
                    { number: 13, startPage: 242, endPage: 261 },
                    { number: 14, startPage: 262, endPage: 281 },
                    { number: 15, startPage: 282, endPage: 301 },
                    { number: 16, startPage: 302, endPage: 321 },
                    { number: 17, startPage: 322, endPage: 341 },
                    { number: 18, startPage: 342, endPage: 361 },
                    { number: 19, startPage: 362, endPage: 381 },
                    { number: 20, startPage: 382, endPage: 401 },
                    { number: 21, startPage: 402, endPage: 421 },
                    { number: 22, startPage: 422, endPage: 441 },
                    { number: 23, startPage: 442, endPage: 461 },
                    { number: 24, startPage: 462, endPage: 481 },
                    { number: 25, startPage: 482, endPage: 501 },
                    { number: 26, startPage: 502, endPage: 521 },
                    { number: 27, startPage: 522, endPage: 541 },
                    { number: 28, startPage: 542, endPage: 561 },
                    { number: 29, startPage: 562, endPage: 581 },
                    { number: 30, startPage: 582, endPage: 604 }
                ]);

                // Ibadah list
                const ibadahList = ref([
                    { key: 'ql', name: 'QL', icon: 'fas fa-sun', color: 'text-yellow-500' },
                    { key: 'sholat', name: 'Sholat Wajib', icon: 'fas fa-sun', color: 'text-orange-500' },
                    { key: 'matsurat', name: 'Matsurat', icon: 'fas fa-sun', color: 'text-amber-500' },
                    { key: 'piket', name: 'Piket', icon: 'fas fa-moon', color: 'text-purple-500' },
                    { key: 'dirosah', name: 'Dirosah', icon: 'fas fa-moon', color: 'text-indigo-500' },
                    { key: 'olahraga', name: 'Olahraga', icon: 'fas fa-star', color: 'text-blue-500' },
                    { key: 'lima_s', name: '5 S', icon: 'fas fa-sun', color: 'text-green-500' },
                    { key: 'baca', name: 'Baca buku', icon: 'fas fa-book-quran', color: 'text-emerald-500' },
                    { key: 'murojaahsholat', name: 'Murojaah Dalam Sholat (5)', icon: 'fas fa-hands', color: 'text-teal-500' },
                    { key: 'sedekah', name: 'Sedekah', icon: 'fas fa-hand-holding-heart', color: 'text-pink-500' }
                ]);

                // ==================== HELPER FUNCTIONS ====================
                function getJakartaDate() {
                    const now = new Date();
                    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
                    return new Date(utc + (7 * 3600000)); // UTC+7 Jakarta
                }

                function getCurrentDate() {
                    return getJakartaDate().toISOString().split('T')[0];
                }

                function getCurrentMonth() {
                    return getJakartaDate().toISOString().split('T')[0].substring(0, 7);
                }

                function getAvailableMonths() {
                    const months = [];
                    const startDate = new Date('2025-07-01'); // Mulai dari Juli 2025
                    const currentDate = getJakartaDate();
                    
                    let date = new Date(startDate);
                    while (date <= currentDate) {
                        const yearMonth = date.toISOString().split('T')[0].substring(0, 7);
                        months.push({
                            value: yearMonth,
                            label: date.toLocaleDateString('id-ID', { 
                                year: 'numeric', 
                                month: 'long' 
                            })
                        });
                        date.setMonth(date.getMonth() + 1);
                    }
                    
                    return months.reverse(); // Terbaru di atas
                }

                function getDaysInMonth(yearMonth) {
                    const [year, month] = yearMonth.split('-');
                    const date = new Date(year, month, 0);
                    return date.getDate();
                }

                function getDateRange(yearMonth) {
                    const [year, month] = yearMonth.split('-');
                    const daysInMonth = getDaysInMonth(yearMonth);
                    const dates = [];
                    
                    for (let day = 1; day <= daysInMonth; day++) {
                        const dateStr = `${year}-${month.padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                        dates.push(dateStr);
                    }
                    
                    return dates;
                }

// Function untuk cek apakah tanggal adalah hari Minggu
const isSunday = (dateString) => {
    const date = new Date(dateString + 'T00:00:00.000Z');
    return date.getDay() === 0; // 0 = Minggu
};

// Function untuk cek apakah tanggal adalah hari libur
const isHoliday = (dateString) => {
    // Untuk saat ini hanya hari Minggu
    // Bisa ditambahkan hari libur nasional di masa depan
    return isSunday(dateString);
};

// Function untuk mendapatkan jumlah hari kerja dalam bulan
const getWorkingDaysInMonth = (yearMonth) => {
    const dates = getDateRange(yearMonth);
    const currentDate = getCurrentDate();
    
    // Filter: hanya hari yang sudah lewat dan bukan hari libur
    return dates.filter(date => date <= currentDate && !isHoliday(date)).length;
};

// Function untuk mendapatkan tanggal-tanggal hari kerja
const getWorkingDateRange = (yearMonth) => {
    const dates = getDateRange(yearMonth);
    const currentDate = getCurrentDate();
    
    // Filter: hanya hari yang sudah lewat dan bukan hari libur
    return dates.filter(date => date <= currentDate && !isHoliday(date));
};

                // Function to get Juz from page range
                const getJuzFromPages = (startPage, endPage) => {
                    if (!startPage || !endPage) return '';
                    
                    const start = parseInt(startPage);
                    const end = parseInt(endPage);
                    
                    // Find juz for start page
                    const startJuz = juzMapping.value.find(juz => start >= juz.startPage && start <= juz.endPage);
                    // Find juz for end page
                    const endJuz = juzMapping.value.find(juz => end >= juz.startPage && end <= juz.endPage);
                    
                    if (startJuz && endJuz) {
                        if (startJuz.number === endJuz.number) {
                            return `Juz ${startJuz.number}`;
                        } else {
                            return `Juz ${startJuz.number} - ${endJuz.number}`;
                        }
                    }
                    
                    return '';
                };

                const getCurrentDateString = () => {
                    const jakarta = getJakartaDate();
                    return jakarta.toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                };

                const formatDate = (dateString) => {
                    const date = new Date(dateString + 'T00:00:00.000Z');
                    return date.toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                };

                const formatDateShort = (dateString) => {
                    const date = new Date(dateString + 'T00:00:00.000Z');
                    return date.toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short'
                    });
                };

                const formatDayName = (dateString) => {
                    const date = new Date(dateString + 'T00:00:00.000Z');
                    return date.toLocaleDateString('id-ID', {
                        weekday: 'short'
                    });
                };

                // Navigation functions
                const navigateDate = (direction) => {
                    const currentDate = new Date(selectedDate.value);
                    currentDate.setDate(currentDate.getDate() + direction);
                    selectedDate.value = currentDate.toISOString().split('T')[0];
                };

                const resetToToday = () => {
                    selectedDate.value = getCurrentDate();
                };

                // ==================== IMPROVED SUPABASE FUNCTIONS ====================
                const initializeSupabase = async () => {
                    try {
                        console.log('🔗 Initializing Supabase connection...');
                        connectionStatus.value = 'connecting';
                        
                        supabaseClient.value = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);
                        
                        // Test connection immediately
                        const connected = await testConnection();
                        if (connected) {
                            await loadDataFromSupabase();
                            setupRealtimeSubscriptions();
                            console.log('✅ Supabase initialized successfully');
                            return true;
                        } else {
                            console.error('❌ Failed to connect to Supabase');
                            return false;
                        }
                    } catch (error) {
                        console.error('❌ Error initializing Supabase:', error);
                        connectionStatus.value = 'disconnected';
                        return false;
                    }
                };

                const testConnection = async () => {
                    if (!supabaseClient.value) return false;
                    
                    try {
                        // Test dengan query sederhana
                        const { error } = await supabaseClient.value
                            .from('musyrif')
                            .select('count')
                            .limit(1);
                        
                        if (error && !error.message.includes('does not exist')) {
                            console.error('Connection test failed:', error);
                            connectionStatus.value = 'disconnected';
                            return false;
                        }
                        
                        connectionStatus.value = 'connected';
                        return true;
                        
                    } catch (error) {
                        console.error('Connection test error:', error);
                        connectionStatus.value = 'disconnected';
                        return false;
                    }
                };

                const setupRealtimeSubscriptions = () => {
                    if (!supabaseClient.value || connectionStatus.value !== 'connected') return;

                    console.log('🔄 Setting up realtime subscriptions...');

                    // Subscribe to all table changes
                    supabaseClient.value
                        .channel('all_changes')
                        .on('postgres_changes', { event: '*', schema: 'public', table: 'musyrif' }, () => {
                            console.log('🔄 Musyrif data changed, reloading...');
                            loadDataFromSupabase();
                        })
                        .on('postgres_changes', { event: '*', schema: 'public', table: 'santri' }, () => {
                            console.log('🔄 Santri data changed, reloading...');
                            loadDataFromSupabase();
                        })
                        .on('postgres_changes', { event: '*', schema: 'public', table: 'tahfizh_progress' }, () => {
                            console.log('🔄 Tahfizh progress changed, reloading...');
                            loadDataFromSupabase();
                        })
                        .on('postgres_changes', { event: '*', schema: 'public', table: 'ibadah_progress' }, () => {
                            console.log('🔄 Ibadah progress changed, reloading...');
                            loadDataFromSupabase();
                        })
                        .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance_progress' }, () => {
                            console.log('🔄 Attendance progress changed, reloading...');
                            loadDataFromSupabase();
                        })
                        .subscribe();
                };

                // IMPROVED: Dedicated function to load data from Supabase
                const loadDataFromSupabase = async () => {
                    if (!supabaseClient.value || connectionStatus.value !== 'connected') return;

                    try {
                        console.log('📥 Loading data from Supabase...');

                        // Load musyrif data
                        const { data: musyrifData, error: musyrifError } = await supabaseClient.value
                            .from('musyrif')
                            .select('*')
                            .eq('is_active', true);
                        
                        if (!musyrifError && musyrifData && musyrifData.length > 0) {
                            musyrifList.value = musyrifData.map(item => ({
                                id: item.id,
                                name: item.name,
                                username: item.username,
                                password: item.password,
                                isActive: item.is_active !== false
                            }));
                            console.log(`📥 Loaded ${musyrifData.length} musyrif records`);
                        }

                        // Load santri data
                        const { data: santriData, error: santriError } = await supabaseClient.value
                            .from('santri')
                            .select('*')
                            .eq('is_active', true);
                        
                        if (!santriError && santriData && santriData.length > 0) {
                            santriList.value = santriData.map(item => ({
                                id: item.id,
                                name: item.name,
                                angkatan: item.angkatan,
                                musyrifId: item.musyrif_id,
                                isActive: item.is_active !== false
                            }));
                            console.log(`📥 Loaded ${santriData.length} santri records`);
                        }

                        // Load tahfizh progress
                        await loadTahfizhProgress();
                        
                        // Load ibadah progress
                        await loadIbadahProgress();
                        
                        // Load attendance progress
                        await loadAttendanceProgress();

                        console.log('✅ All data loaded from Supabase');
                        
                    } catch (error) {
                        console.error('❌ Error loading data from Supabase:', error);
                    }
                };

                const loadTahfizhProgress = async () => {
                try {
                    const { data: tahfizhData, error } = await supabaseClient.value
                        .from('tahfizh_progress')
                        .select('*')
                        .order('date', { ascending: false })
                        .limit(1000);
                    
                    if (!error && tahfizhData && tahfizhData.length > 0) {
                        const newTahfizhProgress = {};
                        tahfizhData.forEach(item => {
                            if (!newTahfizhProgress[item.santri_id]) {
                                newTahfizhProgress[item.santri_id] = {};
                            }
                            newTahfizhProgress[item.santri_id][item.date] = {
                                date: item.date,
                                // PERBAIKAN: Handle null values dengan benar
                                startPage: item.start_page !== null ? item.start_page : null,
                                endPage: item.end_page !== null ? item.end_page : null,
                                murojaahJuz: item.murojaah_juz || 0,
                                exam: item.exam || null,
                                timestamp: item.timestamp || item.created_at
                            };
                        });
                        tahfizhProgress.value = newTahfizhProgress;
                        console.log(`📥 Loaded ${tahfizhData.length} tahfizh progress records`);
                    }
                } catch (error) {
                    console.error('Error loading tahfizh progress:', error);
                }
            };

                const loadIbadahProgress = async () => {
                    try {
                        const { data: ibadahData, error } = await supabaseClient.value
                            .from('ibadah_progress')
                            .select('*')
                            .order('date', { ascending: false })
                            .limit(1000);
                        
                        if (!error && ibadahData && ibadahData.length > 0) {
                            const newIbadahProgress = {};
                            ibadahData.forEach(item => {
                                if (!newIbadahProgress[item.santri_id]) {
                                    newIbadahProgress[item.santri_id] = {};
                                }
                                
                                // Use individual columns first, fallback to JSONB
                                let dayProgress = {};
                                
                                if (item.ql !== null || item.sholat !== null) {
                                    dayProgress = {
                                        ql: item.ql || false,
                                        sholat: item.sholat || false,
                                        matsurat: item.matsurat || false,
                                        piket: item.piket || false,
                                        dirosah: item.dirosah || false,
                                        olahraga: item.olahraga || false,
                                        lima_s: item.lima_s || false,
                                        baca: item.baca || false,
                                        murojaahsholat: item.murojaahsholat || false,
                                        sedekah: item.sedekah || false,
                                        timestamp: item.created_at
                                    };
                                } else if (item.progress_data) {
                                    try {
                                        dayProgress = JSON.parse(item.progress_data);
                                    } catch (e) {
                                        console.error('Error parsing ibadah progress_data:', e);
                                        dayProgress = {};
                                    }
                                }
                                
                                newIbadahProgress[item.santri_id][item.date] = dayProgress;
                            });
                            ibadahProgress.value = newIbadahProgress;
                            console.log(`📥 Loaded ${ibadahData.length} ibadah progress records`);
                        }
                    } catch (error) {
                        console.error('Error loading ibadah progress:', error);
                    }
                };

                const loadAttendanceProgress = async () => {
                    try {
                        const { data: attendanceData, error } = await supabaseClient.value
                            .from('attendance_progress')
                            .select('*')
                            .order('date', { ascending: false })
                            .limit(1000);
                        
                        if (!error && attendanceData && attendanceData.length > 0) {
                            const newAttendanceProgress = {};
                            attendanceData.forEach(item => {
                                if (!newAttendanceProgress[item.santri_id]) {
                                    newAttendanceProgress[item.santri_id] = {};
                                }
                                
                                // Use individual columns first, fallback to JSONB
                                let dayProgress = {};
                                
                                if (item.halaqah_1 || item.halaqah_2 || item.halaqah_3) {
                                    dayProgress = {
                                        halaqah_1: item.halaqah_1 || 'tanpa_keterangan',
                                        halaqah_2: item.halaqah_2 || 'tanpa_keterangan',
                                        halaqah_3: item.halaqah_3 || 'tanpa_keterangan',
                                        timestamp: item.timestamp || item.created_at
                                    };
                                } else if (item.attendance_data) {
                                    try {
                                        dayProgress = JSON.parse(item.attendance_data);
                                    } catch (e) {
                                        console.error('Error parsing attendance_data:', e);
                                        dayProgress = {};
                                    }
                                }
                                
                                newAttendanceProgress[item.santri_id][item.date] = dayProgress;
                            });
                            attendanceProgress.value = newAttendanceProgress;
                            console.log(`📥 Loaded ${attendanceData.length} attendance progress records`);
                        }
                    } catch (error) {
                        console.error('Error loading attendance progress:', error);
                    }
                };

                // IMPROVED: Save functions with proper error handling and conflict resolution
                const saveMusyrifToSupabase = async (musyrifData) => {
                    if (!supabaseClient.value || connectionStatus.value !== 'connected') return false;

                    try {
                        const dataToSave = {
                            id: musyrifData.id,
                            name: musyrifData.name,
                            username: musyrifData.username,
                            password: musyrifData.password,
                            is_active: musyrifData.isActive !== false,
                            updated_at: new Date().toISOString()
                        };

                        const { error } = await supabaseClient.value
                            .from('musyrif')
                            .upsert(dataToSave, {
                                onConflict: 'id'
                            });

                        if (error) {
                            console.error('Error saving musyrif to Supabase:', error);
                            return false;
                        }

                        console.log('✅ Musyrif saved to Supabase:', musyrifData.name);
                        return true;
                    } catch (error) {
                        console.error('Error saving musyrif to Supabase:', error);
                        return false;
                    }
                };

                const saveSantriToSupabase = async (santriData) => {
                    if (!supabaseClient.value || connectionStatus.value !== 'connected') return false;

                    try {
                        const dataToSave = {
                            id: santriData.id,
                            name: santriData.name,
                            angkatan: santriData.angkatan,
                            musyrif_id: santriData.musyrifId,
                            is_active: santriData.isActive !== false,
                            updated_at: new Date().toISOString()
                        };

                        const { error } = await supabaseClient.value
                            .from('santri')
                            .upsert(dataToSave, {
                                onConflict: 'id'
                            });

                        if (error) {
                            console.error('Error saving santri to Supabase:', error);
                            return false;
                        }

                        console.log('✅ Santri saved to Supabase:', santriData.name);
                        return true;
                    } catch (error) {
                        console.error('Error saving santri to Supabase:', error);
                        return false;
                    }
                };

                // IMPROVED: Soft delete functions
                const softDeleteMusyrif = async (musyrifId) => {
                    if (!supabaseClient.value || connectionStatus.value !== 'connected') return false;

                    try {
                        const { error } = await supabaseClient.value
                            .from('musyrif')
                            .update({ 
                                is_active: false,
                                updated_at: new Date().toISOString()
                            })
                            .eq('id', musyrifId);

                        if (error) {
                            console.error('Error soft deleting musyrif:', error);
                            return false;
                        }

                        console.log('✅ Musyrif soft deleted from Supabase:', musyrifId);
                        return true;
                    } catch (error) {
                        console.error('Error soft deleting musyrif:', error);
                        return false;
                    }
                };

                const softDeleteSantri = async (santriId) => {
                    if (!supabaseClient.value || connectionStatus.value !== 'connected') return false;

                    try {
                        const { error } = await supabaseClient.value
                            .from('santri')
                            .update({ 
                                is_active: false,
                                updated_at: new Date().toISOString()
                            })
                            .eq('id', santriId);

                        if (error) {
                            console.error('Error soft deleting santri:', error);
                            return false;
                        }

                        console.log('✅ Santri soft deleted from Supabase:', santriId);
                        return true;
                    } catch (error) {
                        console.error('Error soft deleting santri:', error);
                        return false;
                    }
                };

                // ==================== COMPUTED PROPERTIES ====================
                const totalSantri = computed(() => santriList.value.filter(s => s.isActive !== false).length);
                const totalMusyrif = computed(() => musyrifList.value.filter(m => m.isActive !== false).length);

                const averageProgress = computed(() => {
                    const activeSantri = santriList.value.filter(s => s.isActive !== false);
                    if (activeSantri.length === 0) return 0;
                    const total = activeSantri.reduce((sum, santri) => sum + getSantriCurrentJuz(santri.id), 0);
                    return Math.round(total / activeSantri.length);
                });

                const todayAttendancePercentage = computed(() => {
                    const today = getCurrentDate();
                    const activeSantri = santriList.value.filter(s => s.isActive !== false);
                    let totalAttendance = 0;
                    let count = 0;
                    
                    activeSantri.forEach(santri => {
                        const attendance = getDailyAttendancePercentage(santri.id, today);
                        totalAttendance += attendance;
                        count++;
                    });
                    
                    return count > 0 ? Math.round(totalAttendance / count) : 0;
                });

                const availableMonths = computed(() => getAvailableMonths());

                const mySantri = computed(() => {
                    if (!currentUser.value || !isMusyrif.value) return [];
                    return santriList.value.filter(santri => 
                        santri.musyrifId === currentUser.value.id && santri.isActive !== false
                    );
                });

                const uniqueAngkatanList = computed(() => {
                    const angkatanSet = new Set();
                    santriList.value.filter(s => s.isActive !== false).forEach(santri => {
                        if (santri.angkatan != null && santri.angkatan !== '') {
                            angkatanSet.add(santri.angkatan);
                        }
                    });
                    return Array.from(angkatanSet).sort((a, b) => a - b);
                });

                const filteredSantri = computed(() => {
                    let filtered = santriList.value.filter(s => s.isActive !== false);
                    
                    if (santriFilter.angkatan) {
                        filtered = filtered.filter(santri => santri.angkatan === parseInt(santriFilter.angkatan));
                    }
                    
                    if (santriFilter.musyrif) {
                        filtered = filtered.filter(santri => santri.musyrifId === santriFilter.musyrif);
                    }
                    
                    if (santriFilter.search) {
                        filtered = filtered.filter(santri => 
                            santri.name.toLowerCase().includes(santriFilter.search.toLowerCase())
                        );
                    }
                    
                    return filtered;
                });

                const filteredSantriForRecap = computed(() => {
                    let filtered = santriList.value.filter(s => s.isActive !== false);
                    
                    if (tahfizhFilter.angkatan) {
                        filtered = filtered.filter(santri => santri.angkatan === parseInt(tahfizhFilter.angkatan));
                    }
                    
                    if (tahfizhFilter.musyrif) {
                        filtered = filtered.filter(santri => santri.musyrifId === tahfizhFilter.musyrif);
                    }
                    
                    // Sort
                    switch (tahfizhFilter.sort) {
                        case 'progress':
                            filtered.sort((a, b) => getSantriProgressPage(b.id) - getSantriProgressPage(a.id));
                            break;
                        case 'name':
                            filtered.sort((a, b) => a.name.localeCompare(b.name));
                            break;
                        case 'angkatan':
                            filtered.sort((a, b) => a.angkatan - b.angkatan);
                            break;
                    }
                    
                    return filtered;
                });

                const filteredSantriForIbadah = computed(() => {
                    let filtered = santriList.value.filter(s => s.isActive !== false);
                    
                    if (ibadahFilter.angkatan) {
                        filtered = filtered.filter(santri => santri.angkatan === parseInt(ibadahFilter.angkatan));
                    }
                    
                    if (ibadahFilter.musyrif) {
                        filtered = filtered.filter(santri => santri.musyrifId === ibadahFilter.musyrif);
                    }
                    
                    return filtered;
                });

                const filteredSantriForAttendance = computed(() => {
                    let filtered = isMusyrif.value ? mySantri.value : santriList.value.filter(s => s.isActive !== false);
                    
                    if (attendanceFilter.angkatan) {
                        filtered = filtered.filter(santri => santri.angkatan === parseInt(attendanceFilter.angkatan));
                    }
                    
                    if (attendanceFilter.musyrif && isAdmin.value) {
                        filtered = filtered.filter(santri => santri.musyrifId === attendanceFilter.musyrif);
                    }
                    
                    return filtered;
                });

                const isSantriFormValid = computed(() => {
                    return santriForm.name.trim() && santriForm.angkatan && santriForm.musyrifId;
                });

                const isMusyrifFormValid = computed(() => {
                    if (!musyrifForm.name.trim() || !musyrifForm.username.trim()) return false;
                    if (!editingMusyrif.value && !musyrifForm.password.trim()) return false;
                    if (!editingMusyrif.value) {
                        const existing = musyrifList.value.find(m => 
                            m.username === musyrifForm.username.trim() && m.isActive !== false
                        );
                        if (existing) return false;
                    }
                    return true;
                });

                // Connection status computed
                const connectionStatusClass = computed(() => {
                    switch (connectionStatus.value) {
                        case 'connected': return 'status-connected';
                        case 'connecting': return 'status-connecting';
                        default: return 'status-disconnected';
                    }
                });

                const connectionStatusIcon = computed(() => {
                    switch (connectionStatus.value) {
                        case 'connected': return 'fas fa-wifi';
                        case 'connecting': return 'fas fa-spinner fa-spin';
                        default: return 'fas fa-wifi-slash';
                    }
                });

                const connectionStatusText = computed(() => {
                    switch (connectionStatus.value) {
                        case 'connected': return 'Terhubung';
                        case 'connecting': return 'Menghubungkan...';
                        default: return 'Tidak Terhubung';
                    }
                });

                // ==================== GENERAL METHODS ====================
                const toggleDarkMode = () => {
                    darkMode.value = !darkMode.value;
                    
                    if (darkMode.value) {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                    
                    localStorage.setItem('darkMode', darkMode.value.toString());
                };

                const showNotification = (message, type = 'info', duration = 5000) => {
                    const id = Date.now() + Math.random();
                    const notification = { id, message, type };
                    
                    notifications.value.push(notification);
                    
                    if (duration > 0) {
                        setTimeout(() => removeNotification(id), duration);
                    }
                    
                    return id;
                };

                const removeNotification = (id) => {
                    const index = notifications.value.findIndex(n => n.id === id);
                    if (index > -1) {
                        notifications.value.splice(index, 1);
                    }
                };

                const getNotificationClass = (type) => {
                    const classes = {
                        'success': 'bg-green-500 text-white',
                        'error': 'bg-red-500 text-white',
                        'info': 'bg-blue-500 text-white',
                        'warning': 'bg-yellow-500 text-white'
                    };
                    return classes[type] || classes.info;
                };

                const getNotificationIcon = (type) => {
                    const icons = {
                        'success': 'fas fa-check-circle',
                        'error': 'fas fa-exclamation-circle',
                        'info': 'fas fa-info-circle',
                        'warning': 'fas fa-exclamation-triangle'
                    };
                    return icons[type] || icons.info;
                };
const getTodayProgressSummary = (santriId) => {
    const today = getCurrentDate();
    const todayData = tahfizhProgress.value[santriId]?.[today];
    
    if (!todayData) return null;
    
    return {
        hasPages: todayData.startPage && todayData.endPage,
        pageRange: todayData.startPage && todayData.endPage ? 
            `${todayData.startPage}-${todayData.endPage}` : null,
        murojaahJuz: todayData.murojaahJuz || 0,
        exam: todayData.exam || null,
        canAddMore: true // Selalu bisa tambah murojaah/ujian
    };
};

const getPageInputValidation = (santriId) => {
    const input = tahfizhInput.value[santriId];
    if (!input) return { valid: true, message: '' };
    
    if (input.startPage && input.endPage) {
        const start = parseInt(input.startPage);
        const end = parseInt(input.endPage);
        
        if (start > end) {
            return { valid: false, message: 'Halaman awal harus ≤ halaman akhir' };
        }
        if (start < 1 || end > 604) {
            return { valid: false, message: 'Halaman harus antara 1-604' };
        }
        
        // Cek apakah progress ini lebih rendah dari progress terakhir
        const currentMax = getSantriProgressPage(santriId);
        if (end < currentMax) {
            return { 
                valid: true, 
                message: `⚠️ Progress ini (${end}) lebih rendah dari terakhir (${currentMax})` 
            };
        }
    }
    
    return { valid: true, message: '' };
};
                // ==================== AUTHENTICATION ====================
                const login = async () => {
                    loginError.value = '';
                    
                    // Check admin
                    const admin = adminUsers.value.find(user => 
                        user.username === credentials.username && 
                        user.password === credentials.password
                    );
                    
                    if (admin) {
                        isLoggingIn.value = true;
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        
                        currentUser.value = admin;
                        isAdmin.value = true;
                        isMusyrif.value = false;
                        isLoggedIn.value = true;
                        isLoggingIn.value = false;
                        activeTab.value = 'admin-dashboard';
                        return;
                    }
                    
                    // Check musyrif
                    const musyrif = musyrifList.value.find(user => 
                        user.username === credentials.username && 
                        user.password === credentials.password &&
                        user.isActive !== false
                    );
                    
                    if (musyrif) {
                        isLoggingIn.value = true;
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        
                        currentUser.value = musyrif;
                        isAdmin.value = false;
                        isMusyrif.value = true;
                        isLoggedIn.value = true;
                        isLoggingIn.value = false;
                        activeTab.value = 'tahfizh-input';
                        return;
                    }
                    
                    loginError.value = 'Username atau password salah';
                };

                const logout = () => {
                    isLoggedIn.value = false;
                    isAdmin.value = false;
                    isMusyrif.value = false;
                    isPublicAccess.value = false;
                    currentUser.value = null;
                    credentials.username = '';
                    credentials.password = '';
                    activeTab.value = 'admin-dashboard';
                    loginError.value = '';
                };

                const accessPublic = () => {
                    isPublicAccess.value = true;
                    isLoggedIn.value = false;
                };

                const backToLogin = () => {
                    isPublicAccess.value = false;
                };

                // ==================== SANTRI MANAGEMENT ====================
                const openSantriModal = (santri = null) => {
                    editingSantri.value = santri;
                    if (santri) {
                        santriForm.name = santri.name;
                        santriForm.angkatan = santri.angkatan;
                        santriForm.musyrifId = santri.musyrifId;
                    } else {
                        Object.assign(santriForm, {
                            name: '',
                            angkatan: '',
                            musyrifId: ''
                        });
                    }
                    showSantriModal.value = true;
                };

                const closeSantriModal = () => {
                    showSantriModal.value = false;
                    editingSantri.value = null;
                    Object.assign(santriForm, {
                        name: '',
                        angkatan: '',
                        musyrifId: ''
                    });
                };

                const saveSantri = async () => {
                    if (!isSantriFormValid.value) {
                        showNotification('Lengkapi semua field yang diperlukan', 'error');
                        return;
                    }

                    isSubmitting.value = true;

                    try {
                        let santriData;
                        
                        if (editingSantri.value) {
                            // Update existing santri
                            const index = santriList.value.findIndex(s => s.id === editingSantri.value.id);
                            if (index !== -1) {
                                santriData = {
                                    ...santriList.value[index],
                                    name: santriForm.name.trim(),
                                    angkatan: santriForm.angkatan,
                                    musyrifId: santriForm.musyrifId
                                };
                                santriList.value[index] = santriData;
                            }
                        } else {
                            // Create new santri
                            santriData = {
                                id: 'santri-' + Date.now(),
                                name: santriForm.name.trim(),
                                angkatan: santriForm.angkatan,
                                musyrifId: santriForm.musyrifId,
                                isActive: true
                            };
                            santriList.value.push(santriData);
                        }

                        // Save to Supabase
                        const success = await saveSantriToSupabase(santriData);
                        if (success) {
                            showNotification(
                                editingSantri.value ? 'Data santri berhasil diupdate' : 'Santri baru berhasil ditambahkan', 
                                'success'
                            );
                        } else {
                            showNotification('Data tersimpan lokal, akan disinkronisasi nanti', 'warning');
                        }

                        closeSantriModal();
                        
                    } catch (error) {
                        console.error('Error saving santri:', error);
                        showNotification('Gagal menyimpan data santri', 'error');
                    } finally {
                        isSubmitting.value = false;
                    }
                };

                const editSantri = (santri) => {
                    openSantriModal(santri);
                };

                const deleteSantri = async (santriId) => {
                    if (!confirm('Apakah Anda yakin ingin menghapus santri ini?')) return;

                    try {
                        // Soft delete in local state
                        const index = santriList.value.findIndex(s => s.id === santriId);
                        if (index !== -1) {
                            santriList.value[index].isActive = false;
                        }

                        // Soft delete in Supabase
                        const success = await softDeleteSantri(santriId);
                        if (success) {
                            showNotification('Santri berhasil dihapus', 'success');
                        } else {
                            showNotification('Data dihapus lokal, akan disinkronisasi nanti', 'warning');
                        }

                    } catch (error) {
                        console.error('Error deleting santri:', error);
                        showNotification('Gagal menghapus santri', 'error');
                    }
                };

                // ==================== MUSYRIF MANAGEMENT ====================
                const openMusyrifModal = (musyrif = null) => {
                    editingMusyrif.value = musyrif;
                    if (musyrif) {
                        musyrifForm.name = musyrif.name;
                        musyrifForm.username = musyrif.username;
                        musyrifForm.password = '';
                    } else {
                        Object.assign(musyrifForm, {
                            name: '',
                            username: '',
                            password: ''
                        });
                    }
                    showMusyrifModal.value = true;
                };

                const closeMusyrifModal = () => {
                    showMusyrifModal.value = false;
                    editingMusyrif.value = null;
                    Object.assign(musyrifForm, {
                        name: '',
                        username: '',
                        password: ''
                    });
                };

                const saveMusyrif = async () => {
                    if (!isMusyrifFormValid.value) {
                        showNotification('Lengkapi form dengan benar', 'error');
                        return;
                    }

                    isSubmitting.value = true;

                    try {
                        let musyrifData;
                        
                        if (editingMusyrif.value) {
                            // Update existing musyrif
                            const index = musyrifList.value.findIndex(m => m.id === editingMusyrif.value.id);
                            if (index !== -1) {
                                musyrifData = {
                                    ...musyrifList.value[index],
                                    name: musyrifForm.name.trim()
                                };

                                if (musyrifForm.password.trim()) {
                                    musyrifData.password = musyrifForm.password.trim();
                                }
                                
                                musyrifList.value[index] = musyrifData;
                            }
                        } else {
                            // Create new musyrif
                            musyrifData = {
                                id: 'mus-' + Date.now(),
                                name: musyrifForm.name.trim(),
                                username: musyrifForm.username.trim(),
                                password: musyrifForm.password.trim(),
                                isActive: true
                            };
                            musyrifList.value.push(musyrifData);
                        }

                        // Save to Supabase
                        const success = await saveMusyrifToSupabase(musyrifData);
                        if (success) {
                            showNotification(
                                editingMusyrif.value ? 'Data musyrif berhasil diupdate' : 'Musyrif baru berhasil ditambahkan', 
                                'success'
                            );
                        } else {
                            showNotification('Data tersimpan lokal, akan disinkronisasi nanti', 'warning');
                        }

                        closeMusyrifModal();
                        
                    } catch (error) {
                        console.error('Error saving musyrif:', error);
                        showNotification('Gagal menyimpan data musyrif', 'error');
                    } finally {
                        isSubmitting.value = false;
                    }
                };

                const editMusyrif = (musyrif) => {
                    openMusyrifModal(musyrif);
                };

                const deleteMusyrif = async (musyrifId) => {
                    if (!confirm('Apakah Anda yakin ingin menghapus musyrif ini?')) return;

                    try {
                        // Soft delete in local state
                        const index = musyrifList.value.findIndex(m => m.id === musyrifId);
                        if (index !== -1) {
                            musyrifList.value[index].isActive = false;
                        }

                        // Soft delete in Supabase
                        const success = await softDeleteMusyrif(musyrifId);
                        if (success) {
                            showNotification('Musyrif berhasil dihapus', 'success');
                        } else {
                            showNotification('Data dihapus lokal, akan disinkronisasi nanti', 'warning');
                        }

                    } catch (error) {
                        console.error('Error deleting musyrif:', error);
                        showNotification('Gagal menghapus musyrif', 'error');
                    }
                };

                // ==================== HELPER FUNCTIONS ====================
                const getMusyrifName = (musyrifId) => {
                    const musyrif = musyrifList.value.find(m => m.id === musyrifId && m.isActive !== false);
                    return musyrif ? musyrif.name : 'Unknown';
                };

                const getSantriByMusyrif = (musyrifId) => {
                    return santriList.value.filter(santri => 
                        santri.musyrifId === musyrifId && santri.isActive !== false
                    );
                };

                const getAngkatanCount = (angkatan) => {
                    return santriList.value.filter(santri => 
                        santri.angkatan === angkatan && santri.isActive !== false
                    ).length;
                };

                const getAngkatanAverageProgressJuz = (angkatan) => {
                    const santriAngkatan = santriList.value.filter(santri => 
                        santri.angkatan === angkatan && santri.isActive !== false
                    );
                    if (santriAngkatan.length === 0) return 0;
                    const total = santriAngkatan.reduce((sum, santri) => sum + getSantriCurrentJuz(santri.id), 0);
                    return Math.round(total / santriAngkatan.length);
                };

                const getAngkatanAverageProgressPercentage = (angkatan) => {
                    const santriAngkatan = santriList.value.filter(santri => 
                        santri.angkatan === angkatan && santri.isActive !== false
                    );
                    if (santriAngkatan.length === 0) return 0;
                    const total = santriAngkatan.reduce((sum, santri) => sum + getSantriProgressPercentage(santri.id), 0);
                    return Math.round(total / santriAngkatan.length);
                };

                // ==================== PROGRESS FUNCTIONS ====================
                const getSantriProgressPage = (santriId) => {
                    const progress = tahfizhProgress.value[santriId];
                    if (!progress) return 0;
                    
                    let maxPage = 0;
                    Object.values(progress).forEach(dayProgress => {
                        // PERBAIKAN: Hanya hitung halaman yang valid dan bukan null
                        if (dayProgress.endPage && 
                            dayProgress.endPage !== null && 
                            dayProgress.endPage !== undefined && 
                            dayProgress.startPage && 
                            dayProgress.startPage !== null && 
                            dayProgress.startPage !== undefined &&
                            dayProgress.endPage > maxPage) {
                            maxPage = dayProgress.endPage;
                        }
                    });
                    
                    return maxPage;
                };

                const getSantriCurrentJuz = (santriId) => {
                    const page = getSantriProgressPage(santriId);
                    if (page === 0) return 0;
                    
                    // Find which juz this page belongs to
                    for (let i = 0; i < juzMapping.value.length; i++) {
                        const juz = juzMapping.value[i];
                        if (page >= juz.startPage && page <= juz.endPage) {
                            return juz.number;
                        }
                    }
                    
                    // If page exceeds all juz, return 30
                    if (page > 604) return 30;
                    
                    return Math.ceil(page / 20.13); // Approximate calculation if not found
                };

                const getSantriProgressPercentage = (santriId) => {
                    const page = getSantriProgressPage(santriId);
                    return Math.round((page / 604) * 100);
                };

                const getMonthlySetoranPages = (santriId) => {
                    const progress = tahfizhProgress.value[santriId];
                    if (!progress) return 0;
                    
                    const dates = getDateRange(tahfizhFilter.month);
                    let totalPages = 0;
                    
                    dates.forEach(date => {
                        const dayProgress = progress[date];
                        // Pastikan ada halaman yang valid dan bukan null
                        if (dayProgress && 
                            dayProgress.startPage && 
                            dayProgress.endPage && 
                            dayProgress.startPage !== null && 
                            dayProgress.endPage !== null) {
                            totalPages += (dayProgress.endPage - dayProgress.startPage + 1);
                        }
                    });
                    
                    return totalPages;
                };

                const getMonthlyMurojaahTotal = (santriId) => {
                    const progress = tahfizhProgress.value[santriId];
                    if (!progress) return 0;
                    
                    const dates = getDateRange(tahfizhFilter.month);
                    let totalJuz = 0;
                    
                    dates.forEach(date => {
                        const dayProgress = progress[date];
                        if (dayProgress && dayProgress.murojaahJuz) {
                            totalJuz += dayProgress.murojaahJuz;
                        }
                    });
                    
                    return totalJuz;
                };

                const getMonthlyExamCount = (santriId) => {
                    const progress = tahfizhProgress.value[santriId];
                    if (!progress) return 0;
                    
                    const dates = getDateRange(tahfizhFilter.month);
                    let examCount = 0;
                    
                    dates.forEach(date => {
                        const dayProgress = progress[date];
                        if (dayProgress && dayProgress.exam && dayProgress.exam.trim()) {
                            examCount++;
                        }
                    });
                    
                    return examCount;
                };

                const getLatestExam = (santriId) => {
                    const progress = tahfizhProgress.value[santriId];
                    if (!progress) return null;
                    
                    const dates = getDateRange(tahfizhFilter.month).reverse(); // Latest first
                    
                    for (const date of dates) {
                        const dayProgress = progress[date];
                        if (dayProgress && dayProgress.exam && dayProgress.exam.trim()) {
                            return dayProgress.exam;
                        }
                    }
                    
                    return null;
                };

                const initializeTahfizhInput = () => {
                    mySantri.value.forEach(santri => {
                        if (!tahfizhInput.value[santri.id]) {
                            tahfizhInput.value[santri.id] = {
                                startPage: '',
                                endPage: '',
                                murojaahJuz: 0,
                                exam: ''
                            };
                        }
                    });
                };

                const canSaveTahfizh = (santriId) => {
                const input = tahfizhInput.value[santriId];
                if (!input) return false;
                
                // PERBAIKAN: Cek input halaman
                const hasPageInput = input.startPage && input.endPage;
                
                // PERBAIKAN: Validasi halaman jika diisi
                if (hasPageInput) {
                    const start = parseInt(input.startPage);
                    const end = parseInt(input.endPage);
                    if (start > end || start < 1 || end > 604) return false;
                }
                
                // PERBAIKAN: Validasi input halaman parsial (hanya salah satu yang diisi)
                const hasPartialPageInput = (input.startPage && !input.endPage) || (!input.startPage && input.endPage);
                if (hasPartialPageInput) return false;
                
                // PERBAIKAN: Cek input murojaah atau ujian
                const hasMurojaah = input.murojaahJuz && parseInt(input.murojaahJuz) > 0;
                const hasExam = input.exam && input.exam.trim();
                
                // PERBAIKAN: Valid jika ada halaman lengkap ATAU murojaah ATAU ujian
                return hasPageInput || hasMurojaah || hasExam;
            };

                const saveTahfizhProgress = async (santriId) => {
                const input = tahfizhInput.value[santriId];
                const today = getCurrentDate();
                
                if (!tahfizhProgress.value[santriId]) {
                    tahfizhProgress.value[santriId] = {};
                }
                
                // PERBAIKAN: Ambil data existing hari ini untuk di-merge
                const existingToday = tahfizhProgress.value[santriId][today] || {};
                
                // PERBAIKAN: Merge data dengan lebih hati-hati
                const progressData = {
                    date: today,
                    // PERBAIKAN: Hanya update halaman jika ada input baru
                    startPage: input.startPage && input.endPage ? parseInt(input.startPage) : existingToday.startPage || null,
                    endPage: input.startPage && input.endPage ? parseInt(input.endPage) : existingToday.endPage || null,
                    // PERBAIKAN: Akumulasi murojaah jika ada input
                    murojaahJuz: (parseInt(input.murojaahJuz) || 0) + (existingToday.murojaahJuz || 0),
                    // PERBAIKAN: Update ujian jika ada input baru
                    exam: input.exam && input.exam.trim() ? input.exam.trim() : existingToday.exam || null,
                    timestamp: new Date().toISOString()
                };
                
                // PERBAIKAN: Validasi yang lebih fleksibel
                const hasPageInput = input.startPage && input.endPage;
                const hasMurojaahInput = parseInt(input.murojaahJuz) > 0;
                const hasExamInput = input.exam && input.exam.trim();
                const hasValidData = hasPageInput || hasMurojaahInput || hasExamInput;
                
                if (!hasValidData) {
                    showNotification('Tidak ada data untuk disimpan', 'warning');
                    return;
                }
                
                // Simpan ke local state
                tahfizhProgress.value[santriId][today] = progressData;
                
                // Reset form
                tahfizhInput.value[santriId] = {
                    startPage: '',
                    endPage: '',
                    murojaahJuz: 0,
                    exam: ''
                };
                
                // PERBAIKAN: Save to Supabase dengan handling yang lebih baik
                if (supabaseClient.value && connectionStatus.value === 'connected') {
                    try {
                        const dataToSave = {
                            santri_id: santriId,
                            date: today,
                            murojaah_juz: progressData.murojaahJuz || 0, // PERBAIKAN: Selalu simpan murojaah
                            timestamp: progressData.timestamp,
                            musyrif_id: currentUser.value?.id,
                            updated_at: new Date().toISOString()
                        };
                        
                        // PERBAIKAN: Hanya tambahkan field halaman jika tidak null/undefined
                        if (progressData.startPage !== null && progressData.startPage !== undefined) {
                            dataToSave.start_page = progressData.startPage;
                        }
                        if (progressData.endPage !== null && progressData.endPage !== undefined) {
                            dataToSave.end_page = progressData.endPage;
                        }
                        if (progressData.exam) {
                            dataToSave.exam = progressData.exam;
                        }
                        
                        const { error } = await supabaseClient.value
                            .from('tahfizh_progress')
                            .upsert(dataToSave, {
                                onConflict: 'santri_id,date'
                            });
                            
                        if (error) {
                            console.error('Error saving tahfizh progress:', error);
                            showNotification('Tersimpan lokal, akan disinkronisasi nanti', 'warning');
                        } else {
                            showNotification('Progress tahfizh berhasil disimpan', 'success');
                        }
                    } catch (error) {
                        console.error('Error saving tahfizh progress:', error);
                        showNotification('Tersimpan lokal, akan disinkronisasi nanti', 'warning');
                    }
                } else {
                    showNotification('Progress tahfizh tersimpan lokal', 'info');
                }
            };
                const getTodayTahfizhProgress = (santriId) => {
                    const today = getCurrentDate();
                    return tahfizhProgress.value[santriId]?.[today];
                };

                // ==================== IBADAH FUNCTIONS ====================
                const initializeIbadahInput = () => {
                    mySantri.value.forEach(santri => {
                        if (!ibadahInput.value[santri.id]) {
                            ibadahInput.value[santri.id] = {};
                            ibadahList.value.forEach(ibadah => {
                                ibadahInput.value[santri.id][ibadah.key] = false;
                            });
                        }
                        
                        // Load today's ibadah data
                        const today = getCurrentDate();
                        const todayIbadah = ibadahProgress.value[santri.id]?.[today];
                        if (todayIbadah) {
                            ibadahList.value.forEach(ibadah => {
                                ibadahInput.value[santri.id][ibadah.key] = todayIbadah[ibadah.key] || false;
                            });
                        }
                    });
                };

                const toggleIbadah = async (santriId, ibadahKey, date, value) => {
                    // Update local state first (optimistic update)
                    updateLocalIbadah(santriId, ibadahKey, date, value);
                    
                    // Sync to Supabase if connected
                    if (supabaseClient.value && connectionStatus.value === 'connected') {
                        try {
                            const currentData = ibadahProgress.value[santriId]?.[date] || {};
                            
                            const ibadahData = {
                                santri_id: santriId,
                                date: date,
                                ql: currentData.ql || false,
                                sholat: currentData.sholat || false,
                                matsurat: currentData.matsurat || false,
                                piket: currentData.piket || false,
                                dirosah: currentData.dirosah || false,
                                olahraga: currentData.olahraga || false,
                                lima_s: currentData.lima_s || false,
                                baca: currentData.baca || false,
                                murojaahsholat: currentData.murojaahsholat || false,
                                sedekah: currentData.sedekah || false,
                                progress_data: JSON.stringify(currentData),
                                musyrif_id: currentUser.value?.id,
                                updated_at: new Date().toISOString()
                            };
                            
                            // Update the specific field
                            ibadahData[ibadahKey] = value;
                            currentData[ibadahKey] = value;
                            ibadahData.progress_data = JSON.stringify(currentData);
                            
                            const { error } = await supabaseClient.value
                                .from('ibadah_progress')
                                .upsert(ibadahData, {
                                    onConflict: 'santri_id,date'
                                });
                                
                            if (error) {
                                console.error('Error syncing ibadah to Supabase:', error);
                                showNotification('Data tersimpan lokal, akan disinkronisasi nanti', 'warning');
                            }
                        } catch (error) {
                            console.error('Error syncing ibadah to Supabase:', error);
                            showNotification('Data tersimpan lokal, akan disinkronisasi nanti', 'warning');
                        }
                    }
                };

                const updateLocalIbadah = (santriId, ibadahKey, date, value) => {
                    if (!ibadahProgress.value[santriId]) {
                        ibadahProgress.value[santriId] = {};
                    }
                    
                    if (!ibadahProgress.value[santriId][date]) {
                        ibadahProgress.value[santriId][date] = {
                            date: date,
                            timestamp: new Date().toISOString()
                        };
                        
                        // Initialize all ibadah for this date
                        ibadahList.value.forEach(ibadah => {
                            ibadahProgress.value[santriId][date][ibadah.key] = false;
                        });
                    }
                    
                    ibadahProgress.value[santriId][date][ibadahKey] = value;
                    ibadahProgress.value[santriId][date].timestamp = new Date().toISOString();
                };

                const getIbadahCompletion = (santriId, date) => {
                    const dayIbadah = ibadahProgress.value[santriId]?.[date];
                    if (!dayIbadah) return 0;
                    
                    let completed = 0;
                    ibadahList.value.forEach(ibadah => {
                        if (dayIbadah[ibadah.key]) completed++;
                    });
                    
                    return Math.round((completed / ibadahList.value.length) * 100);
                };

                const getCompletedIbadahCount = (santriId, date = null) => {
                    const targetDate = date || getCurrentDate();
                    const dayIbadah = ibadahProgress.value[santriId]?.[targetDate];
                    if (!dayIbadah) return 0;
                    
                    let completed = 0;
                    ibadahList.value.forEach(ibadah => {
                        if (dayIbadah[ibadah.key]) completed++;
                    });
                    
                    return completed;
                };

                const isIbadahCompleted = (santriId, ibadahKey, date) => {
                    return ibadahProgress.value[santriId]?.[date]?.[ibadahKey] || false;
                };

                const getMonthlyIbadahAverage = (santriId) => {
                    const dates = getDateRange(ibadahFilter.month);
                    let totalCompletion = 0;
                    let validDays = 0;
                    
                    dates.forEach(date => {
                        const currentDate = getCurrentDate();
                        if (date <= currentDate) { // Only count days that have passed
                            totalCompletion += getIbadahCompletion(santriId, date);
                            validDays++;
                        }
                    });
                    
                    return validDays > 0 ? Math.round(totalCompletion / validDays) : 0;
                };

                const getMonthlyIbadahDetailBySantri = (santriId, targetMonth = null) => {
                    const month = targetMonth || ibadahFilter.month;
                    const dates = getDateRange(month);
                    const currentDate = getCurrentDate();
                    const validDates = dates.filter(date => date <= currentDate);
                    
                    if (validDates.length === 0) return {};
                    
                    const ibadahDetails = {};
                    
                    // Initialize semua ibadah
                    ibadahList.value.forEach(ibadah => {
                        ibadahDetails[ibadah.key] = {
                            name: ibadah.name,
                            completed: 0,
                            total: validDates.length,
                            percentage: 0
                        };
                    });
                    
                    // Hitung completion untuk setiap ibadah
                    validDates.forEach(date => {
                        const dayIbadah = ibadahProgress.value[santriId]?.[date];
                        if (dayIbadah) {
                            ibadahList.value.forEach(ibadah => {
                                if (dayIbadah[ibadah.key] === true) {
                                    ibadahDetails[ibadah.key].completed++;
                                }
                            });
                        }
                    });
                    
                    // Hitung persentase
                    Object.keys(ibadahDetails).forEach(key => {
                        const detail = ibadahDetails[key];
                        if (detail.total > 0) {
                            detail.percentage = Math.round((detail.completed / detail.total) * 100);
                        }
                    });
                    
                    return ibadahDetails;
                };

                const showIbadahMonthlyDetail = (santriId, targetMonth = null) => {
                    try {
                        const month = targetMonth || ibadahFilter.month;
                        const santri = santriList.value.find(s => s.id === santriId);
                        
                        if (!santri) {
                            showNotification('Santri tidak ditemukan', 'error');
                            return;
                        }
                        
                        const monthLabel = availableMonths.value.find(m => m.value === month)?.label || month;
                        const details = getMonthlyIbadahDetailBySantri(santriId, month);
                        
                        if (Object.keys(details).length === 0) {
                            showNotification(`Tidak ada data ibadah untuk ${santri.name} pada ${monthLabel}`, 'warning');
                            return;
                        }
                        
                        const overallAverage = getMonthlyIbadahAverage(santriId);
                        
                        // Buat array untuk setiap kategori
                        const categories = {
                            excellent: { items: [], label: '✅ Sangat Baik (90-100%)', color: 'success' },
                            good: { items: [], label: '👍 Baik (70-89%)', color: 'info' },
                            fair: { items: [], label: '⚠️ Cukup (50-69%)', color: 'warning' },
                            poor: { items: [], label: '❌ Perlu Perbaikan (0-49%)', color: 'error' }
                        };
                        
                        // Kelompokkan ibadah berdasarkan persentase
                        Object.values(details).forEach(detail => {
                            const item = `${detail.name}: ${detail.percentage}% (${detail.completed}/${detail.total} hari)`;
                            
                            if (detail.percentage >= 90) {
                                categories.excellent.items.push(item);
                            } else if (detail.percentage >= 70) {
                                categories.good.items.push(item);
                            } else if (detail.percentage >= 50) {
                                categories.fair.items.push(item);
                            } else {
                                categories.poor.items.push(item);
                            }
                        });
                        
                        // Buat pesan
                        let message = `📊 Detail Ibadah ${santri.name} - ${monthLabel} | Rata-rata: ${overallAverage}%`;
                        
                        // Tambahkan detail per kategori (hanya yang tidak kosong)
                        Object.values(categories).forEach(category => {
                            if (category.items.length > 0) {
                                message += ` | ${category.label}: ${category.items.join(', ')}`;
                            }
                        });
                        
                        // Tambahkan motivasi
                        let motivation = '';
                        if (overallAverage >= 90) {
                            motivation = ' | 🌟 Masya Allah, prestasi luar biasa!';
                        } else if (overallAverage >= 80) {
                            motivation = ' | 👏 Alhamdulillah, pertahankan!';
                        } else if (overallAverage >= 70) {
                            motivation = ' | 💪 Baik, terus tingkatkan!';
                        } else {
                            motivation = ' | 🤲 Semangat perbaiki amal ibadah!';
                        }
                        
                        message += motivation;
                        
                        // Tentukan tipe notifikasi
                        const notificationType = overallAverage >= 85 ? 'success' : 
                                                overallAverage >= 70 ? 'info' : 
                                                overallAverage >= 50 ? 'warning' : 'error';
                        
                        showNotification(message, notificationType, 20000);
                        
                    } catch (error) {
                        console.error('Error in showIbadahMonthlyDetail:', error);
                        showNotification('Error menampilkan detail ibadah', 'error');
                    }
                };

                const getMonthlyIbadahSummary = () => {
                    const dates = getDateRange(ibadahFilter.month);
                    const currentDate = getCurrentDate();
                    const validDates = dates.filter(date => date <= currentDate);
                    
                    let totalCompletion = 0;
                    let completeDays = 0;
                    let totalSantri = filteredSantriForIbadah.value.length;
                    let bestPerformer = { name: '-', score: 0 };
                    
                    filteredSantriForIbadah.value.forEach(santri => {
                        const monthlyAvg = getMonthlyIbadahAverage(santri.id);
                        totalCompletion += monthlyAvg;
                        
                        if (monthlyAvg > bestPerformer.score) {
                            bestPerformer = { name: santri.name, score: monthlyAvg };
                        }
                        
                        // Count complete days (100%)
                        validDates.forEach(date => {
                            if (getIbadahCompletion(santri.id, date) === 100) {
                                completeDays++;
                            }
                        });
                    });
                    
                    return {
                        averageCompletion: totalSantri > 0 ? Math.round(totalCompletion / totalSantri) : 0,
                        totalDays: validDates.length,
                        completeDays,
                        bestPerformer
                    };
                };

                const openIbadahDetail = (santriId, date) => {
                    try {
                        const completion = getIbadahCompletion(santriId, date);
                        const santri = santriList.value.find(s => s.id === santriId);
                        const formattedDate = formatDate(date);
                        const incompleteIbadah = getIncompleteIbadahList(santriId, date);
                        const completedCount = getCompletedIbadahCount(santriId, date);
                        const totalIbadah = ibadahList.value.length;
                        
                        // Buat pesan dasar
                        let message = `${santri.name} - ${formattedDate} | Progress: ${completion}% (${completedCount}/${totalIbadah} selesai)`;
                        
                        // Tambahkan daftar yang belum dikerjakan
                        if (incompleteIbadah.length > 0) {
                            message += ` | Belum dikerjakan: ${incompleteIbadah.join(', ')}`;
                        } else {
                            message += ` | ✅ Semua ibadah lengkap!`;
                        }
                        
                        // Tentukan tipe notifikasi
                        const notificationType = completion === 100 ? 'success' : 
                                            completion >= 80 ? 'warning' : 
                                            completion >= 50 ? 'info' : 'error';
                        
                        showNotification(message, notificationType, 30000);
                        
                    } catch (error) {
                        console.error('Error in openIbadahDetail:', error);
                        showNotification('Error menampilkan detail ibadah', 'error');
                    }
                };

                const getIncompleteIbadahList = (santriId, date) => {
                    const dayIbadah = ibadahProgress.value[santriId]?.[date];
                    if (!dayIbadah) {
                        // Jika tidak ada data, semua ibadah dianggap tidak dikerjakan
                        return ibadahList.value.map(ibadah => ibadah.name);
                    }
                    
                    const incompleteList = [];
                    ibadahList.value.forEach(ibadah => {
                        if (!dayIbadah[ibadah.key]) {
                            incompleteList.push(ibadah.name);
                        }
                    });
                    
                    return incompleteList;
                };

                // ==================== ATTENDANCE FUNCTIONS ====================
                const initializeAttendanceInput = () => {
                    mySantri.value.forEach(santri => {
                        if (!attendanceInput.value[santri.id]) {
                            attendanceInput.value[santri.id] = {};
                        }
                        
                        // Initialize all halaqah for this santri
                        halaqahList.value.forEach(halaqah => {
                            if (!attendanceInput.value[santri.id][halaqah.key]) {
                                attendanceInput.value[santri.id][halaqah.key] = 'tanpa_keterangan';
                            }
                        });
                        
                        // Load today's attendance data
                        const today = selectedDate.value;
                        const todayAttendance = attendanceProgress.value[santri.id]?.[today];
                        if (todayAttendance) {
                            halaqahList.value.forEach(halaqah => {
                                attendanceInput.value[santri.id][halaqah.key] = todayAttendance[halaqah.key] || 'tanpa_keterangan';
                            });
                        }
                    });
                };

                const saveAttendance = async (santriId, halaqahKey, date, status) => {
                    // Update local state first
                    if (!attendanceProgress.value[santriId]) {
                        attendanceProgress.value[santriId] = {};
                    }
                    
                    if (!attendanceProgress.value[santriId][date]) {
                        attendanceProgress.value[santriId][date] = {
                            date: date,
                            timestamp: new Date().toISOString()
                        };
                        
                        // Initialize all halaqah for this date
                        halaqahList.value.forEach(halaqah => {
                            attendanceProgress.value[santriId][date][halaqah.key] = 'tanpa_keterangan';
                        });
                    }
                    
                    attendanceProgress.value[santriId][date][halaqahKey] = status;
                    attendanceProgress.value[santriId][date].timestamp = new Date().toISOString();
                    
                    // Sync to Supabase if connected
                    if (supabaseClient.value && connectionStatus.value === 'connected') {
                        try {
                            const currentData = attendanceProgress.value[santriId][date];
                            
                            const attendanceData = {
                                santri_id: santriId,
                                date: date,
                                halaqah_1: currentData.halaqah_1 || 'tanpa_keterangan',
                                halaqah_2: currentData.halaqah_2 || 'tanpa_keterangan', 
                                halaqah_3: currentData.halaqah_3 || 'tanpa_keterangan',
                                attendance_data: JSON.stringify(currentData),
                                timestamp: currentData.timestamp,
                                musyrif_id: currentUser.value?.id,
                                updated_at: new Date().toISOString()
                            };
                            
                            const { error } = await supabaseClient.value
                                .from('attendance_progress')
                                .upsert(attendanceData, {
                                    onConflict: 'santri_id,date'
                                });
                                
                            if (error) {
                                console.error('Error syncing attendance to Supabase:', error);
                                showNotification('Data tersimpan lokal, akan disinkronisasi nanti', 'warning');
                            }
                        } catch (error) {
                            console.error('Error syncing attendance to Supabase:', error);
                            showNotification('Data tersimpan lokal, akan disinkronisasi nanti', 'warning');
                        }
                    }
                };

                const getAttendanceStatus = (santriId, halaqahKey, date) => {
                    return attendanceProgress.value[santriId]?.[date]?.[halaqahKey] || 'tanpa_keterangan';
                };

                const getAttendanceStatusText = (status) => {
                    const statusMap = {
                        'hadir': 'Hadir',
                        'izin': 'Izin',
                        'sakit': 'Sakit',
                        'tanpa_keterangan': 'Alpha'
                    };
                    return statusMap[status] || 'Alpha';
                };

                const getDailyAttendancePercentage = (santriId, date) => {
                    const attendance = attendanceProgress.value[santriId]?.[date];
                    if (!attendance) return 0;
                    
                    let presentCount = 0;
                    halaqahList.value.forEach(halaqah => {
                        if (attendance[halaqah.key] === 'hadir') {
                            presentCount++;
                        }
                    });
                    
                    return Math.round((presentCount / halaqahList.value.length) * 100);
                };

                const getMonthlyAttendanceAverage = (santriId) => {
                    const workingDates = getWorkingDateRange(attendanceFilter.month);
                    
                    if (workingDates.length === 0) return 0;
                    
                    let totalPercentage = 0;
                    workingDates.forEach(date => {
                        totalPercentage += getDailyAttendancePercentage(santriId, date);
                    });
                    
                    return Math.round(totalPercentage / workingDates.length);
                };

                const getMonthlyAttendancePercentage = (santriId) => {
                    return getMonthlyAttendanceAverage(santriId);
                };

const getMonthlyAttendanceSummary = () => {
    const workingDates = getWorkingDateRange(attendanceFilter.month);
    
    let totalAttendance = 0;
    let perfectDays = 0;
    let totalSantri = filteredSantriForAttendance.value.length;
    let bestAttendee = { name: '-', score: 0 };
    
    filteredSantriForAttendance.value.forEach(santri => {
        const monthlyAvg = getMonthlyAttendanceAverage(santri.id);
        totalAttendance += monthlyAvg;
        
        if (monthlyAvg > bestAttendee.score) {
            bestAttendee = { name: santri.name, score: monthlyAvg };
        }
        
        // Count perfect days (100% attendance) - hanya hari kerja
        workingDates.forEach(date => {
            if (getDailyAttendancePercentage(santri.id, date) === 100) {
                perfectDays++;
            }
        });
    });
    
    const totalHalaqah = workingDates.length * halaqahList.value.length;
    
    return {
        averageAttendance: totalSantri > 0 ? Math.round(totalAttendance / totalSantri) : 0,
        totalHalaqah,
        perfectDays,
        bestAttendee
    };
};

                // ==================== STORAGE & SYNC ====================
                const loadFromStorage = () => {
                    try {
                        const savedMusyrif = localStorage.getItem('musyrifList');
                        if (savedMusyrif) {
                            const parsed = JSON.parse(savedMusyrif);
                            // Add isActive flag if missing
                            musyrifList.value = parsed.map(item => ({
                                ...item,
                                isActive: item.isActive !== false
                            }));
                        }

                        const savedSantri = localStorage.getItem('santriList');
                        if (savedSantri) {
                            const parsed = JSON.parse(savedSantri);
                            santriList.value = parsed.map(item => ({
                                ...item,
                                isActive: item.isActive !== false
                            }));
                        }

                        const savedTahfizh = localStorage.getItem('tahfizhProgress');
                        if (savedTahfizh) {
                            tahfizhProgress.value = JSON.parse(savedTahfizh);
                        }

                        const savedIbadah = localStorage.getItem('ibadahProgress');
                        if (savedIbadah) {
                            ibadahProgress.value = JSON.parse(savedIbadah);
                        }

                        const savedAttendance = localStorage.getItem('attendanceProgress');
                        if (savedAttendance) {
                            attendanceProgress.value = JSON.parse(savedAttendance);
                        }

                        const savedDarkMode = localStorage.getItem('darkMode');
                        if (savedDarkMode !== null) {
                            darkMode.value = savedDarkMode === 'true';
                            if (darkMode.value) {
                                document.documentElement.classList.add('dark');
                            }
                        }
                    } catch (error) {
                        console.error('Error loading from storage:', error);
                    }
                };

                const saveToStorage = () => {
                    try {
                        localStorage.setItem('musyrifList', JSON.stringify(musyrifList.value));
                        localStorage.setItem('santriList', JSON.stringify(santriList.value));
                        localStorage.setItem('tahfizhProgress', JSON.stringify(tahfizhProgress.value));
                        localStorage.setItem('ibadahProgress', JSON.stringify(ibadahProgress.value));
                        localStorage.setItem('attendanceProgress', JSON.stringify(attendanceProgress.value));
                        localStorage.setItem('darkMode', darkMode.value.toString());
                    } catch (error) {
                        console.error('Error saving to storage:', error);
                    }
                };

                const autoSave = () => {
                    saveToStorage();
                };

                // ==================== WATCHERS ====================
                watch(mySantri, () => {
                    if (isMusyrif.value) {
                        initializeTahfizhInput();
                        initializeIbadahInput();
                        initializeAttendanceInput();
                    }
                }, { immediate: true });

                // Watch selected date untuk update attendance input
                watch(selectedDate, () => {
                    if (isMusyrif.value && activeTab.value === 'attendance-input') {
                        initializeAttendanceInput();
                    }
                });

                // ==================== LIFECYCLE ====================
                onMounted(async () => {
                    console.log('🚀 Application starting...');
                    
                    // Load data from localStorage first
                    loadFromStorage();
                    
                    // Initialize Supabase
                    await initializeSupabase();
                    
                    // Auto-save interval
                    setInterval(() => {
                        if (isLoggedIn.value || isPublicAccess.value) {
                            autoSave();
                        }
                    }, 30000);
                    
                    setTimeout(() => {
                        loading.value = false;
                    }, 1500);
                });

                return {
                    // Core state
                    loading,
                    isLoggedIn,
                    isAdmin,
                    isMusyrif,
                    isPublicAccess,
                    currentUser,
                    activeTab,
                    darkMode,
                    autoSaving,
                    isSubmitting,
                    isLoggingIn,
                    loginError,
                    selectedDate,
                    
                    // Supabase state
                    connectionStatus,
                    connectionStatusClass,
                    connectionStatusIcon,
                    connectionStatusText,
                    
                    // UI state
                    showSantriModal,
                    showMusyrifModal,
                    editingSantri,
                    editingMusyrif,
                    
                    // Forms
                    credentials,
                    santriForm,
                    musyrifForm,
                    santriFilter,
                    tahfizhFilter,
                    ibadahFilter,
                    attendanceFilter,
                    
                    // Data
                    musyrifList,
                    santriList,
                    ibadahList,
                    juzMapping,
                    halaqahList,
                    attendanceStatusOptions,
                    notifications,
                    tahfizhInput,
                    ibadahInput,
                    attendanceInput,
                    
                    // Computed
                    totalSantri,
                    totalMusyrif,
                    averageProgress,
                    todayAttendancePercentage,
                    availableMonths,
                    mySantri,
                    uniqueAngkatanList,
                    filteredSantri,
                    filteredSantriForRecap,
                    filteredSantriForIbadah,
                    filteredSantriForAttendance,
                    isSantriFormValid,
                    isMusyrifFormValid,
                    
                    // Methods
                    getCurrentDate,
                    getCurrentMonth,
                    getCurrentDateString,
                    formatDate,
                    formatDateShort,
                    formatDayName,
                    getAvailableMonths,
                    getDaysInMonth,
                    getDateRange,
                    getJuzFromPages,
                    isSunday,
                    isHoliday,
                    getWorkingDaysInMonth,
                    getWorkingDateRange,
    
                    navigateDate,
                    resetToToday,
                    toggleDarkMode,
                    showNotification,
                    removeNotification,
                    getNotificationClass,
                    getNotificationIcon,
                    
                    // Auth methods
                    login,
                    logout,
                    accessPublic,
                    backToLogin,
                    
                    // Santri management
                    openSantriModal,
                    closeSantriModal,
                    saveSantri,
                    editSantri,
                    deleteSantri,
                    
                    // Musyrif management
                    openMusyrifModal,
                    closeMusyrifModal,
                    saveMusyrif,
                    editMusyrif,
                    deleteMusyrif,
                    
                    // Helper functions
                    getMusyrifName,
                    getSantriByMusyrif,
                    getAngkatanCount,
                    getAngkatanAverageProgressJuz,
                    getAngkatanAverageProgressPercentage,
                    getSantriProgressPage,
                    getSantriCurrentJuz,
                    getSantriProgressPercentage,
                    getMonthlySetoranPages,
                    getMonthlyMurojaahTotal,
                    getMonthlyExamCount,
                    getLatestExam,
                    canSaveTahfizh,
                    saveTahfizhProgress,
                    getTodayTahfizhProgress,
                    toggleIbadah,
                    getIbadahCompletion,
                    getCompletedIbadahCount,
                    isIbadahCompleted,
                    getMonthlyIbadahAverage,
                    getMonthlyIbadahDetailBySantri,
                    showIbadahMonthlyDetail,
                    getMonthlyIbadahSummary,
                    openIbadahDetail,
                    
                    // Attendance methods
                    saveAttendance,
                    getAttendanceStatus,
                    getAttendanceStatusText,
                    getDailyAttendancePercentage,
                    getMonthlyAttendanceAverage,
                    getMonthlyAttendancePercentage,
                    getMonthlyAttendanceSummary
                };
            }
        });

        app.mount('#app');
